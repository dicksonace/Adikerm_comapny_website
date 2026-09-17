import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type AdminUser = { id: number; name: string; email: string };

type Order = {
    id: number;
    reference: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string | null;
    service_name?: string | null;
    service?: { id: number; name: string } | null;
    requirements?: string | null;
    amount?: string | number | null;
    currency?: string | null;
    status: string;
    payment_status: string;
    assigned_to?: number | null;
    admin_notes?: string | null;
    options?: Record<string, unknown> | null;
    created_at: string;
    updates?: Array<{
        id: number;
        note?: string | null;
        status?: string | null;
        created_at: string;
        user?: { name: string } | null;
    }>;
};

const statuses = ['pending', 'confirmed', 'processing', 'in_progress', 'completed', 'cancelled'];
const payments = ['unpaid', 'paid', 'partial', 'refunded'];

export default function OrdersShow({ order, admins }: { order: Order; admins: AdminUser[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Orders', href: route('admin.orders.index') },
        { title: order.reference, href: route('admin.orders.show', order.id) },
    ];

    const { data, setData, put, processing, errors, transform } = useForm({
        status: order.status,
        payment_status: order.payment_status,
        assigned_to: order.assigned_to?.toString() || '',
        admin_notes: order.admin_notes || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        transform((form) => ({
            ...form,
            assigned_to: form.assigned_to === '' ? null : Number(form.assigned_to),
        }));
        put(route('admin.orders.update', order.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order ${order.reference}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Order {order.reference}</h1>
                        <p className="text-sm text-muted-foreground">Placed {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.orders.index')}>Back</Link>
                    </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>
                                <span className="text-muted-foreground">Name:</span> {order.customer_name}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Email:</span> {order.customer_email}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Phone:</span> {order.customer_phone || '—'}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Service:</span> {order.service?.name || order.service_name || '—'}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Amount:</span> {order.amount ?? '—'} {order.currency || ''}
                            </p>
                            {order.requirements && (
                                <div>
                                    <p className="text-muted-foreground">Requirements</p>
                                    <p className="whitespace-pre-wrap">{order.requirements}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Update order</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status.replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.status} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="payment_status">Payment status</Label>
                                    <select
                                        id="payment_status"
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={data.payment_status}
                                        onChange={(e) => setData('payment_status', e.target.value)}
                                    >
                                        {payments.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.payment_status} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="assigned_to">Assignee</Label>
                                    <select
                                        id="assigned_to"
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={data.assigned_to}
                                        onChange={(e) => setData('assigned_to', e.target.value)}
                                    >
                                        <option value="">Unassigned</option>
                                        {admins.map((admin) => (
                                            <option key={admin.id} value={admin.id}>
                                                {admin.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.assigned_to} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="admin_notes">Admin notes</Label>
                                    <textarea
                                        id="admin_notes"
                                        className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={data.admin_notes}
                                        onChange={(e) => setData('admin_notes', e.target.value)}
                                    />
                                    <InputError message={errors.admin_notes} />
                                </div>
                                <Button type="submit" disabled={processing}>
                                    Save changes
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {order.updates && order.updates.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Updates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {order.updates.map((update) => (
                                <div key={update.id} className="rounded-md border p-3 text-sm">
                                    <div className="flex justify-between gap-2">
                                        <span className="font-medium">{update.user?.name || 'System'}</span>
                                        <span className="text-muted-foreground">{new Date(update.created_at).toLocaleString()}</span>
                                    </div>
                                    {update.status && <p className="capitalize text-muted-foreground">{update.status.replace('_', ' ')}</p>}
                                    {update.note && <p className="mt-1 whitespace-pre-wrap">{update.note}</p>}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
