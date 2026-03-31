<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donor extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'blood_group',
        'age',
        'city',
        'phone',
    ];

    public $timestamps = false; // Using database default for created_at
}
