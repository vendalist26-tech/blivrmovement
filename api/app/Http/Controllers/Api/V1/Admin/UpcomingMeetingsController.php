<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\UpcomingMeeting;
use App\Support\FeaturedMeetingRsvpConfig;
use App\Support\UpcomingMeetingsConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpcomingMeetingsController extends Controller
{
    public function show()
    {
        return response()->json([
            'data' => [
                'page' => UpcomingMeetingsConfig::pageSettings(),
                'meetings' => UpcomingMeetingsConfig::meetings(publicOnly: false),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'page' => ['required', 'array'],
            'page.metaTitle' => ['required', 'string', 'max:160'],
            'page.heroEyebrow' => ['nullable', 'string', 'max:80'],
            'page.heroTitle' => ['required', 'string', 'max:160'],
            'page.heroDescription' => ['required', 'string', 'max:2000'],
            'page.homepageSectionVisible' => ['boolean'],
            'page.carouselTitle' => ['required', 'string', 'max:160'],
            'page.carouselSubtitle' => ['nullable', 'string', 'max:500'],
            'page.listEyebrow' => ['nullable', 'string', 'max:80'],
            'page.listTitle' => ['required', 'string', 'max:160'],
            'page.listSubtitle' => ['nullable', 'string', 'max:500'],
            'page.ctaEyebrow' => ['nullable', 'string', 'max:80'],
            'page.ctaTitle' => ['required', 'string', 'max:160'],
            'page.ctaBody' => ['required', 'string', 'max:1000'],
            'page.statsSectionVisible' => ['boolean'],
            'page.stats' => ['required', 'array', 'min:1'],
            'page.stats.*.id' => ['required', 'string', Rule::in(['calendar', 'in-person', 'online'])],
            'page.stats.*.label' => ['required', 'string', 'max:80'],
            'page.stats.*.suffix' => ['required', 'string', 'max:80'],
            'page.stats.*.countType' => ['required', Rule::in(['total', 'in-person', 'online'])],
            'page.stats.*.icon' => ['required', Rule::in(['calendar', 'users'])],
            'page.stats.*.visible' => ['boolean'],
            'page.rsvp' => ['required', 'array'],
            'page.rsvp.enabled' => ['boolean'],
            'page.rsvp.buttonLabel' => ['required', 'string', 'max:40'],
            'page.rsvp.modalEyebrow' => ['nullable', 'string', 'max:80'],
            'page.rsvp.modalTitle' => ['required', 'string', 'max:160'],
            'page.rsvp.modalSubtitle' => ['nullable', 'string', 'max:500'],
            'page.rsvp.submitLabel' => ['required', 'string', 'max:40'],
            'page.rsvp.successTitle' => ['required', 'string', 'max:160'],
            'page.rsvp.successMessage' => ['required', 'string', 'max:500'],
            'page.rsvp.fields' => ['required', 'array', 'min:1'],
            'page.rsvp.fields.*.id' => ['required', 'string', 'regex:/^[a-z][a-z0-9_]{0,63}$/'],
            'page.rsvp.fields.*.type' => ['required', Rule::in(FeaturedMeetingRsvpConfig::FIELD_TYPES)],
            'page.rsvp.fields.*.label' => ['required', 'string', 'max:120'],
            'page.rsvp.fields.*.placeholder' => ['nullable', 'string', 'max:200'],
            'page.rsvp.fields.*.required' => ['boolean'],
            'page.rsvp.fields.*.visible' => ['boolean'],
            'page.rsvp.fields.*.min' => ['nullable', 'integer'],
            'page.rsvp.fields.*.max' => ['nullable', 'integer'],
            'meetings' => ['required', 'array', 'min:1'],
            'meetings.*.value' => ['required', 'string', 'max:80', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'meetings.*.title' => ['required', 'string', 'max:160'],
            'meetings.*.tagline' => ['nullable', 'string', 'max:255'],
            'meetings.*.schedule' => ['required', 'string', 'max:255'],
            'meetings.*.cadence' => ['nullable', 'string', 'max:120'],
            'meetings.*.location' => ['required', 'string', 'max:500'],
            'meetings.*.format' => ['required', Rule::in(['in-person', 'zoom'])],
            'meetings.*.imagePath' => ['nullable', 'string', 'max:500'],
            'meetings.*.imageAlt' => ['nullable', 'string', 'max:255'],
            'meetings.*.description' => ['required', 'string', 'max:5000'],
            'meetings.*.highlights' => ['nullable', 'array'],
            'meetings.*.highlights.*' => ['string', 'max:300'],
            'meetings.*.featured' => ['boolean'],
            'meetings.*.isActive' => ['boolean'],
            'meetings.*.sortOrder' => ['nullable', 'integer', 'min:0', 'max:65535'],
        ]);

        $values = array_column($validated['meetings'], 'value');
        if (count($values) !== count(array_unique($values))) {
            return response()->json(['message' => 'Each meeting slug (value) must be unique.'], 422);
        }

        DB::transaction(function () use ($validated): void {
            SiteSetting::query()->updateOrCreate(
                ['key' => 'upcoming_meetings_page'],
                ['value' => $validated['page']],
            );

            $existing = UpcomingMeeting::query()->get()->keyBy('value');
            $incomingValues = [];
            $featuredIndex = null;

            foreach ($validated['meetings'] as $index => $row) {
                $value = (string) $row['value'];
                $incomingValues[] = $value;
                if (! empty($row['featured'])) {
                    $featuredIndex = $index;
                }

                $imagePath = isset($row['imagePath']) ? trim((string) $row['imagePath']) : null;
                $imagePath = $imagePath === '' ? null : $imagePath;

                $payload = [
                    'title' => trim((string) $row['title']),
                    'tagline' => isset($row['tagline']) ? trim((string) $row['tagline']) : null,
                    'schedule' => trim((string) $row['schedule']),
                    'cadence' => isset($row['cadence']) ? trim((string) $row['cadence']) : null,
                    'location' => trim((string) $row['location']),
                    'format' => (string) $row['format'],
                    'image_path' => $imagePath,
                    'image_alt' => isset($row['imageAlt']) ? trim((string) $row['imageAlt']) : null,
                    'description' => trim((string) $row['description']),
                    'highlights' => array_values(array_filter(
                        array_map(static fn ($h) => trim((string) $h), $row['highlights'] ?? []),
                        static fn (string $h) => $h !== '',
                    )),
                    'featured' => (bool) ($row['featured'] ?? false),
                    'is_active' => (bool) ($row['isActive'] ?? true),
                    'sort_order' => isset($row['sortOrder']) ? (int) $row['sortOrder'] : $index,
                ];

                if ($existing->has($value)) {
                    $model = $existing->get($value);
                    $oldPath = $model->image_path;
                    if ($oldPath && $oldPath !== $imagePath && ! str_starts_with($oldPath, 'http')) {
                        Storage::disk('public')->delete($oldPath);
                    }
                    $model->update($payload);
                } else {
                    UpcomingMeeting::query()->create(array_merge($payload, ['value' => $value]));
                }
            }

            // Ensure only one featured meeting.
            if ($featuredIndex !== null) {
                $featuredValue = $validated['meetings'][$featuredIndex]['value'];
                UpcomingMeeting::query()
                    ->where('value', '!=', $featuredValue)
                    ->update(['featured' => false]);
            }

            // Remove deleted meetings + their images.
            $toDelete = $existing->filter(static fn ($m) => ! in_array($m->value, $incomingValues, true));
            foreach ($toDelete as $model) {
                if ($model->image_path && ! str_starts_with($model->image_path, 'http')) {
                    Storage::disk('public')->delete($model->image_path);
                }
                $model->delete();
            }
        });

        return response()->json([
            'message' => 'Upcoming meetings saved.',
            'data' => [
                'page' => UpcomingMeetingsConfig::pageSettings(),
                'meetings' => UpcomingMeetingsConfig::meetings(publicOnly: false),
            ],
        ]);
    }

    public function uploadImage(Request $request)
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'max:8192'],
        ]);

        $file = $validated['image'];
        $name = Str::uuid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs('upcoming-meetings', $name, 'public');

        return response()->json([
            'data' => [
                'path' => $path,
                'url' => UpcomingMeetingsConfig::imageUrl($path),
            ],
        ]);
    }
}
