<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SiteSettings
{
    public static function get(string $key, mixed $default = null): mixed
    {
        $settings = self::all();

        return $settings[$key] ?? $default;
    }

    public static function set(string $key, mixed $value, string $group = 'general', string $type = 'string'): void
    {
        if (is_array($value) || is_object($value)) {
            $value = json_encode($value);
            $type = 'json';
        } elseif (is_bool($value)) {
            $value = $value ? '1' : '0';
            $type = 'boolean';
        }

        Setting::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'group' => $group, 'type' => $type]
        );

        Cache::forget('site_settings');
    }

    public static function all(): array
    {
        return Cache::rememberForever('site_settings', function () {
            return Setting::query()
                ->get()
                ->mapWithKeys(function (Setting $setting) {
                    return [$setting->key => self::cast($setting)];
                })
                ->all();
        });
    }

    public static function group(string $group): array
    {
        return collect(self::all())
            ->filter(fn ($value, $key) => Setting::where('key', $key)->where('group', $group)->exists())
            ->all();
    }

    public static function company(): array
    {
        return [
            'name' => self::get('company_name', 'Adikern'),
            'tagline' => self::get('company_tagline', 'Professional services you can trust'),
            'logo' => self::get('company_logo'),
            'favicon' => self::get('company_favicon'),
            'email' => self::get('company_email', 'hello@example.com'),
            'phone' => self::get('company_phone', '+94 77 348 3260'),
            'whatsapp' => self::get('company_whatsapp', '+94773483260'),
            'address' => self::get('company_address', "No. 1051,\nKajuduwawaththa,\nNagoda,\nKalutara 12000,\nSri Lanka."),
            'address_line' => self::get('company_address_line', 'No. 1051, Kajuduwawaththa, Nagoda, Kalutara 12000, Sri Lanka'),
            'business_hours' => self::get('business_hours', 'Mon–Fri 9:00–18:00'),
            'map_embed' => self::get('map_embed'),
            'social' => [
                'facebook' => self::get('social_facebook'),
                'instagram' => self::get('social_instagram'),
                'linkedin' => self::get('social_linkedin'),
                'x' => self::get('social_x'),
                'tiktok' => self::get('social_tiktok'),
                'youtube' => self::get('social_youtube'),
                'whatsapp' => self::get('company_whatsapp', '+94773483260'),
            ],
        ];
    }

    public static function theme(): array
    {
        return [
            'primary' => self::get('theme_primary', '#0B1F3A'),
            'secondary' => self::get('theme_secondary', '#1E293B'),
            'accent' => self::get('theme_accent', '#0F766E'),
            'background' => self::get('theme_background', '#F8FAFC'),
            'text' => self::get('theme_text', '#0F172A'),
            'radius' => self::get('theme_radius', '0.75rem'),
            'heading_font' => self::get('theme_heading_font', 'Syne'),
            'body_font' => self::get('theme_body_font', 'Figtree'),
        ];
    }

    public static function currency(): array
    {
        $code = strtoupper((string) self::get('currency_code', 'USD'));

        $defaults = [
            'USD' => ['symbol' => '$', 'name' => 'US Dollar'],
            'LKR' => ['symbol' => 'Rs', 'name' => 'Sri Lankan Rupee'],
            'EUR' => ['symbol' => '€', 'name' => 'Euro'],
            'GBP' => ['symbol' => '£', 'name' => 'British Pound'],
            'GHS' => ['symbol' => 'GH₵', 'name' => 'Ghanaian Cedi'],
            'INR' => ['symbol' => '₹', 'name' => 'Indian Rupee'],
            'AED' => ['symbol' => 'AED', 'name' => 'UAE Dirham'],
        ];

        $meta = $defaults[$code] ?? ['symbol' => $code, 'name' => $code];

        return [
            'code' => $code,
            'symbol' => self::get('currency_symbol', $meta['symbol']),
            'name' => $meta['name'],
            'position' => self::get('currency_position', 'before'), // before | after
        ];
    }

    public static function formatMoney(float|int|string|null $amount, ?string $prefix = 'From'): ?string
    {
        if ($amount === null || $amount === '') {
            return null;
        }

        $currency = self::currency();
        $value = number_format((float) $amount, 0, '.', ',');
        $formatted = $currency['position'] === 'after'
            ? "{$value} {$currency['code']}"
            : "{$currency['symbol']}{$value}";

        return $prefix ? trim("{$prefix} {$formatted}") : $formatted;
    }

    protected static function cast(Setting $setting): mixed
    {
        return match ($setting->type) {
            'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $setting->value,
            'json' => json_decode($setting->value ?? 'null', true),
            default => $setting->value,
        };
    }
}
