<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::query()->updateOrCreate(
            ['key' => 'homepage'],
            ['value' => require database_path('seeders/homepage_default.php')],
        );
    }
}
