<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonorProfile extends Model
{
    use HasFactory;

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