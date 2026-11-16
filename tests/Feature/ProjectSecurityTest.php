<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectSecurityTest extends TestCase
{
    use RefreshDatabase;

    private function validPayload(array $overrides = []): array
    {
        return array_replace_recursive([
            'name' => 'Konsep Langit Aman',
            'drone_count' => 500,
            'scenes_count' => 1,
            'duration' => 12,
            'data' => [
                'format' => 'skyfy-studio-project',
                'version' => 1,
                'name' => 'Konsep Langit Aman',
                'droneCount' => 500,
                'gradient' => true,
                'startColor' => '#b9f43c',
                'endColor' => '#52c7ff',
                'scenes' => [
                    [
                        'name' => 'Orbit',
                        'formation' => 'orbit',
                        'duration' => 12,
                    ],
                ],
            ],
        ], $overrides);
    }

    public function test_studio_route_and_security_headers_are_served(): void
    {
        $response = $this->get('/studio');

        $response->assertOk();
        $response->assertSee('assets/studio/studio.js');
        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $response->assertHeader('Content-Security-Policy');
    }

    public function test_guest_cannot_mutate_or_access_private_projects(): void
    {
        $owner = User::factory()->create();
        $project = $owner->projects()->create([
            'name' => 'Rahasia',
            'drone_count' => 100,
            'scenes_count' => 1,
            'duration' => 12,
            'data' => $this->validPayload()['data'],
        ]);

        $this->get('/studio/' . $project->id)->assertForbidden();
        $this->postJson('/api/projects', $this->validPayload())->assertUnauthorized();
        $this->putJson('/api/projects/' . $project->id, ['name' => 'Hack'])->assertUnauthorized();
        $this->post('/projects/' . $project->id . '/duplicate')->assertRedirect(route('login'));
        $this->delete('/projects/' . $project->id)->assertRedirect(route('login'));
    }

    public function test_user_cannot_access_or_modify_other_users_project(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();

        $project = $owner->projects()->create([
            'name' => 'Milik Owner',
            'drone_count' => 250,
            'scenes_count' => 1,
            'duration' => 12,
            'data' => $this->validPayload()['data'],
        ]);

        $this->actingAs($attacker);

        $this->get('/studio/' . $project->id)->assertForbidden();
        $this->putJson('/api/projects/' . $project->id, $this->validPayload(['name' => 'Diubah']))->assertForbidden();
        $this->post('/projects/' . $project->id . '/duplicate')->assertForbidden();
        $this->delete('/projects/' . $project->id)->assertForbidden();
    }

    public function test_public_project_viewed_by_another_user_does_not_expose_project_id_for_overwrite(): void
    {
        $owner = User::factory()->create();
        $viewer = User::factory()->create();

        $project = $owner->projects()->create([
            'name' => 'Publik',
            'drone_count' => 250,
            'scenes_count' => 1,
            'duration' => 12,
            'data' => $this->validPayload()['data'],
        ]);
        $project->is_public = true;
        $project->save();

        $response = $this->actingAs($viewer)->get('/studio/' . $project->id);
        $response->assertOk();
        $response->assertSee('window.__PROJECT_ID__ = null;', false);
    }

    public function test_mass_assignment_and_invalid_reference_mime_are_blocked(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $payload = $this->validPayload([
            'user_id' => $otherUser->id,
            'is_public' => true,
            'share_token' => 'forged-token-123456',
        ]);

        $response = $this->actingAs($user)->postJson('/api/projects', $payload);
        $response->assertCreated();

        $created = Project::firstOrFail();
        $this->assertSame($user->id, $created->user_id);
        $this->assertFalse($created->is_public);
        $this->assertNull($created->share_token);

        $xssPayload = $this->validPayload();
        $xssPayload['data']['scenes'][0]['references'] = [
            [
                'name' => 'xss.svg',
                'data' => 'data:image/svg+xml;base64,PHN2Zy8+',
            ],
        ];

        $this->actingAs($user)
            ->postJson('/api/projects', $xssPayload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['data']);
    }

    public function test_owner_can_update_and_duplicate_project(): void
    {
        $user = User::factory()->create();

        $createRes = $this->actingAs($user)->postJson('/api/projects', $this->validPayload());
        $createRes->assertCreated();

        $projectId = $createRes->json('project.id');

        $this->actingAs($user)
            ->putJson('/api/projects/' . $projectId, $this->validPayload(['name' => 'Konsep Baru']))
            ->assertOk()
            ->assertJsonPath('project.name', 'Konsep Baru');

        $this->actingAs($user)
            ->post('/projects/' . $projectId . '/duplicate')
            ->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('projects', [
            'user_id' => $user->id,
            'name' => 'Konsep Baru (Salinan)',
            'is_public' => false,
            'share_token' => null,
        ]);

        $this->actingAs($user)
            ->delete('/projects/' . $projectId)
            ->assertRedirect(route('dashboard'));

        $this->assertSoftDeleted('projects', ['id' => $projectId]);
        $this->actingAs($user)->get('/studio/' . $projectId)->assertNotFound();
    }
}
