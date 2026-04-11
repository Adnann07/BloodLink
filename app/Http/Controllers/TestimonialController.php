<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Testimonial;
class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::orderBy('created_at', 'desc')->get();
        return response()->json($testimonials);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'city'       => 'nullable|string|max:255',
            'role'       => 'required|in:donor,recipient,volunteer,other',
            'blood_type' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'message'    => 'required|string|min:20|max:1000',
        ]);
        // Save the validated testimonial data to the database
        $testimonial = Testimonial::create($validated);
        // Return the created testimonial as JSON with 201 Created HTTP status
        return response()->json($testimonial, 201);
    }
}
