<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Volunteer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'city',
        'category',
        'availability',
        'experience',
        'motivation',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
