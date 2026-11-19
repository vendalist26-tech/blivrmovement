<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('get_connected_info_sections', function (Blueprint $table) {
            $table->id();
            $table->string('title', 120);
            $table->text('details');
            $table->string('badge', 40)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        $now = now();
        $defaults = require database_path('seeders/get_connected_info_default.php');
        $rows = array_map(static function (array $row, int $index) use ($now): array {
            return [
                'title' => (string) ($row['title'] ?? ''),
                'details' => (string) ($row['details'] ?? ''),
                'badge' => isset($row['badge']) ? (string) $row['badge'] : null,
                'sort_order' => isset($row['sortOrder']) ? (int) $row['sortOrder'] : $index,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $defaults, array_keys($defaults));

        if (!empty($rows)) {
            DB::table('get_connected_info_sections')->insert($rows);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('get_connected_info_sections');
    }
};

