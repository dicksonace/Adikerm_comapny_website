import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

type OrderRow = {
    id: number;
    reference: string;
    customer_name: string;
    service_name?: string | null;
    amount?: string | number | null;
    status: string;
    created_at: string;
};

type LeadRow = {
    id: number;
    reference?: string | null;
    name: string;
    email: string;
    service_name?: string | null;
    status: string;
    created_at: string;
};

type MessageRow = {
    id: number;
    name: string;
    email: string;
    subject?: string | null;
    status: string;
    created_at: string;
};

type CustomerRow = {
    id: number;
    customer_code?: string;
    name: string;
    email?: string | null;
    company?: string | null;
    status: string;
    created_at: string;
};

type Stats = {
    orders_total: number;
    orders_pending: number;
    orders_completed: number;
    revenue: number;
    leads: number;
    messages: number;
    subscribers: number;
    services: number;
    customers?: number;
    customers_active?: number;
    employees?: number;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: route('admin.dashboard') }];

function formatMoney(value: number) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value || 0);
}

export default function AdminDashboard({
    stats,
    recentOrders,
    recentLeads,
    recentMessages,
    recentCustomers,
}: {
    stats: Stats;
    recentOrders: OrderRow[];
    recentLeads: LeadRow[];
    recentMessages: MessageRow[];
    recentCustomers?: CustomerRow[];
}) {
    const metrics = [
        { label: 'Orders', value: stats.orders_total },
        { label: 'Pending orders', value: stats.orders_pending },
        { label: 'Completed orders', value: stats.orders_completed },
        { label: 'Revenue', value: formatMoney(stats.revenue) },
        ...(stats.customers != null ? [{ label: 'Customers', value: stats.customers }] : []),
        ...(stats.customers_active != null ? [{ label: 'Active customers', value: stats.customers_active }] : []),
        ...(stats.employees != null ? [{ label: 'Active employees', value: stats.employees }] : []),
        { label: 'New leads', value: stats.leads },
        { label: 'New messages', value: stats.messages },
        { label: 'Subscribers', value: stats.subscribers },
        { label: 'Active services', value: stats.services },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Overview of orders, leads, and site activity.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
                        <Card key={metric.label}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-semibold">{metric.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className={`grid gap-4 ${recentCustomers ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
                    <Card className="xl:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-base">Recent orders</CardTitle>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('admin.orders.index')}>View all</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentOrders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
                            {recentOrders.map((order) => (
                                <Link key={order.id} href={route('admin.orders.show', order.id)} className="block rounded-md border p-3 hover:bg-muted/40">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-medium">{order.reference}</span>
                                        <span className="text-xs uppercase text-muted-foreground">{order.status}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {order.customer_name}
                                        {order.service_name ? ` · ${order.service_name}` : ''}
                                    </p>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-base">Recent leads</CardTitle>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('admin.leads.index')}>View all</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentLeads.length === 0 && <p className="text-sm text-muted-foreground">No leads yet.</p>}
                            {recentLeads.map((lead) => (
                                <Link key={lead.id} href={route('admin.leads.show', lead.id)} className="block rounded-md border p-3 hover:bg-muted/40">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-medium">{lead.name}</span>
                                        <span className="text-xs uppercase text-muted-foreground">{lead.status}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-base">Recent messages</CardTitle>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('admin.messages.index')}>View all</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentMessages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
                            {recentMessages.map((message) => (
                                <Link
                                    key={message.id}
                                    href={route('admin.messages.show', message.id)}
                                    className="block rounded-md border p-3 hover:bg-muted/40"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-medium">{message.name}</span>
                                        <span className="text-xs uppercase text-muted-foreground">{message.status}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{message.subject || message.email}</p>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    {recentCustomers && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-base">Recent customers</CardTitle>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={route('admin.customers.index')}>View all</Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {recentCustomers.length === 0 && <p className="text-sm text-muted-foreground">No customers yet.</p>}
                                {recentCustomers.map((customer) => (
                                    <Link
                                        key={customer.id}
                                        href={route('admin.customers.show', customer.id)}
                                        className="block rounded-md border p-3 hover:bg-muted/40"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-medium">{customer.name}</span>
                                            <span className="text-xs uppercase text-muted-foreground">{customer.status}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {customer.customer_code || customer.company || customer.email || '—'}
                                        </p>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
