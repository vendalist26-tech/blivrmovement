<?php

namespace App\Support;

use App\Models\SiteSetting;
use App\Models\UpcomingMeeting;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class UpcomingMeetingsConfig
{
    /**
     * @return array{page: array<string, string>, meetings: list<array<string, mixed>>, options: list<array{value: string, label: string}>}
     */
    public static function publicPayload(): array
    {
        return [
            'page' => self::pageSettings(),
            'meetings' => self::meetings(publicOnly: true),
            'options' => self::formOptions(),
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function pageSettings(): array
    {
        $defaults = require database_path('seeders/upcoming_meetings_page_default.php');
        if (! Schema::hasTable('site_settings')) {
            return $defaults;
        }

        $row = SiteSetting::query()->where('key', 'upcoming_meetings_page')->first();
        $data = $row?->value;
        if (! is_array($data)) {
            return $defaults;
        }

        $merged = array_merge($defaults, $data);
        $merged['stats'] = self::normalizeStats(
            $defaults['stats'] ?? [],
            is_array($data['stats'] ?? null) ? $data['stats'] : [],
        );
        if (array_key_exists('statsSectionVisible', $data)) {
            $merged['statsSectionVisible'] = (bool) $data['statsSectionVisible'];
        }
        if (array_key_exists('homepageSectionVisible', $data)) {
            $merged['homepageSectionVisible'] = (bool) $data['homepageSectionVisible'];
        }

        $merged['rsvp'] = FeaturedMeetingRsvpConfig::normalize(
            is_array($data['rsvp'] ?? null) ? $data['rsvp'] : null,
        );

        return $merged;
    }

    /**
     * @param  list<array<string, mixed>>  $defaults
     * @param  list<array<string, mixed>>  $incoming
     * @return list<array<string, mixed>>
     */
    private static function normalizeStats(array $defaults, array $incoming): array
    {
        $byId = [];
        foreach ($incoming as $row) {
            if (! is_array($row) || empty($row['id'])) {
                continue;
            }
            $byId[(string) $row['id']] = $row;
        }

        $normalized = [];
        foreach ($defaults as $def) {
            $id = (string) ($def['id'] ?? '');
            if ($id === '') {
                continue;
            }
            $row = $byId[$id] ?? [];
            $countType = (string) ($row['countType'] ?? $def['countType'] ?? 'total');
            if (! in_array($countType, ['total', 'in-person', 'online'], true)) {
                $countType = (string) ($def['countType'] ?? 'total');
            }
            $icon = (string) ($row['icon'] ?? $def['icon'] ?? 'calendar');
            if (! in_array($icon, ['calendar', 'users'], true)) {
                $icon = (string) ($def['icon'] ?? 'calendar');
            }
            $label = trim((string) ($row['label'] ?? $def['label'] ?? ''));
            $suffix = trim((string) ($row['suffix'] ?? $def['suffix'] ?? ''));
            $normalized[] = [
                'id' => $id,
                'label' => $label !== '' ? $label : (string) ($def['label'] ?? ''),
                'suffix' => $suffix !== '' ? $suffix : (string) ($def['suffix'] ?? ''),
                'countType' => $countType,
                'icon' => $icon,
                'visible' => array_key_exists('visible', $row) ? (bool) $row['visible'] : (bool) ($def['visible'] ?? true),
            ];
        }

        return $normalized;
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function meetings(bool $publicOnly = false): array
    {
        $defaults = require database_path('seeders/upcoming_meetings_default.php');
        if (! Schema::hasTable('upcoming_meetings')) {
            return self::mapMeetings($defaults, $publicOnly);
        }

        $query = UpcomingMeeting::query()->orderBy('sort_order')->orderBy('id');
        if ($publicOnly) {
            $query->where('is_active', true);
        }

        $rows = $query->get();
        if ($rows->isEmpty()) {
            return self::mapMeetings($defaults, $publicOnly);
        }

        return $rows->map(static fn (UpcomingMeeting $row): array => self::mapMeetingRow($row->toArray()))->values()->all();
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function formOptions(): array
    {
        return array_map(
            static fn (array $m): array => [
                'value' => (string) $m['value'],
                'label' => (string) $m['title'],
            ],
            self::meetings(publicOnly: true),
        );
    }

    public static function imageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        $relative = '/storage/'.ltrim($path, '/');
        if (! app()->runningInConsole() && request()) {
            return rtrim(request()->getSchemeAndHttpHost(), '/').$relative;
        }

        return rtrim((string) config('app.url'), '/').$relative;
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     * @return list<array<string, mixed>>
     */
    private static function mapMeetings(array $rows, bool $publicOnly): array
    {
        $mapped = array_map(static fn (array $row): array => self::mapMeetingRow($row), $rows);
        if (! $publicOnly) {
            return $mapped;
        }

        return array_values(array_filter($mapped, static fn (array $m): bool => (bool) ($m['isActive'] ?? true)));
    }

    /**
     * @param  array<string, mixed>  $row
     * @return array<string, mixed>
     */
    private static function mapMeetingRow(array $row): array
    {
        $path = $row['image_path'] ?? null;
        $highlights = $row['highlights'] ?? [];
        if (is_string($highlights)) {
            $highlights = json_decode($highlights, true) ?: [];
        }

        return [
            'value' => (string) ($row['value'] ?? ''),
            'title' => (string) ($row['title'] ?? ''),
            'tagline' => (string) ($row['tagline'] ?? ''),
            'schedule' => (string) ($row['schedule'] ?? ''),
            'cadence' => (string) ($row['cadence'] ?? ''),
            'location' => (string) ($row['location'] ?? ''),
            'format' => (string) ($row['format'] ?? 'in-person'),
            'imagePath' => $path,
            'imageUrl' => self::imageUrl($path),
            'imageAlt' => (string) ($row['image_alt'] ?? $row['imageAlt'] ?? ''),
            'description' => (string) ($row['description'] ?? ''),
            'highlights' => is_array($highlights) ? array_values($highlights) : [],
            'featured' => (bool) ($row['featured'] ?? false),
            'isActive' => (bool) ($row['is_active'] ?? $row['isActive'] ?? true),
            'sortOrder' => (int) ($row['sort_order'] ?? $row['sortOrder'] ?? 0),
        ];
    }
}
