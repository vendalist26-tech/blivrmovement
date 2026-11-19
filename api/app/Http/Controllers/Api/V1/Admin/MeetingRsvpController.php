<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\MeetingRsvpSubmission;
use Illuminate\Http\Request;

class MeetingRsvpController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'meeting_value' => ['nullable', 'string', 'max:80'],
            'q' => ['nullable', 'string', 'max:120'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $perPage = $validated['per_page'] ?? 25;
        $query = MeetingRsvpSubmission::query()->orderByDesc('created_at');

        if (! empty($validated['meeting_value'])) {
            $query->where('meeting_value', $validated['meeting_value']);
        }

        if (! empty($validated['q'])) {
            $term = '%'.$validated['q'].'%';
            $query->where(function ($builder) use ($term) {
                $builder
                    ->where('meeting_title', 'like', $term)
                    ->orWhere('meeting_value', 'like', $term)
                    ->orWhere('responses', 'like', $term);
            });
        }

        $rows = $query->paginate($perPage);

        return response()->json([
            'data' => $rows->items(),
            'meta' => [
                'current_page' => $rows->currentPage(),
                'last_page' => $rows->lastPage(),
                'per_page' => $rows->perPage(),
                'total' => $rows->total(),
            ],
        ]);
    }

    public function destroy(MeetingRsvpSubmission $meetingRsvpSubmission)
    {
        $meetingRsvpSubmission->delete();

        return response()->json(['message' => 'RSVP deleted.']);
    }
}
