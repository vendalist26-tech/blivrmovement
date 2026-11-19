<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index()
    {
        $admins = User::query()
            ->where('is_admin', true)
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'is_admin', 'created_at', 'updated_at']);

        return response()->json([
            'data' => $admins,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $admin = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'is_admin' => true,
        ]);

        return response()->json([
            'message' => 'Admin created.',
            'data' => $admin->only(['id', 'name', 'email', 'is_admin', 'created_at', 'updated_at']),
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        if (! $user->is_admin) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $payload = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (! empty($validated['password'])) {
            $payload['password'] = $validated['password'];
        }

        $user->update($payload);

        return response()->json([
            'message' => 'Admin updated.',
            'data' => $user->fresh()->only(['id', 'name', 'email', 'is_admin', 'created_at', 'updated_at']),
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        if (! $user->is_admin) {
            abort(404);
        }

        $authUser = $request->user();
        if ((int) $authUser->id === (int) $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own admin account.',
            ], 422);
        }

        $adminCount = User::query()->where('is_admin', true)->count();
        if ($adminCount <= 1) {
            return response()->json([
                'message' => 'At least one admin account must remain.',
            ], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'Admin deleted.',
        ]);
    }
}
