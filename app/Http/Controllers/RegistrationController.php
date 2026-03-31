<?php

namespace App\Http\Controllers;

use App\Models\Donor;
use App\Models\Message;
use App\Models\Volunteer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RegistrationController extends Controller
{
    /**
     * Store a new donor in the database.
     */
    public function storeDonor(Request $request)
    {
        try {
            $validated = $request->validate([
                'full_name'   => 'required|string|max:100',
                'blood_group' => 'required|string|max:10',
                'age'         => 'nullable|integer|min:18|max:100',
                'city'        => 'nullable|string|max:50',
                'phone'       => 'nullable|string|max:20',
            ]);

            $donor = Donor::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Donor registered successfully!',
                'data'    => $donor
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Donor Registration Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server error',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new volunteer in the database.
     */
    public function storeVolunteer(Request $request)
    {
        try {
            $validated = $request->validate([
                'full_name'    => 'required|string|max:100',
                'email'         => 'nullable|email|max:100',
                'phone'         => 'nullable|string|max:20',
                'availability'  => 'nullable|string|max:50',
            ]);

            $volunteer = Volunteer::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Volunteer registered successfully!',
                'data'    => $volunteer
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Volunteer Registration Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server error',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new contact message in the database.
     */
    public function storeMessage(Request $request)
    {
        try {
            $validated = $request->validate([
                'full_name' => 'required|string|max:100',
                'email'     => 'nullable|email|max:100',
                'message'   => 'required|string',
            ]);

            $message = Message::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully!',
                'data'    => $message
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Contact Message Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server error',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
