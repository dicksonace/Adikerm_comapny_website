import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type OrderRow = {
    id: number;
    reference: string;
    customer_name?: string;
    status: string;
    amount?: string | number | null;
    created_at: string;
};

type Note = {
    id: number;
    type: string;
    title?: string | null;
    body: string;
    created_at: string;
    user?: { name: string } | null;
};

type Activity = {
    id: number;
    type?: string | null;
    title?: string | null;
    description?: string | null;
    created_at: string;
};

type Report = {
    id: number;
    name: string;
    job_title?: string | null;
    department?: string | null;
    status: string;
};

type Employee = {
    id: number;
    employee_code: string;
    name: string;
    email: string;
    phone?: string | null;
    photo?: string | null;
    department?: string | null;
    job_title?: string | null;
    employment_type?: string;
    role: string;
    permissions?: string[] | null;
    hired_at?: string | null;
    status: string;
    emergency_contact?: string | null;
    bio?: string | null;
    salary?: string | number | null;
    show_on_website?: boolean;
    manager?: { id: number; name: string } | null;
    user?: { id: number; name: string; email: string } | null;
    reports?: Report[];
};

const noteTypes = ['note', 'call', 'email', 'meeting', 'task'];

export default function EmployeesShow({
    employee,
    assignedOrders,
    notes,
    activities,
    roles,
}: {
    employee: Employee;
    assignedOrders: OrderRow[];
    notes: Note[];
    activities: Activity[];
    roles: Record<string, string>;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Employees', href: route('admin.employees.index') },
        { title: employee.name, href: route('admin.employees.show', employee.id) },
    ];

    const reports = employee.reports || [];
    const permissions = employee.permissions || [];

    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'note',
        title: '',
        body: '',
    });

    const submitNote: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.employees.notes.store', employee.id), {
            onSuccess: () => reset('title', 'body'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={employee.name} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        {employee.photo ? (
                            <img src={employee.photo} alt="" className="h-20 w-20 rounded-full object-cover" />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-xl font-semibold">
                                {employee.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-semibold">{employee.name}</h1>
                                <Badge variant="secondary" className="capitalize">
                                    {employee.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {employee.employee_code}
                                {employee.job_title ? ` · ${employee.job_title}` : ''}
                                {employee.department ? ` · ${employee.department}` : ''}
                            </p>
                            <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href={route('admin.employees.edit', employee.id)}>Edit</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('admin.employees.index')}>Back</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                            <p>
                                <span className="text-muted-foreground">Phone:</span> {employee.phone || '—'}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Employment:</span>{' '}
                                {employee.employment_type?.replace('_', ' ') || '—'}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Manager:</span> {employee.manager?.name || '—'}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Hired:</span>{' '}
                                {employee.hired_at ? new Date(employee.hired_at).toLocaleDateString() : '—'}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Emergency:</span> {employee.emergency_contact || '—'}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Login user:</span> {employee.user?.email || '—'}
                            </p>
                            {employee.bio && (
                                <div className="sm:col-span-2">
                                    <p className="text-muted-foreground">Bio</p>
                                    <p className="whitespace-pre-wrap">{employee.bio}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Role & permissions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <p>
                                <span className="text-muted-foreground">Role:</span> {roles[employee.role] || employee.role}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {permissions.length === 0 && <span className="text-muted-foreground">No custom permissions.</span>}
                                {permissions.map((perm) => (
                                    <Badge key={perm} variant="outline">
                                        {perm}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Direct reports</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {reports.length === 0 && <p className="text-sm text-muted-foreground">No direct reports.</p>}
                            {reports.map((report) => (
                                <Link
                                    key={report.id}
                                    href={route('admin.employees.show', report.id)}
                                    className="block rounded-md border p-3 text-sm hover:bg-muted/40"
                                >
                                    <div className="flex justify-between gap-2">
                                        <span className="font-medium">{report.name}</span>
                                        <span className="capitalize text-muted-foreground">{report.status.replace('_', ' ')}</span>
                                    </div>
                                    <p className="text-muted-foreground">
                                        {[report.job_title, report.department].filter(Boolean).join(' · ') || '—'}
                                    </p>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Assigned orders</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {assignedOrders.length === 0 && <p className="text-sm text-muted-foreground">No assigned orders.</p>}
                            {assignedOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={route('admin.orders.show', order.id)}
                                    className="block rounded-md border p-3 text-sm hover:bg-muted/40"
                                >
                                    <div className="flex justify-between gap-2">
                                        <span className="font-medium">{order.reference}</span>
                                        <span className="capitalize text-muted-foreground">{order.status.replace('_', ' ')}</span>
                                    </div>
                                    <p className="text-muted-foreground">
                                        {order.customer_name || '—'}
                                        {order.amount != null ? ` · ${order.amount}` : ''}
                                    </p>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
                            {notes.map((note) => (
                                <div key={note.id} className="rounded-md border p-3 text-sm">
                                    <div className="flex justify-between gap-2">
                                        <span className="font-medium capitalize">{note.title || note.type}</span>
                                        <span className="text-muted-foreground">{new Date(note.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{note.user?.name || 'System'}</p>
                                    <p className="mt-1 whitespace-pre-wrap">{note.body}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Add note</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitNote} className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Type</Label>
                                    <select
                                        id="type"
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                    >
                                        {noteTypes.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.type} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                    <InputError message={errors.title} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="body">Body</Label>
                                    <textarea
                                        id="body"
                                        className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={data.body}
                                        onChange={(e) => setData('body', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.body} />
                                </div>
                                <Button type="submit" disabled={processing}>
                                    Save note
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {activities.length === 0 && <p className="text-sm text-muted-foreground">No activity yet.</p>}
                        {activities.map((activity) => (
                            <div key={activity.id} className="rounded-md border p-3 text-sm">
                                <div className="flex justify-between gap-2">
                                    <span className="font-medium">{activity.title || activity.type || 'Activity'}</span>
                                    <span className="text-muted-foreground">{new Date(activity.created_at).toLocaleString()}</span>
                                </div>
                                {activity.description && <p className="mt-1 text-muted-foreground">{activity.description}</p>}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
