<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MeetingRsvpSubmission extends Model
{
    protected $fillable = [
        'meeting_value',
        'meeting_title',
        'responses',
    ];

    protected function casts(): array
    {
        return [
            'responses' => 'array',
        ];
    }
}
