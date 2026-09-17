import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Member = {
    id: number;
    name: string;
    position: string;
    department?: string | null;
    photo?: string | null;
    bio?: string | null;
    email?: string | null;
    is_active?: boolean;
    sort_order?: number;
};

export default function TeamEdit({ member }: { member: Member }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Team', href: route('admin.team.index') },
        { title: member.name, href: route('admin.team.edit', member.id) },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: member.name || '',
        position: member.position || '',
        department: member.department || '',
        photo: null as File | null,
        bio: member.bio || '',
        email: member.email || '',
        is_active: member.is_active ?? true,
        sort_order: member.sort_order ?? 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.team.update', member.id), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${member.name}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Edit team member</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.team.index')}>Back</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid max-w-3xl gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="position">Position</Label>
                        <Input id="position" value={data.position} onChange={(e) => setData('position', e.target.value)} required />
                        <InputError message={errors.position} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" value={data.department} onChange={(e) => setData('department', e.target.value)} />
                        <InputError message={errors.department} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="photo">Photo</Label>
                        {member.photo && <img src={member.photo} alt="" className="mb-2 h-16 w-16 rounded-full object-cover" />}
                        <Input id="photo" type="file" accept="image/*" onChange={(e) => setData('photo', e.target.files?.[0] ?? null)} />
                        <InputError message={errors.photo} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                            id="bio"
                            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                        />
                        <InputError message={errors.bio} />
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
                        Save member
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
