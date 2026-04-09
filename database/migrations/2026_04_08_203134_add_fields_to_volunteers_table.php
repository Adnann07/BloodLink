
<?php

use Illuminate\Database\Migrations\Migration;

use Illuminate\Database\Schema\Blueprint;

use Illuminate\Support\Facades\Schema;

return new class extends Migration

{

    public function up(): void

    {

        Schema::table('volunteers', function (Blueprint $table) {

            $table->enum('category', [

                'Blood Donor Volunteer',

                'Awareness Campaigner',

                'Blood Donation Campaign Volunteer',

                'Healthcare Professional'

            ])->after('email');

            $table->string('availability')->nullable()->after('city');

            $table->text('experience')->nullable()->after('availability');

        });

    }

    public function down(): void

    {

        Schema::table('volunteers', function (Blueprint $table) {

            $table->dropColumn(['category', 'availability', 'experience']);

        });

    }

};

