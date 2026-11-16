<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    /**
     * Determine whether the user (or guest) can view the project in the editor.
     */
    public function view(?User $user, Project $project): bool
    {
        if ($project->is_public) {
            return true;
        }

        return $user !== null && (int) $project->user_id === (int) $user->id;
    }

    /**
     * Determine whether the user can update the project.
     */
    public function update(User $user, Project $project): bool
    {
        return (int) $project->user_id === (int) $user->id;
    }

    /**
     * Determine whether the user can duplicate the project.
     */
    public function duplicate(User $user, Project $project): bool
    {
        return (int) $project->user_id === (int) $user->id;
    }

    /**
     * Determine whether the user can delete the project.
     */
    public function delete(User $user, Project $project): bool
    {
        return (int) $project->user_id === (int) $user->id;
    }
}
