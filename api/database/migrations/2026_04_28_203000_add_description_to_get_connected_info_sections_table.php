<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('get_connected_info_sections', function (Blueprint $table) {
            $table->string('description', 200)->nullable()->after('title');
        });
    }

    public function down(): void
    {
        Schema::table('get_connected_info_sections', function (Blueprint $table) {
            $table->dropColumn('description');
        });
    }
};

