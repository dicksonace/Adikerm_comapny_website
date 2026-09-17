import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

type Employee = {
    id: number;
    employee_code: string;
    name: string;
    email: string;
    department?: string | null;
    job_title?: string | null;
    role: string;
    status: string;
};

type PaginatorLink = { url: string | null; label: string; active: boolean };

type EmployeesPaginator = {
    data: Employee[];
    links?: PaginatorLink[];
    meta?: { links?: PaginatorLink[] };
};

type Filters = { search: string; status: string; department: string };
type Stats = { total: number; active: number; on_leave: number; departments: number };

const statuses = ['active', 'on_leave', 'suspended', 'terminated'];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Employees', href: route('admin.employees.index') },
];

export default function EmployeesIndex({
    employees,
    filters,
    stats,
    roles,
}: {
    employees: EmployeesPaginator | Employee[];
    filters: Filters;
    stats: Stats;
    roles: Record<string, string>;
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [department, setDepartment] = useState(filters.department || '');

    const rows = Array.isArray(employees) ? employees : employees.data || [];
    const links = Array.isArray(employees) ? [] : employees.links || employees.meta?.links || [];

    const applyFilters: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            route('admin.employees.index'),
            {
                search: search || undefined,
                status: status || undefined,
                department: department || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const metrics = [
        { label: 'Total', value: stats.total },
        { label: 'Active', value: stats.active },
        { label: 'On leave', value: stats.on_leave },
        { label: 'Departments', value: stats.departments },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Employees</h1>
                        <p className="text-sm text-muted-foreground">Staff directory and roles.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.employees.create')}>Add employee</Link>
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
                            placeholder="Name, email, department, code…"
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
                                    {s.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid min-w-[160px] gap-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Department" />
                    </div>
                    <Button type="submit">Filter</Button>
                </form>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Code</th>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Department</th>
                                <th className="px-4 py-3 font-medium">Job title</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((employee) => (
                                <tr key={employee.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">{employee.employee_code}</td>
                                    <td className="px-4 py-3">{employee.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{employee.email}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{employee.department || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{employee.job_title || '—'}</td>
                                    <td className="px-4 py-3">{roles[employee.role] || employee.role}</td>
                                    <td className="px-4 py-3 capitalize">{employee.status.replace('_', ' ')}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.employees.show', employee.id)}>View</Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.employees.edit', employee.id)}>Edit</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Delete this employee?')) {
                                                        router.delete(route('admin.employees.destroy', employee.id));
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
                                        No employees found.
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
