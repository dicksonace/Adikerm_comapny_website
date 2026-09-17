<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Employee extends Model
{
    public const ROLES = [
        'super_admin' => 'Super Admin',
        'manager' => 'Manager',
        'content_manager' => 'Content Manager',
        'sales' => 'Sales',
        'support' => 'Support',
        'staff' => 'Staff',
    ];

    public const DEFAULT_PERMISSIONS = [
        'super_admin' => ['*'],
        'manager' => ['orders', 'customers', 'leads', 'messages', 'reports', 'employees.view'],
        'content_manager' => ['services', 'projects', 'team', 'testimonials', 'faqs', 'sections', 'blog', 'media'],
        'sales' => ['orders', 'customers', 'leads', 'messages'],
        'support' => ['orders.view', 'customers.view', 'messages', 'leads.view'],
        'staff' => ['orders.view', 'customers.view'],
    ];

    protected $fillable = [
        'employee_code',
        'user_id',
        'name',
        'email',
        'phone',
        'photo',
        'department',
        'job_title',
        'employment_type',
        'role',
        'permissions',
        'hired_at',
        'status',
        'manager_id',
        'emergency_contact',
        'bio',
        'salary',
        'social_links',
        'show_on_website',
    ];

    protected function casts(): array
    {
        return [
            'permissions' => 'array',
            'social_links' => 'array',
            'hired_at' => 'date',
            'salary' => 'decimal:2',
            'show_on_website' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(self::class, 'manager_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(self::class, 'manager_id');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(CrmActivity::class);
    }

    public function crmNotes(): MorphMany
    {
        return $this->morphMany(CrmNote::class, 'notable');
    }

    public function hasPermission(string $permission): bool
    {
        $perms = $this->permissions ?? self::DEFAULT_PERMISSIONS[$this->role] ?? [];

        return in_array('*', $perms, true) || in_array($permission, $perms, true);
    }

    public static function nextCode(): string
    {
        $last = static::query()->orderByDesc('id')->value('employee_code');
        $num = $last ? ((int) preg_replace('/\D/', '', $last)) + 1 : 1001;

        return 'EMP-'.$num;
    }
}
