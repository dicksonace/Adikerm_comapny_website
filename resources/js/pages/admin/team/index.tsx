import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Member = {
    id: number;
    name: string;
    position: string;
    department?: string | null;
    email?: string | null;
    is_active?: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Team', href: route('admin.team.index') },
];

export default function TeamIndex({ members }: { members: Member[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Team</h1>
                        <p className="text-sm text-muted-foreground">Manage team members.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.team.create')}>Add member</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Position</th>
                                <th className="px-4 py-3 font-medium">Department</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id} className="border-t">
                                    <td className="px-4 py-3">{member.name}</td>
                                    <td className="px-4 py-3">{member.position}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{member.department || '—'}</td>
                                    <td className="px-4 py-3">{member.is_active ? 'Active' : 'Inactive'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.team.edit', member.id)}>Edit</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Delete this team member?')) {
                                                        router.delete(route('admin.team.destroy', member.id));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {members.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No team members yet.
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
