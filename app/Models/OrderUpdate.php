<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderUpdate extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'status',
        'message',
        'visible_to_customer',
    ];

    protected function casts(): array
    {
        return [
            'visible_to_customer' => 'boolean',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
