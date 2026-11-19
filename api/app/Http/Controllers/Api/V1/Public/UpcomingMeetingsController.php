<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Support\UpcomingMeetingsConfig;

class UpcomingMeetingsController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => UpcomingMeetingsConfig::publicPayload(),
        ]);
    }
}
