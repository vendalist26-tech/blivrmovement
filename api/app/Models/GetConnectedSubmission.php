<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GetConnectedSubmission extends Model
{
    protected $fillable = [
        'full_name',
        'age',
        'date_of_birth',
        'location',
        'phone',
        'email',
        'category',
        'instagram_handle',
        'occupation',
        'is_student',
        'school_name',
        'program',
        'year_of_study',
        'church_status',
        'talents',
        'interests',
        'upcoming_meetings',
        'extra_notes',
        'accepted_jesus',
        'prayer_requests',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'interests' => 'array',
            'upcoming_meetings' => 'array',
            'date_of_birth' => 'date',
        ];
    }
}

