import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function useT() {
    const { translations, locale } = usePage<SharedData>().props;

    const t = (key: string, fallback?: string): string => {
        return translations?.[key] ?? fallback ?? key;
    };

    return { t, locale };
}

/**
 * Pick localized CMS field: prefer `field_de` when locale is de.
 */
export function localized<T extends Record<string, unknown>>(
    content: T | null | undefined,
    key: string,
    locale: string,
): string {
    if (!content) {
        return '';
    }
    if (locale !== 'en') {
        const localizedKey = `${key}_${locale}`;
        const value = content[localizedKey];
        if (typeof value === 'string' && value.trim() !== '') {
            return value;
        }
    }
    const base = content[key];
    return typeof base === 'string' ? base : '';
}

export function localizedModel<T extends Record<string, unknown>>(
    model: T,
    key: string,
    locale: string,
): string {
    return localized(model, key, locale);
}
