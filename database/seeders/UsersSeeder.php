<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\DonorProfile;
use App\Models\HospitalProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BangladeshUsersSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin User
        $admin = User::create([
            'name' => 'Hasib Admin',
            'email' => 'admin@bloodlink.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+8801712345678',
            'address' => 'Dhaka Medical College, 14/1 Babupura, Shahbag, Dhaka 1000',
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);
        echo "Admin created: {$admin->email}\n";

        // 2. Donor User
        $donor = User::create([
            'name' => 'Rahim Ahmed',
            'email' => 'donor@bloodlink.com',
            'password' => Hash::make('password'),
            'role' => 'donor',
            'phone' => '+8801812345678',
            'address' => 'House 15, Road 4, Block C, Mirpur 10, Dhaka 1216',
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        DonorProfile::create([
            'user_id' => $donor->id,
            'blood_group' => 'O+',
            'date_of_birth' => '1995-05-15',
            'gender' => 'male',
            'weight_kg' => 72.50,
        ]);
        echo "Donor created: {$donor->email} (Blood Group: O+)\n";

        // 3. Hospital User
        $hospital = User::create([
            'name' => 'Dr. Fatima Rahman',
            'email' => 'hospital@bloodlink.com',
            'password' => Hash::make('password'),
            'role' => 'hospital',
            'phone' => '+8801912345678',
            'address' => 'Square Hospital, 18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka 1205',
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        HospitalProfile::create([
            'user_id' => $hospital->id,
            'hospital_name' => 'Square Hospital Dhaka',
            'license_number' => 'BD-HOS-12345',
            'city' => 'Dhaka',
        ]);
        echo "Hospital created: {$hospital->email} (Square Hospital)\n";

        echo "\nAll 3 Bangladeshi users created successfully!\n";
    }
}
