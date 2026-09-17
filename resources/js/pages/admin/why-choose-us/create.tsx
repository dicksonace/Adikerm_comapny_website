import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Why Choose Us', href: route('admin.why-choose-us.index') },
    { title: 'Create', href: route('admin.why-choose-us.create') },
];

export default function WhyChooseUsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        icon: '',
        is_active: true,
        sort_order: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.why-choose-us.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Why Choose Us" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Add item</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.why-choose-us.index')}>Back</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid max-w-3xl gap-4">
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
                        <InputError message={errors.description} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="icon">Icon</Label>
                        <Input id="icon" value={data.icon} onChange={(e) => setData('icon', e.target.value)} />
                        <InputError message={errors.icon} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="sort_order">Sort order</Label>
                        <Input id="sort_order" type="number" value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                        <InputError message={errors.sort_order} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked === true)} />
                        <Label htmlFor="is_active">Active</Label>
                    </div>
                    <Button type="submit" disabled={processing}>
                        Create item
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
