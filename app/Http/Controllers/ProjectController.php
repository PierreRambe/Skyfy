<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaveProjectRequest;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\View\View;

class ProjectController extends Controller
{
    /**
     * Tampilkan daftar proyek milik pengguna (Dashboard).
     */
    public function index(Request $request): View
    {
        $projects = $request->user()->projects()->latest()->paginate(12);

        return view('dashboard', [
            'projects' => $projects,
        ]);
    }

    /**
     * Tampilkan editor Studio untuk desain baru atau proyek yang ada.
     */
    public function editor(?Project $project = null): View
    {
        if ($project && $project->exists) {
            if (! Gate::allows('view', $project)) {
                abort(403, 'Anda tidak memiliki akses ke proyek ini.');
            }
        }

        return view('studio.editor', [
            'project' => $project,
        ]);
    }

    /**
     * Simpan proyek baru ke database.
     */
    public function store(SaveProjectRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $project = $request->user()->projects()->create([
            'name' => $validated['name'],
            'drone_count' => $validated['drone_count'] ?? 500,
            'scenes_count' => $validated['scenes_count'] ?? count($validated['data']['scenes'] ?? [1]),
            'duration' => $validated['duration'] ?? 24,
            'data' => $validated['data'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Proyek berhasil disimpan ke akun Anda.',
            'project' => $project,
            'redirect' => route('studio.project', $project->id),
        ], 201);
    }

    /**
     * Update proyek yang sudah ada.
     */
    public function update(SaveProjectRequest $request, Project $project): JsonResponse
    {
        $validated = $request->validated();

        $project->update([
            'name' => $validated['name'] ?? $project->name,
            'drone_count' => $validated['drone_count'] ?? $project->drone_count,
            'scenes_count' => $validated['scenes_count'] ?? (isset($validated['data']['scenes']) ? count($validated['data']['scenes']) : $project->scenes_count),
            'duration' => $validated['duration'] ?? $project->duration,
            'data' => $validated['data'] ?? $project->data,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Perubahan proyek berhasil disimpan.',
            'project' => $project,
        ]);
    }

    /**
     * Gandakan / duplikat proyek.
     */
    public function duplicate(Request $request, Project $project): RedirectResponse
    {
        Gate::authorize('duplicate', $project);

        $copy = $project->replicate(['user_id', 'is_public', 'share_token']);
        $copy->user_id = $request->user()->id;
        $copy->is_public = false;
        $copy->share_token = null;
        $copy->name = Str::limit($project->name, 88, '') . ' (Salinan)';
        $copy->save();

        return redirect()->route('dashboard')->with('status', 'Proyek berhasil digandakan.');
    }

    /**
     * Hapus proyek dari database.
     */
    public function destroy(Project $project): RedirectResponse
    {
        Gate::authorize('delete', $project);

        $project->delete();

        return redirect()->route('dashboard')->with('status', 'Proyek berhasil dihapus.');
    }
}
