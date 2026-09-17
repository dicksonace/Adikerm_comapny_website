import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Statistic = {
    id: number;
    label: string;
    value: string;
    suffix?: string | null;
    icon?: string | null;
    is_active?: boolean;
    sort_order?: number;
};

export default function StatisticsEdit({ statistic }: { statistic: Statistic }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Statistics', href: route('admin.statistics.index') },
        { title: statistic.label, href: route('admin.statistics.edit', statistic.id) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        label: statistic.label || '',
        value: statistic.value || '',
        suffix: statistic.suffix || '',
        icon: statistic.icon || '',
        is_active: statistic.is_active ?? true,
        sort_order: statistic.sort_order ?? 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.statistics.update', statistic.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${statistic.label}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Edit statistic</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.statistics.index')}>Back</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid max-w-3xl gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="label">Label</Label>
                        <Input id="label" value={data.label} onChange={(e) => setData('label', e.target.value)} required />
                        <InputError message={errors.label} />
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="value">Value</Label>
                            <Input id="value" value={data.value} onChange={(e) => setData('value', e.target.value)} required />
                            <InputError message={errors.value} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="suffix">Suffix</Label>
                            <Input id="suffix" value={data.suffix} onChange={(e) => setData('suffix', e.target.value)} />
                            <InputError message={errors.suffix} />
                        </div>
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
                        Save statistic
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
