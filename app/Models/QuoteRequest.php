<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteRequest extends Model
{
    protected $fillable = [
        'customer_id',
        'reference',
        'name',
        'email',
        'phone',
        'company',
        'service_id',
        'service_name',
        'budget',
        'description',
        'attachment',
        'preferred_deadline',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'preferred_deadline' => 'date',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
