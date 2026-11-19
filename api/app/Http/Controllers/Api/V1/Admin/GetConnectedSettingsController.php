<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GetConnectedSettingsController extends Controller
{
    public function show()
    {
        $row = SiteSetting::query()->where('key', 'get_connected')->first();
        $data = $row?->value ?? require database_path('seeders/get_connected_default.php');

        return response()->json([
            'data' => $data,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'categories' => ['required', 'array', 'min:1'],
            'categories.*.value' => [
                'required',
                'string',
                'max:80',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
            ],
            'categories.*.label' => ['required', 'string', 'max:120'],
        ]);

        $values = array_column($validated['categories'], 'value');
        if (count($values) !== count(array_unique($values))) {
            return response()->json([
                'message' => 'Each category must have a unique value (slug).',
            ], 422);
        }

        SiteSetting::query()->updateOrCreate(
            ['key' => 'get_connected'],
            ['value' => $validated],
        );

        return response()->json([
            'message' => 'Get Connected settings saved.',
            'data' => $validated,
        ]);
    }
}
