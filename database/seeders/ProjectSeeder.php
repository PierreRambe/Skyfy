<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Seed sample drone show projects for local development and QA only.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo@skyfy.local'],
            [
                'name' => 'Demo Skyfy',
                'password' => 'SkyfyDemo#2026!',
                'email_verified_at' => now(),
            ]
        );

        if ($user->projects()->exists()) {
            return;
        }

        Project::factory()->count(2)->for($user)->create();
        Project::factory()->public()->for($user)->create([
            'name' => 'Contoh Publik Skyfy',
        ]);
    }
}
