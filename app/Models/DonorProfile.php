<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonorProfile extends Model
{
    protected $fillable = [
        'user_id', 
        'blood_type', 
        'last_donation_date', 
        'is_available'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}