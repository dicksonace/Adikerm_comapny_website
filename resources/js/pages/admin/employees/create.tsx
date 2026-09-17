import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Manager = { id: number; name: string };

const employmentTypes = ['full_time', 'part_time', 'contract', 'intern'];
const statuses = ['active', 'on_leave', 'suspended', 'terminated'];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Employees', href: route('admin.employees.index') },
    { title: 'Create', href: route('admin.employees.create') },
];

export default function EmployeesCreate({
    managers,
    roles,
}: {
    managers: Manager[];
    roles: Record<string, string>;
    defaultPermissions?: Record<string, string[]>;
}) {
    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        email: '',
        phone: '',
        photo_file: null as File | null,
        department: '',
        job_title: '',
        employment_type: 'full_time',
        role: 'staff',
        hired_at: '',
        status: 'active',
        manager_id: '' as string | number,
        emergency_contact: '',
        bio: '',
        salary: '' as string | number,
        show_on_website: false,
        create_login: false,
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        transform((form) => ({
            ...form,
            manager_id: form.manager_id === '' ? null : Number(form.manager_id),
            salary: form.salary === '' ? null : Number(form.salary),
            hired_at: form.hired_at || null,
            password: form.create_login ? form.password : undefined,
        }));
        post(route('admin.employees.store'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Employee" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Add employee</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.employees.index')}>Back</Link>
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
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="photo_file">Photo</Label>
                            <Input
                                id="photo_file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('photo_file', e.target.files?.[0] ?? null)}
                            />
                            <InputError message={errors.photo_file} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" value={data.department} onChange={(e) => setData('department', e.target.value)} />
                            <InputError message={errors.department} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="job_title">Job title</Label>
                            <Input id="job_title" value={data.job_title} onChange={(e) => setData('job_title', e.target.value)} />
                            <InputError message={errors.job_title} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="employment_type">Employment type</Label>
                            <select
                                id="employment_type"
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                value={data.employment_type}
                                onChange={(e) => setData('employment_type', e.target.value)}
                            >
                                {employmentTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.employment_type} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                            >
                                {Object.entries(roles).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.role} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="hired_at">Hired at</Label>
                            <Input id="hired_at" type="date" value={data.hired_at} onChange={(e) => setData('hired_at', e.target.value)} />
                            <InputError message={errors.hired_at} />
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
                                        {s.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.status} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="manager_id">Manager</Label>
                            <select
                                id="manager_id"
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                value={data.manager_id}
                                onChange={(e) => setData('manager_id', e.target.value)}
                            >
                                <option value="">None</option>
                                {managers.map((manager) => (
                                    <option key={manager.id} value={manager.id}>
                                        {manager.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.manager_id} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="emergency_contact">Emergency contact</Label>
                            <Input
                                id="emergency_contact"
                                value={data.emergency_contact}
                                onChange={(e) => setData('emergency_contact', e.target.value)}
                            />
                            <InputError message={errors.emergency_contact} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="salary">Salary</Label>
                            <Input
                                id="salary"
                                type="number"
                                min={0}
                                step="0.01"
                                value={data.salary}
                                onChange={(e) => setData('salary', e.target.value)}
                            />
                            <InputError message={errors.salary} />
                        </div>
                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="bio">Bio</Label>
                            <textarea
                                id="bio"
                                className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                            />
                            <InputError message={errors.bio} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="show_on_website"
                            checked={data.show_on_website}
                            onCheckedChange={(checked) => setData('show_on_website', checked === true)}
                        />
                        <Label htmlFor="show_on_website">Show on website</Label>
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="create_login"
                            checked={data.create_login}
                            onCheckedChange={(checked) => setData('create_login', checked === true)}
                        />
                        <Label htmlFor="create_login">Create login account</Label>
                    </div>

                    {data.create_login && (
                        <div className="grid max-w-sm gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                minLength={8}
                            />
                            <InputError message={errors.password} />
                        </div>
                    )}

                    <Button type="submit" disabled={processing}>
                        Create employee
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
