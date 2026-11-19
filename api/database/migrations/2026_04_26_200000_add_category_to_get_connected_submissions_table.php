<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('get_connected_submissions', function (Blueprint $table): void {
            $table->string('category', 80)->nullable()->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('get_connected_submissions', function (Blueprint $table): void {
            $table->dropColumn('category');
        });
    }
};
