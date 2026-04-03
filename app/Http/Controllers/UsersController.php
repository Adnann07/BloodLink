<?php

namespace App\Http\Controllers;

use App\Http\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class UsersController extends Controller
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Get admin statistics
     */
    public function getAdminStats()
    {
        try {
            $stats = [
                'totalUsers' => \App\Models\User::count(),
                'totalDonors' => \App\Models\User::where('role', 'donor')->count(),
                'totalHospitals' => \App\Models\User::where('role', 'hospital')->count(),
                'totalDonations' => \App\Models\BloodDonation::count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch admin stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all donors with their profiles
     */
    public function getDonors()
    {
        try {
            $donors = \App\Models\User::where('role', 'donor')
                ->with('donorProfile')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone ?: 'Not provided',
                        'blood_group' => $user->donorProfile?->blood_group ?? 'N/A',
                        'location' => $user->address ?? 'Location not specified',
                        'total_donations' => $user->donations()->count() ?? 0,
                        'last_donation' => $user->donations()->latest()->first()?->donation_date ?? null,
                        'date_of_birth' => $user->donorProfile?->date_of_birth,
                        'gender' => $user->donorProfile?->gender,
                        'weight_kg' => $user->donorProfile?->weight_kg,
                    ];
                });

            return response()->json($donors);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch donors',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       return $this->userService->getUsers();
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return response()->json([
            'data' => [
                'id' => $id,
                'name' => 'Item ' . $id,
                'description' => 'Description for item ' . $id,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $body = $request->json();

        // Log to console/logs instead of response
        logger()->info('POST /items - Request body:', ['body' => $body]);
        logger()->info('POST /items - All request data:', $request->all());

        return response()->json([
            'message' => 'Item created successfully',
            'data' => [
                'id' => rand(100, 999),
                'name' => $body->get('name'),
                'description' => $request->input('description', 'Item description'),
                'created_at' => now(),
            ]
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        return response()->json([
            'message' => 'Item updated successfully',
            'data' => [
                'id' => $id,
                'name' => $request->input('name', 'Updated Item'),
                'description' => $request->input('description', 'Updated description'),
                'updated_at' => now(),
            ]
        ]);
    }

    /**
     * Partially update the specified resource in storage.
     */
    public function patch(Request $request, $id)
    {
        return response()->json([
            'message' => 'Item partially updated successfully',
            'data' => [
                'id' => $id,
                'name' => $request->input('name', 'Partially Updated Item'),
                'description' => $request->input('description', 'Partially updated description'),
                'updated_at' => now(),
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        return response()->json([
            'message' => 'Item deleted successfully',
            'data' => [
                'id' => $id,
            ]
        ]);
    }
}

