<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Schema;

class HomepageConfig
{
    public static function defaults(): array
    {
        return require database_path('seeders/homepage_default.php');
    }

    public static function merged(?array $stored = null): array
    {
        if ($stored === null) {
            if (! Schema::hasTable('site_settings')) {
                return self::defaults();
            }
            $row = SiteSetting::query()->where('key', 'homepage')->first();
            $stored = $row?->value;
        }

        if (! is_array($stored)) {
            return self::defaults();
        }

        return self::mergeDeep(self::defaults(), $stored);
    }

    /**
     * @param  array<string, mixed>  $defaults
     * @param  array<string, mixed>  $stored
     * @return array<string, mixed>
     */
    private static function mergeDeep(array $defaults, array $stored): array
    {
        foreach ($stored as $key => $value) {
            if (
                is_array($value)
                && isset($defaults[$key])
                && is_array($defaults[$key])
                && self::isAssoc($value)
            ) {
                $defaults[$key] = self::mergeDeep($defaults[$key], $value);
            } else {
                $defaults[$key] = $value;
            }
        }

        return $defaults;
    }

    /**
     * @param  array<mixed>  $array
     */
    private static function isAssoc(array $array): bool
    {
        if ($array === []) {
            return false;
        }

        return array_keys($array) !== range(0, count($array) - 1);
    }
}
