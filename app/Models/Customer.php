<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Customer extends Model
{
    protected $fillable = [
        'customer_code',
        'user_id',
        'name',
        'email',
        'phone',
        'whatsapp',
        'company',
        'job_title',
        'website',
        'address_line',
        'city',
        'country',
        'status',
        'source',
        'priority',
        'assigned_to',
        'lifetime_value',
        'tags',
        'notes',
        'last_contacted_at',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'lifetime_value' => 'decimal:2',
            'last_contacted_at' => 'datetime',
            'priority' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function quoteRequests(): HasMany
    {
        return $this->hasMany(QuoteRequest::class);
    }

    public function contactMessages(): HasMany
    {
        return $this->hasMany(ContactMessage::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(CrmActivity::class);
    }

    public function crmNotes(): MorphMany
    {
        return $this->morphMany(CrmNote::class, 'notable');
    }

    public static function nextCode(): string
    {
        $last = static::query()->orderByDesc('id')->value('customer_code');
        $num = $last ? ((int) preg_replace('/\D/', '', $last)) + 1 : 1001;

        return 'CUS-'.$num;
    }
}
