<?php

namespace Database\Factories;

use App\Models\HospitalProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class HospitalProfileFactory extends Factory
{
    protected $model = HospitalProfile::class;

    public function definition()
    {
        return [
            'user_id' => User::factory()->hospital(),
            'hospital_name' => $this->faker->company(),
            'license_number' => $this->faker->unique()->numerify('HOSP-####'),
            'city' => $this->faker->city(),
            'address' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->companyEmail(),
            'website' => $this->faker->url(),
            'description' => $this->faker->paragraph(),
            'emergency_contact' => $this->faker->name(),
            'emergency_phone' => $this->faker->phoneNumber(),
        ];
    }
}
