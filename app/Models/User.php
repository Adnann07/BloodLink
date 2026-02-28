<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        "id",
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function donorProfile()
    {
        return $this->hasOne(DonorProfile::class);
    }

    public function hospitalProfile()
    {
        return $this->hasOne(HospitalProfile::class);
    }

    public function donations()
    {
        return $this->hasMany(Donation::class, 'donor_id');
    }

    public function bloodRequests()
    {
        return $this->hasMany(BloodRequest::class, 'hospital_id');
    }

    public function eventRegistrations()
    {
        return $this->hasMany(EventRegistration::class, 'donor_id');
    }

    public function volunteer()
    {
        return $this->hasOne(Volunteer::class);
    }
}