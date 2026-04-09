<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicBloodRequest extends Model
{
    protected $fillable = [
        'patient_name',
        'contact_number',
        'email',
        'blood_type',
        'units_needed',
        'urgency_level',
        'hospital_name',
        'city',
        'required_by',
        'notes',
        'status',
    ];
}