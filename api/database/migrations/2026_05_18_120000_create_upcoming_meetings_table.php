<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('upcoming_meetings', function (Blueprint $table) {
            $table->id();
            $table->string('value', 80)->unique();
            $table->string('title', 160);
            $table->string('tagline', 255)->nullable();
            $table->string('schedule', 255);
            $table->string('cadence', 120)->nullable();
            $table->string('location', 500);
            $table->string('format', 20)->default('in-person');
            $table->string('image_path', 500)->nullable();
            $table->string('image_alt', 255)->nullable();
            $table->text('description');
            $table->json('highlights')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        $now = now();
        $defaults = require database_path('seeders/upcoming_meetings_default.php');
        $rows = array_map(static function (array $row) use ($now): array {
            return [
                'value' => (string) $row['value'],
                'title' => (string) $row['title'],
                'tagline' => $row['tagline'] ?? null,
                'schedule' => (string) $row['schedule'],
                'cadence' => $row['cadence'] ?? null,
                'location' => (string) $row['location'],
                'format' => (string) ($row['format'] ?? 'in-person'),
                'image_path' => $row['image_path'] ?? null,
                'image_alt' => $row['image_alt'] ?? null,
                'description' => (string) $row['description'],
                'highlights' => json_encode($row['highlights'] ?? [], JSON_THROW_ON_ERROR),
                'featured' => (bool) ($row['featured'] ?? false),
                'is_active' => (bool) ($row['is_active'] ?? true),
                'sort_order' => (int) ($row['sort_order'] ?? 0),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $defaults);

        if (! empty($rows)) {
            DB::table('upcoming_meetings')->insert($rows);
        }

        $pageDefaults = require database_path('seeders/upcoming_meetings_page_default.php');
        if (Schema::hasTable('site_settings')) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => 'upcoming_meetings_page'],
                [
                    'value' => json_encode($pageDefaults, JSON_THROW_ON_ERROR),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('upcoming_meetings');
        DB::table('site_settings')->where('key', 'upcoming_meetings_page')->delete();
    }
};
