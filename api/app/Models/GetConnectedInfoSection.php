<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GetConnectedInfoSection extends Model
{
    protected $fillable = [
        'title',
        'group_title',
        'description',
        'details',
        'badge',
        'sort_order',
    ];
}

