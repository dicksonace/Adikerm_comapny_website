import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Staff = { id: number; name: string };

const statuses = ['lead', 'prospect', 'active', 'inactive', 'vip'];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Customers', href: route('admin.customers.index') },
    { title: 'Create', href: route('admin.customers.create') },
];

export default function CustomersCreate({ staff }: { staff: Staff[] }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        email: '',
        phone: '',
        whatsapp: '',
        company: '',
        job_title: '',
        website: '',
        address_line: '',
        city: '',
        country: '',
        status: 'lead',
        source: '',
        priority: 3,
        assigned_to: '' as string | number,
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        transform((form) => ({
            ...form,
            assigned_to: form.assigned_to === '' ? null : Number(form.assigned_to),
            priority: Number(form.priority) || null,
        }));
        post(route('admin.customers.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Customer" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Add customer</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.customers.index')}>Back</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid max-w-3xl gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="whatsapp">WhatsApp</Label>
                            <Input id="whatsapp" value={data.whatsapp} onChange={(e) => setData('whatsapp', e.target.value)} />
                            <InputError message={errors.whatsapp} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" value={data.company} onChange={(e) => setData('company', e.target.value)} />
                            <InputError message={errors.company} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="job_title">Job title</Label>
                            <Input id="job_title" value={data.job_title} onChange={(e) => setData('job_title', e.target.value)} />
                            <InputError message={errors.job_title} />
                        </div>
                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" value={data.website} onChange={(e) => setData('website', e.target.value)} />
                            <InputError message={errors.website} />
                        </div>
                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="address_line">Address</Label>
                            <Input id="address_line" value={data.address_line} onChange={(e) => setData('address_line', e.target.value)} />
                            <InputError message={errors.address_line} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} />
                            <InputError message={errors.city} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" value={data.country} onChange={(e) => setData('country', e.target.value)} />
                            <InputError message={errors.country} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                {statuses.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.status} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="source">Source</Label>
                            <Input id="source" value={data.source} onChange={(e) => setData('source', e.target.value)} />
                            <InputError message={errors.source} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="priority">Priority (1–5)</Label>
                            <Input
                                id="priority"
                                type="number"
                                min={1}
                                max={5}
                                value={data.priority}
                                onChange={(e) => setData('priority', Number(e.target.value))}
                            />
                            <InputError message={errors.priority} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="assigned_to">Assigned to</Label>
                            <select
                                id="assigned_to"
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                value={data.assigned_to}
                                onChange={(e) => setData('assigned_to', e.target.value)}
                            >
                                <option value="">Unassigned</option>
                                {staff.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.assigned_to} />
                        </div>
                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                            <InputError message={errors.notes} />
                        </div>
                    </div>
                    <Button type="submit" disabled={processing}>
                        Create customer
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
