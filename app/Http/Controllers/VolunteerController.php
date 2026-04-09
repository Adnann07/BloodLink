<?php

namespace App\Http\Controllers;

use App\Models\Volunteer;
use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    public function index()
    {
        $categories = [
            'Blood Donor Volunteer',
            'Awareness Campaigner',
            'Blood Donation Campaign Volunteer',
            'Healthcare Professional',
        ];

        $grouped = [];
        foreach ($categories as $category) {
            $grouped[$category] = Volunteer::where('category', $category)
                ->select('id', 'name', 'city', 'category', 'availability', 'experience', 'motivation', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json(['volunteers' => $grouped]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'         => 'required|string|max:255',
                'email'        => 'required|email|max:255|unique:volunteers,email',
                'phone'        => 'nullable|string|max:20',
                'city'         => 'nullable|string|max:100',
                'category'     => 'required|string|in:Blood Donor Volunteer,Awareness Campaigner,Blood Donation Campaign Volunteer,Healthcare Professional',
                'availability' => 'nullable|string|max:255',
                'experience'   => 'nullable|string|max:1000',
                'motivation'   => 'nullable|string|max:1000',
            ]);

            $volunteer = Volunteer::create($validated);

            return response()->json([
                'message'   => 'Application submitted successfully. We will be in touch soon.',
                'volunteer' => $volunteer,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => $e->errors()['email'][0] ?? 'Validation failed.',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong. Please try again.',
            ], 500);
        }
    }
}
