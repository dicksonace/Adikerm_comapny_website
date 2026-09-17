<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class CrmNote extends Model
{
    protected $fillable = [
        'notable_type',
        'notable_id',
        'user_id',
        'type',
        'title',
        'body',
        'is_pinned',
        'remind_at',
    ];

    protected function casts(): array
    {
        return [
            'is_pinned' => 'boolean',
            'remind_at' => 'datetime',
        ];
    }

    public function notable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
