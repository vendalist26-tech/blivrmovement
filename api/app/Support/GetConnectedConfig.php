<?php

namespace App\Support;

use App\Models\GetConnectedInfoSection;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Schema;

class GetConnectedConfig
{
    /**
     * @return array{categories: array<int, array{value: string, label: string}>}
     */
    public static function all(): array
    {
        $row = SiteSetting::query()->where('key', 'get_connected')->first();
        $data = $row?->value ?? require database_path('seeders/get_connected_default.php');
        if (!is_array($data)) {
            $data = require database_path('seeders/get_connected_default.php');
        }
        if (empty($data['categories']) || !is_array($data['categories'])) {
            $data = require database_path('seeders/get_connected_default.php');
        }
        $data['infoSections'] = self::infoSections();

        return $data;
    }

    /**
     * @return list<array{title: string, groupTitle: ?string, description: ?string, details: string, badge: ?string, sortOrder: int}>
     */
    public static function infoSections(): array
    {
        $defaults = require database_path('seeders/get_connected_info_default.php');
        if (!Schema::hasTable('get_connected_info_sections')) {
            return $defaults;
        }

        $rows = GetConnectedInfoSection::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['title', 'group_title', 'description', 'details', 'badge', 'sort_order']);

        if ($rows->isEmpty()) {
            return $defaults;
        }

        return $rows->map(static fn (GetConnectedInfoSection $row): array => [
            'title' => (string) $row->title,
            'groupTitle' => $row->group_title ? (string) $row->group_title : null,
            'description' => $row->description ? (string) $row->description : null,
            'details' => (string) $row->details,
            'badge' => $row->badge ? (string) $row->badge : null,
            'sortOrder' => (int) $row->sort_order,
        ])->values()->all();
    }

    /**
     * @return list<string>
     */
    public static function categoryValues(): array
    {
        $cats = self::all()['categories'] ?? [];
        $values = array_map(static fn (array $c) => (string) ($c['value'] ?? ''), $cats);

        return array_values(array_filter($values, static fn (string $v) => $v !== ''));
    }
}
