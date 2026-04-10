<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class BloodInventoryProper extends Model
{
    protected $table = 'blood_inventory_proper';

    protected $fillable = [
        'blood_group',
        'available_units',
        'status',
        'low_threshold',
        'critical_threshold',
        'last_updated'
    ];

    protected $casts = [
        'last_updated' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Update inventory units and status
     */
    public function updateUnits(int $unitsChange, string $operation = 'add'): void
    {
        if ($operation === 'add') {
            $this->available_units += $unitsChange;
        } elseif ($operation === 'subtract') {
            $this->available_units = max(0, $this->available_units - $unitsChange);
        }
        
        $this->updateStatus();
        $this->last_updated = now();
        $this->save();
    }

    /**
     * Update status based on available units
     */
    public function updateStatus(): void
    {
        if ($this->available_units <= $this->critical_threshold) {
            $this->status = 'critical';
        } elseif ($this->available_units <= $this->low_threshold) {
            $this->status = 'low';
        } else {
            $this->status = 'available';
        }
    }

    /**
     * Get inventory summary for all blood groups
     */
    public static function getInventorySummary(): array
    {
        return self::all()->mapWithKeys(function ($item) {
            return [$item->blood_group => [
                'available_units' => $item->available_units,
                'status' => $item->status,
                'last_updated' => $item->last_updated,
                'low_threshold' => $item->low_threshold,
                'critical_threshold' => $item->critical_threshold
            ]];
        })->toArray();
    }

    /**
     * Get blood groups with low/critical status
     */
    public static function getLowStockGroups(): array
    {
        return self::whereIn('status', ['low', 'critical'])->get()->toArray();
    }

    /**
     * Get total available units across all blood groups
     */
    public static function getTotalUnits(): int
    {
        return self::sum('available_units');
    }

    /**
     * Find or create inventory record for blood group
     */
    public static function findOrCreateForBloodGroup(string $bloodGroup): self
    {
        return self::firstOrCreate(
            ['blood_group' => $bloodGroup],
            [
                'available_units' => 0,
                'status' => 'critical',
                'low_threshold' => 5,
                'critical_threshold' => 2,
                'last_updated' => now()
            ]
        );
    }
}
