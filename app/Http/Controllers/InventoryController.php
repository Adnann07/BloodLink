<?php

namespace App\Http\Controllers;

use App\Models\BloodInventoryProper;
use App\Models\BloodDonation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    /**
     * Get current blood inventory status
     */
    public function getInventory()
    {
        try {
            $inventory = BloodInventoryProper::getInventorySummary();
            $totalUnits = BloodInventoryProper::getTotalUnits();
            $lowStock = BloodInventoryProper::getLowStockGroups();

            return response()->json([
                'inventory' => $inventory,
                'total_units' => $totalUnits,
                'low_stock_groups' => $lowStock,
                'last_updated' => now()
            ])->header('Access-Control-Allow-Origin', '*')
             ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
             ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch inventory',
                'message' => $e->getMessage()
            ], 500)->header('Access-Control-Allow-Origin', '*');
        }
    }

    /**
     * Update inventory (admin only)
     */
    public function updateInventory(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'blood_group' => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'units_change' => 'required|integer|min:-1000|max:1000',
            'operation' => 'required|in:add,subtract,manual_set',
            'notes' => 'nullable|string|max:500'
        ]);

        try {
            $inventory = BloodInventoryProper::findOrCreateForBloodGroup($request->blood_group);

            if ($request->operation === 'manual_set') {
                $inventory->available_units = max(0, $request->units_change);
                $inventory->updateStatus();
            } else {
                $inventory->updateUnits($request->units_change, $request->operation);
            }

            // Log the inventory change
            $this->logInventoryChange($user, $inventory, $request);

            return response()->json([
                'message' => 'Inventory updated successfully',
                'inventory' => $inventory->fresh(),
                'summary' => BloodInventoryProper::getInventorySummary()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update inventory',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Record donation and update inventory
     */
    public function recordDonation(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'donor_email' => 'required|email|exists:users,email',
            'units_donated' => 'required|integer|min:1|max:5',
            'donation_date' => 'required|date|before_or_equal:today',
            'notes' => 'nullable|string|max:500'
        ]);

        try {
            DB::beginTransaction();

            // Find donor by email
            $donor = User::where('email', $request->donor_email)->first();
            if (!$donor) {
                return response()->json([
                    'error' => 'Donor not found',
                    'message' => 'No donor found with email: ' . $request->donor_email . '. Please check the email address and try again.'
                ], 404);
            }

            // Get donor's blood group from profile
            $bloodGroup = $donor->donorProfile?->blood_group;
            if (!$bloodGroup) {
                return response()->json([
                    'error' => 'Donor blood group not found',
                    'message' => 'This donor does not have a blood group recorded in their profile.'
                ], 400);
            }

            // Create donation record
            $donation = BloodDonation::create([
                'donor_id' => $donor->id,
                'blood_group' => $bloodGroup,
                'units_donated' => $request->units_donated,
                'donation_date' => $request->donation_date,
                'donation_time' => now()->format('H:i:s'),
                'recorded_by' => $user->id,
                'notes' => $request->notes,
                'status' => 'completed'
            ]);

            // Update inventory
            $inventory = BloodInventoryProper::findOrCreateForBloodGroup($bloodGroup);
            $inventory->updateUnits($request->units_donated, 'add');
            
            // Update donor profile
            if ($donor->donorProfile) {
                try {
                    $donor->donorProfile->update([
                        'last_donation_date' => $request->donation_date,
                        'next_eligible_date' => date('Y-m-d', strtotime($request->donation_date . ' + 56 days')),
                        'is_eligible' => false
                    ]);
                } catch (\Exception $profileError) {
                    // Log profile update error but don't fail the donation
                    \Log::error('Failed to update donor profile', [
                        'donor_id' => $donor->id,
                        'error' => $profileError->getMessage()
                    ]);
                }
            } else {
                // Create donor profile if it doesn't exist
                try {
                    \App\Models\DonorProfile::create([
                        'user_id' => $donor->id,
                        'blood_group' => $bloodGroup,
                        'last_donation_date' => $request->donation_date,
                        'next_eligible_date' => date('Y-m-d', strtotime($request->donation_date . ' + 56 days')),
                        'is_eligible' => false,
                        'date_of_birth' => '1990-01-01', // Default value
                        'gender' => 'other', // Default value
                        'weight_kg' => 70 // Default value
                    ]);
                } catch (\Exception $profileError) {
                    \Log::error('Failed to create donor profile', [
                        'donor_id' => $donor->id,
                        'error' => $profileError->getMessage()
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Donation recorded successfully',
                'donation' => $donation,
                'inventory' => $inventory->fresh(),
                'summary' => BloodInventoryProper::getInventorySummary()
            ])->header('Access-Control-Allow-Origin', '*')
             ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
             ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'error' => 'Failed to record donation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get donation history
     */
    public function getDonationHistory(Request $request)
    {
        try {
            $query = BloodDonation::with('donor');

            // Filter by date range if provided
            if ($request->from_date) {
                $query->whereDate('donation_date', '>=', $request->from_date);
            }
            if ($request->to_date) {
                $query->whereDate('donation_date', '<=', $request->to_date);
            }

            // Filter by blood group if provided
            if ($request->blood_group) {
                $query->where('blood_group', $request->blood_group);
            }

            $donations = $query->orderBy('donation_date', 'desc')
                ->paginate($request->per_page ?? 20);

            return response()->json($donations);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch donation history',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get inventory statistics
     */
    public function getInventoryStats()
    {
        try {
            $stats = [
                'total_units' => BloodInventoryProper::getTotalUnits(),
                'blood_groups' => BloodInventoryProper::count(),
                'low_stock_groups' => BloodInventoryProper::whereIn('status', ['low', 'critical'])->count(),
                'critical_groups' => BloodInventoryProper::where('status', 'critical')->count(),
                'total_donations_today' => BloodDonation::whereDate('donation_date', today())->count(),
                'total_donations_week' => BloodDonation::whereDate('donation_date', '>=', now()->subDays(7))->count(),
                'total_donations_month' => BloodDonation::whereDate('donation_date', '>=', now()->subDays(30))->count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get donor list for dropdown
     */
    public function getDonors()
    {
        try {
            $donors = User::where('role', 'donor')
                ->with('donorProfile')
                ->get(['id', 'name', 'email'])
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'blood_group' => $user->donorProfile?->blood_group ?? 'N/A',
                        'last_donation' => $user->donorProfile?->last_donation_date,
                        'is_eligible' => $user->donorProfile?->is_eligible ?? true
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
     * Get donor details by email
     */
    public function getDonorByEmail(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email'
            ]);

            $donor = User::where('email', $request->email)
                ->where('role', 'donor')
                ->with('donorProfile')
                ->first();

            if (!$donor) {
                return response()->json([
                    'error' => 'Donor not found',
                    'message' => 'No donor found with this email address'
                ], 404);
            }

            return response()->json([
                'id' => $donor->id,
                'name' => $donor->name,
                'email' => $donor->email,
                'blood_group' => $donor->donorProfile?->blood_group,
                'last_donation' => $donor->donorProfile?->last_donation_date,
                'is_eligible' => $donor->donorProfile?->is_eligible ?? true,
                'next_eligible_date' => $donor->donorProfile?->next_eligible_date
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch donor details',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get donor's donation history
     */
    public function getDonorDonationHistory(Request $request)
    {
        try {
            $user = Auth::user();
            if ($user->role !== 'donor') {
                return response()->json([
                    'error' => 'Unauthorized',
                    'message' => 'Only donors can access their donation history'
                ], 403);
            }

            $donations = BloodDonation::where('donor_id', $user->id)
                ->with('donor')
                ->orderBy('donation_date', 'desc')
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'data' => $donations->items(),
                'pagination' => [
                    'current_page' => $donations->currentPage(),
                    'total_pages' => $donations->lastPage(),
                    'total_items' => $donations->total(),
                    'per_page' => $donations->perPage()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch donation history',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Log inventory changes
     */
    private function logInventoryChange($user, $inventory, $request)
    {
        // This could be expanded to create a proper audit trail table
        \Log::info('Inventory updated', [
            'user_id' => $user->id,
            'blood_group' => $inventory->blood_group,
            'operation' => $request->operation,
            'units_change' => $request->units_change,
            'new_units' => $inventory->available_units,
            'notes' => $request->notes,
            'timestamp' => now()
        ]);
    }
}
