<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'drone_count',
        'scenes_count',
        'duration',
        'data',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'data' => 'array',
        'is_public' => 'boolean',
        'drone_count' => 'integer',
        'scenes_count' => 'integer',
        'duration' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
