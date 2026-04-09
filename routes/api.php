<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\HospitalDashboardController;
use App\Http\Controllers\DonorController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PublicBloodRequestController;
use App\Http\Controllers\VolunteerController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Test route
Route::get('/test', function() {
    return response()->json(['message' => 'API is working']);
});

// AI Chat route
Route::post('/chat', [\App\Http\Controllers\AIController::class, 'chat']);

// Auth routes
Route::post('/register', [AuthController::class, 'register'])->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);
Route::post('/login', [AuthController::class, 'login'])->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);
Route::post('/verify-email', [AuthController::class, 'verifyEmail'])->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);
Route::post('/resend-otp', [AuthController::class, 'resendOTP'])->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);

// Public routes
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/blood-requests', [PublicBloodRequestController::class, 'index']);
Route::post('/blood-requests', [PublicBloodRequestController::class, 'store']);

// Volunteer routes (public)
Route::get('/volunteers', [VolunteerController::class, 'index']);
Route::post('/volunteers', [VolunteerController::class, 'store'])->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);

// Testimonial routes (public)
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::post('/testimonials', [TestimonialController::class, 'store']);

// Donors list route (public access)
Route::get('/donors', [UsersController::class, 'getDonors']);

// Admin stats route
Route::get('/admin/stats', [UsersController::class, 'getAdminStats'])->middleware('auth:sanctum');

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Hospital routes
    Route::prefix('hospital')->group(function () {
        Route::get('/dashboard', [HospitalDashboardController::class, 'index']);
        Route::get('/profile', [HospitalDashboardController::class, 'profile']);
        Route::put('/profile', [HospitalDashboardController::class, 'updateProfile']);
        Route::post('/blood-request', [HospitalDashboardController::class, 'storeBloodRequest']);
    });

    // Donor routes
    Route::prefix('donor')->group(function () {
        Route::get('/dashboard', [DonorController::class, 'dashboard']);
    });
});

// Dummy CRUD routes
Route::get('/items', [UsersController::class, 'index']);
Route::get('/items/{id}', [UsersController::class, 'show']);
Route::post('/items', [UsersController::class, 'store']);
Route::put('/items/{id}', [UsersController::class, 'update']);
Route::patch('/items/{id}', [UsersController::class, 'patch']);
Route::delete('/items/{id}', [UsersController::class, 'destroy']);