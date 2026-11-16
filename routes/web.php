<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

// Halaman utama langsung mengarahkan ke editor Studio
Route::get('/', function () {
    return redirect()->route('studio');
});

// Editor Studio (Bisa diakses siapa saja, dengan fitur simpan khusus pengguna login)
Route::get('/studio', [ProjectController::class, 'editor'])->name('studio');
Route::get('/studio/{project}', [ProjectController::class, 'editor'])
    ->whereNumber('project')
    ->name('studio.project');

// Dashboard & Manajemen Proyek (Wajib Login)
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [ProjectController::class, 'index'])->name('dashboard');

    // API Simpan & Update Proyek
    Route::middleware('throttle:30,1')->group(function () {
        Route::post('/api/projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::put('/api/projects/{project}', [ProjectController::class, 'update'])
            ->whereNumber('project')
            ->name('projects.update');

        // Aksi Proyek dari Dashboard
        Route::post('/projects/{project}/duplicate', [ProjectController::class, 'duplicate'])
            ->whereNumber('project')
            ->name('projects.duplicate');
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])
            ->whereNumber('project')
            ->name('projects.destroy');
    });

    // Pengaturan Akun
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Endpoint Kompatibilitas untuk Studio (AI nonaktif & Alembic)
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/api/ai-status', function () {
        return response()->json([
            'available' => false,
            'kind' => 'disabled',
            'message' => 'AI Generator dinonaktifkan.',
        ]);
    });

    Route::get('/api/alembic-status', function () {
        return response()->json([
            'available' => false,
        ]);
    });
});

require __DIR__.'/auth.php';
