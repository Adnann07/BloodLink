<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('public_blood_requests', function (Blueprint $table) {
            $table->id();
            $table->string('patient_name');
            $table->string('contact_number');
            $table->string('email')->nullable();
            $table->enum('blood_type', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
            $table->integer('units_needed')->default(1);
            $table->enum('urgency_level', ['normal', 'urgent', 'critical'])->default('normal');
            $table->string('hospital_name');
            $table->string('city');
            $table->date('required_by')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['open', 'fulfilled', 'closed'])->default('open');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('public_blood_requests');
    }
};
