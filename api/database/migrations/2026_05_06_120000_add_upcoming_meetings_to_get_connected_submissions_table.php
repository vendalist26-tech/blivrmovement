<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('get_connected_submissions', function (Blueprint $table): void {
            $table->json('upcoming_meetings')->nullable()->after('interests');
        });
    }

    public function down(): void
    {
        Schema::table('get_connected_submissions', function (Blueprint $table): void {
            $table->dropColumn('upcoming_meetings');
        });
    }
};
