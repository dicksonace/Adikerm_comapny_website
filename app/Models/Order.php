<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'reference',
        'user_id',
        'customer_id',
        'service_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'service_name',
        'options',
        'requirements',
        'attachments',
        'amount',
        'currency',
        'status',
        'payment_status',
        'assigned_to',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'attachments' => 'array',
            'amount' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function updates(): HasMany
    {
        return $this->hasMany(OrderUpdate::class);
    }
}
