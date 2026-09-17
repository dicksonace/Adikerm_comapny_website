import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SiteSection } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

function stringifyValue(value: unknown): string {
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
}

function parseValue(raw: string, original: unknown): unknown {
    if (typeof original === 'boolean') {
        return raw === 'true' || raw === '1';
    }
    if (Array.isArray(original) || (typeof original === 'string' && original.includes(','))) {
        // keep as comma-separated string for industries items — frontend can split
        return raw;
    }
    if (typeof original === 'number') {
        const n = Number(raw);
        return Number.isNaN(n) ? raw : n;
    }
    if (typeof original === 'object' && original !== null) {
        try {
            return JSON.parse(raw);
        } catch {
            return raw;
        }
    }
    if (raw === 'true' || raw === 'false') {
        return raw === 'true';
    }
    return raw;
}

export default function SectionsEdit({
    section,
    fieldHelp = {},
}: {
    section: SiteSection;
    fieldHelp?: Record<string, string>;
}) {
    const content = section.content || {};
    const [contentKeys, setContentKeys] = useState(Object.keys(content));
    const [newKey, setNewKey] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Sections', href: route('admin.sections.index') },
        { title: section.name, href: route('admin.sections.edit', section.id) },
    ];

    const { data, setData, put, processing, errors, transform } = useForm({
        is_enabled: section.is_enabled,
        sort_order: section.sort_order,
        content: Object.fromEntries(contentKeys.map((key) => [key, stringifyValue(content[key])])) as Record<string, string>,
    });

    const addField = () => {
        const key = newKey.trim().toLowerCase().replace(/\s+/g, '_');
        if (!key || contentKeys.includes(key)) {
            return;
        }
        setContentKeys([...contentKeys, key]);
        setData('content', { ...data.content, [key]: '' });
        setNewKey('');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        transform((form) => ({
            is_enabled: form.is_enabled,
            sort_order: Number(form.sort_order),
            content: Object.fromEntries(
                Object.keys(form.content).map((key) => [key, parseValue(form.content[key] ?? '', content[key] ?? '')]),
            ),
        }));
        put(route('admin.sections.update', section.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${section.name}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Edit {section.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            Changes appear on the public website immediately after save.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.sections.index')}>Back</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Visibility</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_enabled"
                                    checked={data.is_enabled}
                                    onCheckedChange={(checked) => setData('is_enabled', checked === true)}
                                />
                                <Label htmlFor="is_enabled">Show this section on the website</Label>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sort_order">Sort order (lower = higher on page)</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', Number(e.target.value))}
                                />
                                <InputError message={errors.sort_order} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Section content</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {contentKeys.length === 0 && (
                                <p className="text-sm text-muted-foreground">No fields yet — add one below.</p>
                            )}
                            {contentKeys.map((key) => {
                                const label = key.replace(/_/g, ' ');
                                const help = fieldHelp[key];
                                const isLong = [
                                    'description',
                                    'who_we_are',
                                    'story',
                                    'mission',
                                    'vision',
                                    'headline',
                                    'items',
                                ].includes(key);
                                return (
                                    <div key={key} className="grid gap-2">
                                        <Label htmlFor={`content_${key}`} className="capitalize">
                                            {label}
                                        </Label>
                                        {help && <p className="text-xs text-muted-foreground">{help}</p>}
                                        {isLong ? (
                                            <textarea
                                                id={`content_${key}`}
                                                className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={data.content[key] || ''}
                                                onChange={(e) => setData('content', { ...data.content, [key]: e.target.value })}
                                            />
                                        ) : (
                                            <Input
                                                id={`content_${key}`}
                                                value={data.content[key] || ''}
                                                onChange={(e) => setData('content', { ...data.content, [key]: e.target.value })}
                                            />
                                        )}
                                    </div>
                                );
                            })}

                            <div className="mt-2 grid gap-2 rounded-md border border-dashed p-4">
                                <Label>Add a new content field</Label>
                                <div className="flex flex-wrap gap-2">
                                    <Input
                                        placeholder="e.g. extra_note"
                                        value={newKey}
                                        onChange={(e) => setNewKey(e.target.value)}
                                        className="max-w-xs"
                                    />
                                    <Button type="button" variant="secondary" onClick={addField}>
                                        Add field
                                    </Button>
                                </div>
                            </div>
                            <InputError message={errors.content} />
                        </CardContent>
                    </Card>

                    <Button type="submit" disabled={processing}>
                        Save section
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
