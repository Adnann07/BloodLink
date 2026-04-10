<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BloodDonation extends Model
{
    protected $fillable = [
        'donor_id',
        'hospital_id',
        'blood_group',
        'units_donated',
        'donation_type',
        'donation_date',
        'donation_time',
        'status',
        'volume_ml',
        'notes',
        'location',
        'recorded_by'
    ];

    protected $casts = [
        'donation_date' => 'date',
        'donation_time' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function donor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'donor_id');
    }

    public function hospital(): BelongsTo
    {
        return $this->belongsTo(User::class, 'hospital_id');
    }
}
