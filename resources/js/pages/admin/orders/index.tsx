import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Order = {
    id: number;
    reference: string;
    customer_name: string;
    customer_email: string;
    service_name?: string | null;
    service?: { id: number; name: string } | null;
    amount?: string | number | null;
    status: string;
    payment_status: string;
    created_at: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Orders', href: route('admin.orders.index') },
];

export default function OrdersIndex({ orders }: { orders: Order[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Orders</h1>
                    <p className="text-sm text-muted-foreground">Review and update customer orders.</p>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Reference</th>
                                <th className="px-4 py-3 font-medium">Customer</th>
                                <th className="px-4 py-3 font-medium">Service</th>
                                <th className="px-4 py-3 font-medium">Amount</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Payment</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">{order.reference}</td>
                                    <td className="px-4 py-3">
                                        <div>{order.customer_name}</div>
                                        <div className="text-muted-foreground">{order.customer_email}</div>
                                    </td>
                                    <td className="px-4 py-3">{order.service?.name || order.service_name || '—'}</td>
                                    <td className="px-4 py-3">{order.amount ?? '—'}</td>
                                    <td className="px-4 py-3 capitalize">{order.status.replace('_', ' ')}</td>
                                    <td className="px-4 py-3 capitalize">{order.payment_status}</td>
                                    <td className="px-4 py-3">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('admin.orders.show', order.id)}>View</Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        No orders yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
