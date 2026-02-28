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
        $request->validate([
            'name'           => 'required|string',
            'email'          => 'required|email|unique:users',
            'password'       => 'required|min:6',
            'role'           => 'required|in:donor,hospital',
            'phone'          => 'nullable|string',
            'address'        => 'nullable|string',
            'blood_group'    => 'required_if:role,donor|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'date_of_birth'  => 'required_if:role,donor|date',
            'gender'         => 'required_if:role,donor|in:male,female,other',
            'weight_kg'      => 'nullable|numeric',
            'hospital_name'  => 'required_if:role,hospital|string',
            'license_number' => 'nullable|string',
            'city'           => 'nullable|string',
        ]);

        return $this->authService->register($request->all());
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