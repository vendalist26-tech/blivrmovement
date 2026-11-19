<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UpcomingMeeting extends Model
{
    protected $fillable = [
        'value',
        'title',
        'tagline',
        'schedule',
        'cadence',
        'location',
        'format',
        'image_path',
        'image_alt',
        'description',
        'highlights',
        'featured',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'highlights' => 'array',
            'featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
