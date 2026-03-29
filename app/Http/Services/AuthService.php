<?php

namespace App\Http\Services;

use App\Models\User;
use App\Models\DonorProfile;
use App\Models\HospitalProfile;
use Illuminate\Support\Facades\Hash;
use App\Http\Services\EmailVerificationService;

class AuthService
{
    private EmailVerificationService $emailVerificationService;

    public function __construct(EmailVerificationService $emailVerificationService)
    {
        $this->emailVerificationService = $emailVerificationService;
    }

    public function register(array $data)
    {
        \Log::info('AuthService register called with data:', $data);
        
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $data['role'],
            'phone'    => $data['phone'] ?? null,
            'address'  => $data['address'] ?? null,
            'is_verified' => false, // User starts as unverified
        ]);

        if ($user->role === 'donor') {
            // Debug: return data to see what's received
            if (empty($data['blood_group']) || empty($data['date_of_birth']) || empty($data['gender'])) {
                return response()->json([
                    'error' => 'Missing donor data',
                    'received_data' => $data,
                    'blood_group' => $data['blood_group'] ?? 'MISSING',
                    'date_of_birth' => $data['date_of_birth'] ?? 'MISSING',
                    'gender' => $data['gender'] ?? 'MISSING',
                ], 422);
            }
            
            DonorProfile::create([
                'user_id'       => $user->id,
                'blood_group'   => $data['blood_group'],
                'date_of_birth' => $data['date_of_birth'],
                'gender'        => $data['gender'],
                'weight_kg'     => $data['weight_kg'] ?? null,
            ]);
        }

        if ($user->role === 'hospital') {
            HospitalProfile::create([
                'user_id'        => $user->id,
                'hospital_name'  => $data['hospital_name'],
                'license_number' => $data['license_number'] ?? null,
                'city'           => $data['city'] ?? null,
            ]);
        }

        // Send OTP for email verification
        $otpSent = $this->emailVerificationService->sendOTP($user->email);
        
        if (!$otpSent) {
            // If OTP fails, delete user and return error
            $user->delete();
            return response()->json([
                'error' => 'Failed to send verification email',
                'message' => 'Please check your email address and try again'
            ], 422);
        }

        return response()->json([
            'message' => 'Registration successful! Please check your email for verification code.',
            'user'    => $user,
            'requires_verification' => true
        ], 201);
    }

    public function login(array $data)
    {
        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // Check if user is verified
        if (!$user->is_verified) {
            return response()->json([
                'message' => 'Please verify your email first',
                'requires_verification' => true,
                'email' => $user->email
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => $user,
            'redirect_url' => $user->role === 'hospital' ? '/hospital/dashboard' : '/dashboard'
        ]);
    }

    public function logout($user)
    {
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function me($user)
    {
        // Load user with relationships based on role
        if ($user->role === 'donor') {
            $user->load('donorProfile');
        } elseif ($user->role === 'hospital') {
            $user->load('hospitalProfile');
        }
        
        return response()->json($user);
    }

    /**
     * Verify OTP and activate user account
     */
    public function verifyEmail(array $data)
    {
        $result = $this->emailVerificationService->verifyOTP($data['email'], $data['otp']);
        
        if (!$result['success']) {
            return response()->json([
                'error' => 'Verification failed',
                'message' => $result['message']
            ], 422);
        }
        
        // Find and update user
        $user = User::where('email', $data['email'])->first();
        if (!$user) {
            return response()->json([
                'error' => 'User not found'
            ], 404);
        }
        
        $user->update([
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);
        
        // Generate token for automatic login
        $token = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'message' => 'Email verified successfully!',
            'token' => $token,
            'user' => $user,
            'redirect_url' => $user->role === 'hospital' ? '/hospital/dashboard' : '/dashboard'
        ]);
    }
    
    /**
     * Resend OTP
     */
    public function resendOTP(array $data)
    {
        $user = User::where('email', $data['email'])->first();
        if (!$user) {
            return response()->json([
                'error' => 'User not found'
            ], 404);
        }
        
        if ($user->is_verified) {
            return response()->json([
                'error' => 'Email already verified'
            ], 422);
        }
        
        $otpSent = $this->emailVerificationService->resendOTP($user->email);
        
        if (!$otpSent) {
            return response()->json([
                'error' => 'Failed to send verification email'
            ], 422);
        }
        
        return response()->json([
            'message' => 'Verification code sent successfully!'
        ]);
    }
}