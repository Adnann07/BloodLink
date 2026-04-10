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
        Schema::table('blood_donations', function (Blueprint $table) {
            $table->string('blood_group')->nullable()->after('donor_id');
            $table->integer('units_donated')->default(1)->after('blood_group');
            $table->integer('recorded_by')->nullable()->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blood_donations', function (Blueprint $table) {
            $table->dropColumn(['blood_group', 'units_donated', 'recorded_by']);
        });
    }
};
