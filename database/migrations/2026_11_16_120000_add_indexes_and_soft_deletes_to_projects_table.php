<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('share_token', 64)->nullable()->after('is_public');
            $table->softDeletes()->after('updated_at');

            $table->unique('share_token', 'projects_share_token_unique');
            $table->index(['user_id', 'created_at'], 'projects_user_created_idx');
            $table->index(['is_public', 'created_at'], 'projects_public_created_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex('projects_user_created_idx');
            $table->dropIndex('projects_public_created_idx');
            $table->dropUnique('projects_share_token_unique');
            $table->dropSoftDeletes();
            $table->dropColumn('share_token');
        });
    }
};
