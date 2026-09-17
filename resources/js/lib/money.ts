import type { CurrencySettings, ServiceItem } from '@/types';

export function formatMoney(
    amount: number | string | null | undefined,
    currency: CurrencySettings,
    options?: { prefix?: string | null; decimals?: number },
): string | null {
    if (amount === null || amount === undefined || amount === '') {
        return null;
    }

    const value = Number(amount);
    if (Number.isNaN(value)) {
        return null;
    }

    const decimals = options?.decimals ?? (Number.isInteger(value) ? 0 : 2);
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);

    const money =
        currency.position === 'after'
            ? `${formatted} ${currency.code}`
            : `${currency.symbol}${formatted}`;

    const prefix = options?.prefix;
    if (prefix === null || prefix === '') {
        return money;
    }

    return `${prefix ?? 'From'} ${money}`;
}

/**
 * Display price for a service using global currency.
 * - If numeric `price` exists → "From $500" / "Ab $500"
 * - Else use localized price_label
 */
export function formatServicePrice(
    service: Pick<ServiceItem, 'price' | 'price_label' | 'price_label_de'>,
    currency: CurrencySettings,
    options?: { locale?: string; fromLabel?: string },
): string | null {
    if (service.price !== null && service.price !== undefined && service.price !== '') {
        return formatMoney(service.price, currency, { prefix: options?.fromLabel ?? 'From' });
    }

    if (options?.locale === 'de' && service.price_label_de) {
        return service.price_label_de;
    }

    return service.price_label || null;
}
