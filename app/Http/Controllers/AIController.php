<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate(['message' => 'required|string']);

        $apiKey = env('GEMINI_API_KEY');
        $model = 'gemini-2.5-flash';

        $systemPrompt = 'You are a Blood Donation Assistant. Your role is to provide accurate, helpful information about blood donation. You can answer questions about: eligibility criteria, blood types, donation process, preparation before donation, aftercare, health benefits, myths vs facts, finding blood drives, and donor safety. Always be encouraging, informative, and safety-conscious. If someone asks about medical emergencies or personal medical advice, remind them to consult healthcare professionals. Keep responses concise and friendly.';

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post(
            "https://generativelanguage.googleapis.com/v1/models/{$model}:generateContent?key={$apiKey}",
            [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $systemPrompt . "\n\nUser question: " . $request->message]
                        ]
                    ]
                ]
            ]
        );

        if ($response->failed()) {
            return response()->json([
                'error' => 'Gemini API error',
                'details' => $response->json()
            ], 500);
        }

        $data = $response->json();
        $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'No response';

        return response()->json([
            'reply' => $text,
        ]);
    }
}