<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\MeetingRsvpSubmission;
use App\Models\UpcomingMeeting;
use App\Support\FeaturedMeetingRsvpConfig;
use App\Support\UpcomingMeetingsConfig;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MeetingRsvpController extends Controller
{
    public function store(Request $request)
    {
        $config = FeaturedMeetingRsvpConfig::normalize(
            UpcomingMeetingsConfig::pageSettings()['rsvp'] ?? null,
        );

        if (! ($config['enabled'] ?? true)) {
            return response()->json(['message' => 'RSVP is not available right now.'], 422);
        }

        $featured = UpcomingMeeting::query()
            ->where('is_active', true)
            ->where('featured', true)
            ->first();

        if (! $featured) {
            $meetings = UpcomingMeetingsConfig::meetings(publicOnly: true);
            $featuredRow = collect($meetings)->first(static fn (array $m): bool => (bool) ($m['featured'] ?? false));
            if (! $featuredRow) {
                return response()->json(['message' => 'No featured meeting is available for RSVP.'], 422);
            }
            $meetingValue = (string) $featuredRow['value'];
            $meetingTitle = (string) $featuredRow['title'];
        } else {
            $meetingValue = (string) $featured->value;
            $meetingTitle = (string) $featured->title;
        }

        $payload = $request->input('responses', []);
        if (! is_array($payload)) {
            $payload = [];
        }

        $errors = FeaturedMeetingRsvpConfig::validateResponses($payload, $config);
        if ($errors !== []) {
            throw ValidationException::withMessages(
                collect($errors)->mapWithKeys(static fn (string $msg, string $key): array => ["responses.{$key}" => $msg])->all(),
            );
        }

        $responses = FeaturedMeetingRsvpConfig::sanitizeResponses($payload, $config);

        $row = MeetingRsvpSubmission::query()->create([
            'meeting_value' => $meetingValue,
            'meeting_title' => $meetingTitle,
            'responses' => $responses,
        ]);

        return response()->json([
            'message' => 'RSVP submitted successfully.',
            'data' => [
                'id' => $row->id,
                'successTitle' => (string) ($config['successTitle'] ?? ''),
                'successMessage' => (string) ($config['successMessage'] ?? ''),
            ],
        ], 201);
    }
}
