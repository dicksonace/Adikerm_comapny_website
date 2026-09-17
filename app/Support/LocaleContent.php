<?php

namespace App\Support;

class LocaleContent
{
    /**
     * Resolve a localized value from an array/object.
     * Prefer `{key}_de` when locale is de, else `{key}`.
     */
    public static function get(array|object|null $content, string $key, mixed $default = null): mixed
    {
        if ($content === null) {
            return $default;
        }

        $data = is_array($content) ? $content : (array) $content;
        $locale = app()->getLocale();

        if ($locale !== 'en') {
            $localizedKey = "{$key}_{$locale}";
            if (array_key_exists($localizedKey, $data) && $data[$localizedKey] !== null && $data[$localizedKey] !== '') {
                return $data[$localizedKey];
            }
        }

        return $data[$key] ?? $default;
    }

    /**
     * Map content array to locale-aware values for known keys.
     */
    public static function map(array $content, array $keys): array
    {
        $out = $content;
        foreach ($keys as $key) {
            $out[$key] = self::get($content, $key, $content[$key] ?? null);
        }

        return $out;
    }
}
