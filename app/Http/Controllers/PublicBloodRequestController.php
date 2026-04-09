<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PublicBloodRequest;

class PublicBloodRequestController extends Controller
{
    // GET /api/blood-requests — public list (open only, newest first)
    public function index()
    {
        $requests = PublicBloodRequest::where('status', 'open')
            ->orderByRaw("FIELD(urgency_level, 'critical', 'urgent', 'normal')")
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests);
    }

    // POST /api/blood-requests — public form submit
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_name'  => 'required|string|max:255',
            'contact_number'=> 'required|string|max:20',
            'email'         => 'nullable|email|max:255',
            'blood_type'    => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'units_needed'  => 'required|integer|min:1',
            'urgency_level' => 'required|in:normal,urgent,critical',
            'hospital_name' => 'required|string|max:255',
            'city'          => 'required|string|max:255',
            'required_by'   => 'nullable|date|after:today',
            'notes'         => 'nullable|string',
        ]);

        $bloodRequest = PublicBloodRequest::create($validated);

        return response()->json($bloodRequest, 201);
    }
}