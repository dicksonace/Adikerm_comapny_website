<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $fillable = [
        'name',
        'name_de',
        'slug',
        'icon',
        'image',
        'short_description',
        'short_description_de',
        'description',
        'description_de',
        'price',
        'price_label',
        'price_label_de',
        'features',
        'cta_text',
        'cta_url',
        'gallery',
        'is_active',
        'is_featured',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'gallery' => 'array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'price' => 'decimal:2',
        ];
    }

    public function quoteRequests(): HasMany
    {
        return $this->hasMany(QuoteRequest::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
