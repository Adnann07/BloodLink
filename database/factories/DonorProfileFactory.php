<?php

namespace Database\Factories;

use App\Models\DonorProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DonorProfileFactory extends Factory
{
    protected $model = DonorProfile::class;

    public function definition()
    {
        return [
            'user_id' => User::factory()->donor(),
            'blood_group' => $this->faker->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            'date_of_birth' => $this->faker->date('Y-m-d', '-18 years'),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'weight_kg' => $this->faker->numberBetween(50, 120),
            'last_donation_date' => $this->faker->optional()->date('Y-m-d', '-3 months'),
            'donation_count' => $this->faker->numberBetween(0, 50),
            'emergency_contact' => $this->faker->name(),
            'emergency_phone' => $this->faker->phoneNumber(),
            'medical_conditions' => $this->faker->optional()->paragraph(),
            'address' => $this->faker->address(),
        ];
    }
}
