<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\HomepageConfig;
use App\Support\UpcomingMeetingsConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SiteContentController extends Controller
{
    public function show()
    {
        return response()->json([
            'data' => HomepageConfig::merged(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'value' => ['required', 'array'],
        ]);

        SiteSetting::query()->updateOrCreate(
            ['key' => 'homepage'],
            ['value' => $validated['value']],
        );

        return response()->json([
            'message' => 'Site content updated.',
            'data' => HomepageConfig::merged(),
        ]);
    }

    public function uploadImage(Request $request)
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'max:8192'],
            'folder' => [
                'nullable',
                'string',
                Rule::in([
                    'hero-mobile',
                    'hero-desktop',
                    'who',
                    'believe',
                    'mission',
                    'gatherings',
                    'final-cta',
                ]),
            ],
        ]);

        $folder = $validated['folder'] ?? 'homepage';
        $file = $validated['image'];
        $name = Str::uuid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs('homepage/'.$folder, $name, 'public');

        return response()->json([
            'data' => [
                'path' => $path,
                'url' => UpcomingMeetingsConfig::imageUrl($path),
            ],
        ]);
    }
}
