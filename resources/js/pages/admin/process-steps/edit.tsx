import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Step = {
    id: number;
    title: string;
    description?: string | null;
    icon?: string | null;
    is_active?: boolean;
    sort_order?: number;
};

export default function ProcessStepsEdit({ step }: { step: Step }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'How We Work', href: route('admin.process-steps.index') },
        { title: 'Edit', href: route('admin.process-steps.edit', step.id) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: step.title || '',
        description: step.description || '',
        icon: step.icon || '',
        is_active: step.is_active ?? true,
        sort_order: step.sort_order ?? 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.process-steps.update', step.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${step.title}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Edit process step</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.process-steps.index')}>Back</Link>
                    </Button>
                </div>
                <form onSubmit={submit} className="grid max-w-2xl gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                        <InputError message={errors.title} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="icon">Icon key</Label>
                            <Input id="icon" value={data.icon} onChange={(e) => setData('icon', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sort_order">Display order</Label>
                            <Input
                                id="sort_order"
                                type="number"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(c) => setData('is_active', c === true)} />
                        <Label htmlFor="is_active">Show on website</Label>
                    </div>
                    <Button type="submit" disabled={processing}>
                        Update step
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
