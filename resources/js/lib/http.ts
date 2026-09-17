export function csrfToken(): string {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export async function jsonFetch<T = unknown>(
    url: string,
    options: RequestInit & { json?: unknown } = {},
): Promise<{ ok: boolean; status: number; body: T }> {
    const { json, headers, ...rest } = options;
    const response = await fetch(url, {
        credentials: 'same-origin',
        ...rest,
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': csrfToken(),
            ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
            ...headers,
        },
        body: json !== undefined ? JSON.stringify(json) : rest.body,
    });

    const body = (await response.json().catch(() => ({}))) as T;
    return { ok: response.ok, status: response.status, body };
}
