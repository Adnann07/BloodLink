<?php

namespace App\Http\Controllers;

use App\Http\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register a new user (donor or hospital)
     */
    public function register(Request $request)
    {
        try {
            // Base validation for all users
            $rules = [
                'name'           => 'required|string',
                'email'          => 'required|email|unique:users',
                'password'       => 'required|min:6',
                'role'           => 'required|in:donor,hospital',
                'phone'          => 'nullable|string',
                'address'        => 'nullable|string',
            ];
            
            // Add donor-specific validation
            if ($request->role === 'donor') {
                $rules['blood_group'] = 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-';
                $rules['date_of_birth'] = 'required|date';
                $rules['gender'] = 'required|in:male,female,other';
                $rules['weight_kg'] = 'nullable|numeric';
            }
            
            // Add hospital-specific validation
            if ($request->role === 'hospital') {
                $rules['hospital_name'] = 'required|string';
                $rules['license_number'] = 'nullable|string';
                $rules['city'] = 'nullable|string';
            }
            
            $validated = $request->validate($rules);

            return $this->authService->register($request->all());
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Registration failed',
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Login and get token
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        return $this->authService->login($request->all());
    }

    /**
     * Logout and invalidate token
     */
    public function logout(Request $request)
    {
        return $this->authService->logout($request->user());
    }

    /**
     * Get current logged in user
     */
    public function me(Request $request)
    {
        return $this->authService->me($request->user());
    }
}