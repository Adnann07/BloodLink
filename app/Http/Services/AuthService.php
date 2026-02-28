<?php

namespace App\Http\Services;

use App\Models\User;
use App\Models\DonorProfile;
use App\Models\HospitalProfile;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function register(array $data)
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $data['role'],
            'phone'    => $data['phone'] ?? null,
            'address'  => $data['address'] ?? null,
        ]);

        if ($user->role === 'donor') {
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

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registered successfully',
            'token'   => $token,
            'user'    => $user,
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

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => $user,
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
        return response()->json([
            'data' => $user,
        ]);
    }
}