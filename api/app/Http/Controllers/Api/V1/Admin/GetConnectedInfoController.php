<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\GetConnectedInfoSection;
use App\Support\GetConnectedConfig;
use Illuminate\Http\Request;

class GetConnectedInfoController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => [
                'sections' => GetConnectedConfig::infoSections(),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'sections' => ['required', 'array', 'min:1'],
            'sections.*.title' => ['required', 'string', 'max:120'],
            'sections.*.groupTitle' => ['nullable', 'string', 'max:120'],
            'sections.*.description' => ['nullable', 'string', 'max:200'],
            'sections.*.details' => ['required', 'string', 'max:500'],
            'sections.*.badge' => ['nullable', 'string', 'max:40'],
            'sections.*.sortOrder' => ['nullable', 'integer', 'min:0', 'max:65535'],
        ]);

        GetConnectedInfoSection::query()->delete();

        $rows = array_map(static function (array $row, int $index): array {
            return [
                'title' => trim((string) $row['title']),
                'group_title' => isset($row['groupTitle']) ? trim((string) $row['groupTitle']) : null,
                'description' => isset($row['description']) ? trim((string) $row['description']) : null,
                'details' => trim((string) $row['details']),
                'badge' => isset($row['badge']) ? trim((string) $row['badge']) : null,
                'sort_order' => isset($row['sortOrder']) ? (int) $row['sortOrder'] : $index,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $validated['sections'], array_keys($validated['sections']));

        GetConnectedInfoSection::query()->insert($rows);

        return response()->json([
            'message' => 'Join Us info sections saved.',
            'data' => [
                'sections' => GetConnectedConfig::infoSections(),
            ],
        ]);
    }
}

