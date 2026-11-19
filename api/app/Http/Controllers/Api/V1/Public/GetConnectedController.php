<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\GetConnectedSubmission;
use App\Support\GetConnectedConfig;
use App\Support\UpcomingMeetingsConfig;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GetConnectedController extends Controller
{
    public function store(Request $request)
    {
        $allowedCategories = GetConnectedConfig::categoryValues();
        if ($allowedCategories === []) {
            $allowedCategories = ['regular-member'];
        }

        $allowedMeetings = array_column(UpcomingMeetingsConfig::formOptions(), 'value');
        if ($allowedMeetings === []) {
            $allowedMeetings = ['may-10-sunday-popup'];
        }

        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'age' => ['required', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date'],
            'location' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255'],
            'category' => ['required', 'string', 'max:80', Rule::in($allowedCategories)],
            'instagram_handle' => ['nullable', 'string', 'max:255'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'is_student' => ['nullable', 'in:yes,no'],
            'school_name' => ['nullable', 'string', 'max:255'],
            'program' => ['nullable', 'string', 'max:255'],
            'year_of_study' => ['nullable', 'string', 'max:100'],
            'church_status' => ['required', 'in:no-church,not-frequent,started,committed'],
            'talents' => ['nullable', 'string'],
            'interests' => ['nullable', 'array'],
            'interests.*' => ['string', 'max:100'],
            'upcoming_meetings' => ['nullable', 'array'],
            'upcoming_meetings.*' => ['string', Rule::in($allowedMeetings)],
            'extra_notes' => ['nullable', 'string'],
            'accepted_jesus' => ['required', 'in:yes,no'],
            'prayer_requests' => ['nullable', 'string'],
        ]);

        $row = GetConnectedSubmission::query()->create($validated);

        return response()->json([
            'message' => 'Submitted successfully.',
            'data' => $row,
        ], 201);
    }
}

