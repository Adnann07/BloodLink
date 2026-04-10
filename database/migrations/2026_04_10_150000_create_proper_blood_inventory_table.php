<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create the proper blood inventory table
        Schema::create('blood_inventory_proper', function (Blueprint $table) {
            $table->id();
            $table->enum('blood_group', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
            $table->integer('available_units')->default(0);
            $table->enum('status', ['available', 'low', 'critical'])->default('available');
            $table->integer('low_threshold')->default(5);
            $table->integer('critical_threshold')->default(2);
            $table->timestamp('last_updated')->nullable();
            $table->timestamps();

            $table->unique('blood_group');
        });

        // Seed initial inventory data
        DB::table('blood_inventory_proper')->insert([
            ['blood_group' => 'A+', 'available_units' => 10, 'status' => 'available', 'low_threshold' => 5, 'critical_threshold' => 2, 'last_updated' => now()],
            ['blood_group' => 'A-', 'available_units' => 8, 'status' => 'available', 'low_threshold' => 5, 'critical_threshold' => 2, 'last_updated' => now()],
            ['blood_group' => 'B+', 'available_units' => 12, 'status' => 'available', 'low_threshold' => 5, 'critical_threshold' => 2, 'last_updated' => now()],
            ['blood_group' => 'B-', 'available_units' => 4, 'status' => 'low', 'low_threshold' => 5, 'critical_threshold' => 2, 'last_updated' => now()],
            ['blood_group' => 'AB+', 'available_units' => 6, 'status' => 'available', 'low_threshold' => 5, 'critical_threshold' => 2, 'last_updated' => now()],
            ['blood_group' => 'AB-', 'available_units' => 3, 'status' => 'low', 'low_threshold' => 5, 'critical_threshold' => 2, 'last_updated' => now()],
            ['blood_group' => 'O+', 'available_units' => 15, 'status' => 'available', 'low_threshold' => 5, 'critical_threshold' => 2, 'last_updated' => now()],
            ['blood_group' => 'O-', 'available_units' => 7, 'status' => 'available', 'low_threshold' => 5, 'critical_threshold' => 2, 'last_updated' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blood_inventory_proper');
    }
};
