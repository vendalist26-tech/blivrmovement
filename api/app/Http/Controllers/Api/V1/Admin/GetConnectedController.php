<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\GetConnectedSubmission;
use Illuminate\Http\Request;

class GetConnectedController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'church_status' => ['nullable', 'in:no-church,not-frequent,started,committed'],
            'category' => ['nullable', 'string', 'max:80'],
            'accepted_jesus' => ['nullable', 'in:yes,no'],
            'submitted_on' => ['nullable', 'date'],
            'sort_by' => ['nullable', 'in:full_name,age,location,occupation,category,church_status,accepted_jesus,created_at'],
            'sort_dir' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = GetConnectedSubmission::query();

        if (!empty($validated['q'])) {
            $q = $validated['q'];
            $query->where(function ($inner) use ($q): void {
                $inner->where('full_name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%")
                    ->orWhere('location', 'like', "%{$q}%")
                    ->orWhere('occupation', 'like', "%{$q}%")
                    ->orWhere('instagram_handle', 'like', "%{$q}%");
            });
        }

        if (!empty($validated['church_status'])) {
            $query->where('church_status', $validated['church_status']);
        }

        if (!empty($validated['category'])) {
            $query->where('category', $validated['category']);
        }

        if (!empty($validated['accepted_jesus'])) {
            $query->where('accepted_jesus', $validated['accepted_jesus']);
        }

        if (!empty($validated['submitted_on'])) {
            $query->whereDate('created_at', $validated['submitted_on']);
        }

        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortDir = $validated['sort_dir'] ?? 'desc';
        $perPage = $validated['per_page'] ?? 20;

        $rows = $query
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

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

    public function destroy(GetConnectedSubmission $submission)
    {
        $submission->delete();

        return response()->json([
            'message' => 'Submission deleted.',
        ]);
    }
}

