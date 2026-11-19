<?php

namespace App\Support;

class FeaturedMeetingRsvpConfig
{
    /** @var list<string> */
    public const FIELD_TYPES = ['text', 'email', 'tel', 'number', 'textarea'];

    public const FIELD_ID_PATTERN = '/^[a-z][a-z0-9_]{0,63}$/';

    public static function defaults(): array
    {
        return require database_path('seeders/upcoming_meetings_rsvp_default.php');
    }

    /**
     * @param  array<string, mixed>|null  $incoming
     * @return array<string, mixed>
     */
    public static function normalize(?array $incoming = null): array
    {
        $defaults = self::defaults();
        if (! is_array($incoming)) {
            return $defaults;
        }

        $merged = array_merge($defaults, $incoming);
        $merged['enabled'] = (bool) ($incoming['enabled'] ?? $defaults['enabled'] ?? true);
        $merged['fields'] = self::normalizeFields(
            $defaults['fields'] ?? [],
            is_array($incoming['fields'] ?? null) ? $incoming['fields'] : [],
        );

        return $merged;
    }

    /**
     * @param  list<array<string, mixed>>  $defaults
     * @param  list<array<string, mixed>>  $incoming
     * @return list<array<string, mixed>>
     */
    public static function normalizeFields(array $defaults, array $incoming): array
    {
        $defaultById = [];
        foreach ($defaults as $field) {
            if (is_array($field) && ! empty($field['id'])) {
                $defaultById[(string) $field['id']] = $field;
            }
        }

        $normalized = [];
        foreach ($incoming as $field) {
            if (! is_array($field) || empty($field['id'])) {
                continue;
            }
            $id = (string) $field['id'];
            if (! preg_match(self::FIELD_ID_PATTERN, $id)) {
                continue;
            }
            $def = $defaultById[$id] ?? [];
            $type = (string) ($field['type'] ?? $def['type'] ?? 'text');
            if (! in_array($type, self::FIELD_TYPES, true)) {
                $type = (string) ($def['type'] ?? 'text');
            }
            $normalized[] = [
                'id' => $id,
                'type' => $type,
                'label' => trim((string) ($field['label'] ?? $def['label'] ?? $id)) ?: $id,
                'placeholder' => trim((string) ($field['placeholder'] ?? $def['placeholder'] ?? '')),
                'required' => (bool) ($field['required'] ?? $def['required'] ?? false),
                'visible' => array_key_exists('visible', $field) ? (bool) $field['visible'] : (bool) ($def['visible'] ?? true),
                'min' => isset($field['min']) ? (int) $field['min'] : ($def['min'] ?? null),
                'max' => isset($field['max']) ? (int) $field['max'] : ($def['max'] ?? null),
            ];
        }

        if ($normalized !== []) {
            return $normalized;
        }

        return array_values(array_filter($defaults, static fn ($f) => is_array($f) && ! empty($f['id'])));
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function visibleFields(?array $config = null): array
    {
        $config = self::normalize($config);
        if (! ($config['enabled'] ?? true)) {
            return [];
        }

        return array_values(array_filter(
            $config['fields'] ?? [],
            static fn (array $f): bool => ($f['visible'] ?? true) === true,
        ));
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, string>
     */
    public static function validateResponses(array $payload, ?array $config = null): array
    {
        $errors = [];
        foreach (self::visibleFields($config) as $field) {
            $id = (string) $field['id'];
            $value = $payload[$id] ?? null;
            $isEmpty = $value === null || (is_string($value) && trim($value) === '');

            if (($field['required'] ?? false) && $isEmpty) {
                $errors[$id] = 'This field is required.';

                continue;
            }

            if ($isEmpty) {
                continue;
            }

            $type = (string) ($field['type'] ?? 'text');
            if ($type === 'email' && ! filter_var((string) $value, FILTER_VALIDATE_EMAIL)) {
                $errors[$id] = 'Enter a valid email address.';
            }
            if ($type === 'tel' && ! preg_match('/^\d{7,15}$/', preg_replace('/\D/', '', (string) $value))) {
                $errors[$id] = 'Enter a valid phone number (digits only).';
            }
            if ($type === 'number') {
                if (! preg_match('/^\d+$/', (string) $value)) {
                    $errors[$id] = 'Enter a valid number (digits only).';
                } else {
                    $num = (int) $value;
                    if (isset($field['min']) && $num < (int) $field['min']) {
                        $errors[$id] = 'Value is too low.';
                    }
                    if (isset($field['max']) && $num > (int) $field['max']) {
                        $errors[$id] = 'Value is too high.';
                    }
                }
            }
        }

        return $errors;
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    public static function sanitizeResponses(array $payload, ?array $config = null): array
    {
        $out = [];
        foreach (self::visibleFields($config) as $field) {
            $id = (string) $field['id'];
            if (! array_key_exists($id, $payload)) {
                continue;
            }
            $value = $payload[$id];
            if ($value === null) {
                continue;
            }
            if (is_string($value)) {
                $value = trim($value);
                if ($value === '') {
                    continue;
                }
            }
            $type = (string) ($field['type'] ?? 'text');
            if ($type === 'tel' || $type === 'number') {
                $value = preg_replace('/\D/', '', (string) $value);
                if ($value === '') {
                    continue;
                }
            }
            $out[$id] = $value;
        }

        return $out;
    }
}
