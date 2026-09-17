import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

type Customer = {
    id: number;
    customer_code: string;
    name: string;
    company?: string | null;
    email?: string | null;
    phone?: string | null;
    status: string;
    orders_count?: number;
};

type PaginatorLink = { url: string | null; label: string; active: boolean };

type CustomersPaginator = {
    data: Customer[];
    links?: PaginatorLink[];
    meta?: { current_page?: number; last_page?: number; links?: PaginatorLink[] };
    current_page?: number;
    last_page?: number;
};

type Filters = { search: string; status: string };
type Stats = { total: number; leads: number; active: number; vip: number };

const statuses = ['lead', 'prospect', 'active', 'inactive', 'vip'];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Customers', href: route('admin.customers.index') },
];

export default function CustomersIndex({
    customers,
    filters,
    stats,
}: {
    customers: CustomersPaginator | Customer[];
    filters: Filters;
    stats: Stats;
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const rows = Array.isArray(customers) ? customers : customers.data || [];
    const links = Array.isArray(customers) ? [] : customers.links || customers.meta?.links || [];

    const applyFilters: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(route('admin.customers.index'), { search: search || undefined, status: status || undefined }, { preserveState: true, replace: true });
    };

    const metrics = [
        { label: 'Total', value: stats.total },
        { label: 'Leads', value: stats.leads },
        { label: 'Active', value: stats.active },
        { label: 'VIP', value: stats.vip },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Customers</h1>
                        <p className="text-sm text-muted-foreground">CRM directory of leads and customers.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.customers.create')}>Add customer</Link>
                    </Button>
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

                <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-3">
                    <div className="grid min-w-[200px] flex-1 gap-2">
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Name, email, company, code…"
                        />
                    </div>
                    <div className="grid min-w-[160px] gap-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">All statuses</option>
                            {statuses.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button type="submit">Filter</Button>
                </form>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Code</th>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Company</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Phone</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Orders</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((customer) => (
                                <tr key={customer.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">{customer.customer_code}</td>
                                    <td className="px-4 py-3">{customer.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{customer.company || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{customer.email || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{customer.phone || '—'}</td>
                                    <td className="px-4 py-3 capitalize">{customer.status}</td>
                                    <td className="px-4 py-3">{customer.orders_count ?? 0}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.customers.show', customer.id)}>View</Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.customers.edit', customer.id)}>Edit</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Delete this customer?')) {
                                                        router.delete(route('admin.customers.destroy', customer.id));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {links.length > 3 && (
                    <div className="flex flex-wrap gap-2">
                        {links.map((link, i) =>
                            link.url ? (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => router.get(link.url!)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <Button key={i} variant="outline" size="sm" disabled dangerouslySetInnerHTML={{ __html: link.label }} />
                            ),
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
