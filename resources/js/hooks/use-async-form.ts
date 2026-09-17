import { FormEvent, useCallback, useState } from 'react';
import { csrfToken } from '@/lib/http';

type ValidationErrors = Record<string, string>;

type SubmitResult = {
    ok: boolean;
    message?: string;
    reference?: string;
};

type AsyncFormOptions<T> = {
    url: string;
    initial: T;
};

function flattenErrors(errors: Record<string, string[] | string>): ValidationErrors {
    const out: ValidationErrors = {};
    for (const [key, value] of Object.entries(errors)) {
        out[key] = Array.isArray(value) ? value[0] : String(value);
    }
    return out;
}

/**
 * Axios-style form submit via fetch — no Inertia page visit / no full refresh.
 */
export function useAsyncForm<T extends Record<string, unknown>>({ url, initial }: AsyncFormOptions<T>) {
    const [data, setDataState] = useState<T>(initial);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const setData = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
        setDataState((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => {
            if (!(key in prev)) {
                return prev;
            }
            const next = { ...prev };
            delete next[key as string];
            return next;
        });
        setSuccess(null);
    }, []);

    const reset = useCallback(
        (...fields: (keyof T)[]) => {
            if (fields.length === 0) {
                setDataState(initial);
                return;
            }
            setDataState((prev) => {
                const next = { ...prev };
                for (const field of fields) {
                    next[field] = initial[field];
                }
                return next;
            });
        },
        [initial],
    );

    const submit = useCallback(
        async (e?: FormEvent, override?: Partial<T>): Promise<SubmitResult> => {
            e?.preventDefault();
            setProcessing(true);
            setErrors({});
            setSuccess(null);

            const payload = { ...data, ...override };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-XSRF-TOKEN': csrfToken(),
                    },
                    body: JSON.stringify(payload),
                });

                const body = (await response.json().catch(() => ({}))) as {
                    message?: string;
                    reference?: string;
                    errors?: Record<string, string[] | string>;
                    success?: boolean;
                };

                if (response.status === 422 && body.errors) {
                    setErrors(flattenErrors(body.errors));
                    return { ok: false };
                }

                if (!response.ok) {
                    setErrors({
                        form: body.message || 'Something went wrong. Please try again.',
                    });
                    return { ok: false };
                }

                const message = body.message || 'Submitted successfully.';
                setSuccess(message);
                return { ok: true, message, reference: body.reference };
            } catch {
                setErrors({ form: 'Network error. Please check your connection and try again.' });
                return { ok: false };
            } finally {
                setProcessing(false);
            }
        },
        [data, url],
    );

    return { data, setData, errors, processing, success, setSuccess, reset, submit };
}
