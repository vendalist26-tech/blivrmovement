<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Support\GetConnectedConfig;
use App\Support\HomepageConfig;
use App\Support\UpcomingMeetingsConfig;

class SiteContentController extends Controller
{
    public function show()
    {
        $data = HomepageConfig::merged();
        $data['getConnected'] = GetConnectedConfig::all();
        $data['upcomingMeetings'] = UpcomingMeetingsConfig::publicPayload();

        return response()->json([
            'data' => $data,
        ]);
    }
}
