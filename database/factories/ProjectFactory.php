<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = 'Konsep Langit ' . fake()->numberBetween(10, 99);

        return [
            'user_id' => User::factory(),
            'name' => $name,
            'drone_count' => 500,
            'scenes_count' => 3,
            'duration' => 12,
            'data' => [
                'format' => 'skyfy-studio-project',
                'version' => 1,
                'name' => $name,
                'droneCount' => 500,
                'gradient' => true,
                'startColor' => '#b9f43c',
                'endColor' => '#52c7ff',
                'groundVisible' => true,
                'markerStyle' => 'point',
                'markerScale' => 1,
                'workspaceWidth' => 40,
                'scenes' => [
                    [
                        'name' => 'Orbit',
                        'formation' => 'orbit',
                        'duration' => 4,
                        'palette' => [
                            'startColor' => '#b9f43c',
                            'endColor' => '#52c7ff',
                            'gradient' => true,
                        ],
                    ],
                    [
                        'name' => 'Transisi',
                        'formation' => 'wave',
                        'duration' => 3,
                        'palette' => [
                            'startColor' => '#52c7ff',
                            'endColor' => '#ff77b7',
                            'gradient' => true,
                        ],
                    ],
                    [
                        'name' => 'Sky mark',
                        'formation' => 'mark',
                        'duration' => 5,
                        'palette' => [
                            'startColor' => '#ffd15e',
                            'endColor' => '#52c7ff',
                            'gradient' => true,
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * Mark the project as publicly viewable.
     */
    public function public(): static
    {
        return $this->state(fn () => [
            'is_public' => true,
        ]);
    }
}
