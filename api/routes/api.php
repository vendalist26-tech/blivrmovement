<?php

use App\Http\Controllers\Api\V1\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use App\Http\Controllers\Api\V1\Admin\GetConnectedController as AdminGetConnectedController;
use App\Http\Controllers\Api\V1\Admin\GetConnectedInfoController;
use App\Http\Controllers\Api\V1\Admin\GetConnectedSettingsController;
use App\Http\Controllers\Api\V1\Admin\SiteContentController as AdminSiteContentController;
use App\Http\Controllers\Api\V1\Admin\UpcomingMeetingsController as AdminUpcomingMeetingsController;
use App\Http\Controllers\Api\V1\Public\GetConnectedController as PublicGetConnectedController;
use App\Http\Controllers\Api\V1\Public\MeetingRsvpController as PublicMeetingRsvpController;
use App\Http\Controllers\Api\V1\Public\SiteContentController;
use App\Http\Controllers\Api\V1\Public\UpcomingMeetingsController;
use App\Http\Controllers\Api\V1\Admin\MeetingRsvpController as AdminMeetingRsvpController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/site', [SiteContentController::class, 'show']);
    Route::get('/upcoming-meetings', [UpcomingMeetingsController::class, 'index']);
    Route::post('/meeting-rsvp', [PublicMeetingRsvpController::class, 'store']);
    Route::post('/get-connected', [PublicGetConnectedController::class, 'store']);

    Route::post('/auth/login', [AdminAuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('/site', [AdminSiteContentController::class, 'show']);
        Route::put('/site', [AdminSiteContentController::class, 'update']);
        Route::post('/site/upload-image', [AdminSiteContentController::class, 'uploadImage']);
        Route::get('/get-connected', [AdminGetConnectedController::class, 'index']);
        Route::get('/get-connected-settings', [GetConnectedSettingsController::class, 'show']);
        Route::put('/get-connected-settings', [GetConnectedSettingsController::class, 'update']);
        Route::get('/get-connected-info', [GetConnectedInfoController::class, 'index']);
        Route::put('/get-connected-info', [GetConnectedInfoController::class, 'update']);
        Route::get('/upcoming-meetings', [AdminUpcomingMeetingsController::class, 'show']);
        Route::put('/upcoming-meetings', [AdminUpcomingMeetingsController::class, 'update']);
        Route::post('/upcoming-meetings/upload-image', [AdminUpcomingMeetingsController::class, 'uploadImage']);
        Route::get('/meeting-rsvps', [AdminMeetingRsvpController::class, 'index']);
        Route::delete('/meeting-rsvps/{meetingRsvpSubmission}', [AdminMeetingRsvpController::class, 'destroy']);
        Route::delete('/get-connected/{submission}', [AdminGetConnectedController::class, 'destroy']);
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::post('/users', [AdminUserController::class, 'store']);
        Route::put('/users/{user}', [AdminUserController::class, 'update']);
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);
        Route::post('/auth/logout', [AdminAuthController::class, 'logout']);
    });
});
