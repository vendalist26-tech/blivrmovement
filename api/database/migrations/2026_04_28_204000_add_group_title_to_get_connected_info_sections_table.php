<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('get_connected_info_sections', function (Blueprint $table) {
            $table->string('group_title', 120)->nullable()->after('title');
        });

        // Backfill existing rows so current data starts grouped similarly.
        DB::table('get_connected_info_sections')
            ->whereNull('group_title')
            ->orWhere('group_title', '')
            ->update([
                'group_title' => DB::raw('CASE WHEN description IS NOT NULL AND description <> "" THEN description ELSE title END'),
            ]);
    }

    public function down(): void
    {
        Schema::table('get_connected_info_sections', function (Blueprint $table) {
            $table->dropColumn('group_title');
        });
    }
};

