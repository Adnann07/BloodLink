<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;

class ContactController extends Controller
{
    /**
     * Handle contact form submission
     */
    public function send(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'subject' => 'required|string|max:255',
                'message' => 'required|string|max:2000'
            ]);

            // Log the contact form submission
            Log::info('Contact form submission received', $validated);

            // Log email configuration for debugging
            Log::info('Email config', [
                'mailer' => config('mail.mailer'),
                'host' => config('mail.host'),
                'port' => config('mail.port'),
                'username' => config('mail.username'),
                'encryption' => config('mail.encryption'),
            ]);

            // Try to send email
            try {
                Mail::to('hasibshahriar04@gmail.com')->send(new ContactFormMail($validated));
                Log::info('Contact email sent successfully to hasibshahriar04@gmail.com');
                
                return response()->json([
                    'success' => true,
                    'message' => 'Thank you for contacting us! We will get back to you soon.'
                ]);

            } catch (\Exception $e) {
                Log::error('Failed to send contact email: ' . $e->getMessage());
                Log::error('Email error details: ' . $e->getTraceAsString());
                
                // Return error to user for debugging
                return response()->json([
                    'success' => false,
                    'message' => 'Email failed to send: ' . $e->getMessage(),
                    'debug' => 'Check Laravel logs for more details'
                ]);
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Contact form submission error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
