import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Step = {
    id: number;
    title: string;
    description?: string | null;
    icon?: string | null;
    is_active?: boolean;
    sort_order?: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Website Content', href: route('admin.website.index') },
    { title: 'How We Work', href: route('admin.process-steps.index') },
];

export default function ProcessStepsIndex({ steps }: { steps: Step[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="How We Work" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">How We Work</h1>
                        <p className="text-sm text-muted-foreground">Process steps shown on the landing page. Add as many as you need.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.process-steps.create')}>Add step</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Order</th>
                                <th className="px-4 py-3 font-medium">Title</th>
                                <th className="px-4 py-3 font-medium">Description</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {steps.map((step) => (
                                <tr key={step.id} className="border-t">
                                    <td className="px-4 py-3">{step.sort_order}</td>
                                    <td className="px-4 py-3 font-medium">{step.title}</td>
                                    <td className="max-w-md px-4 py-3 text-muted-foreground">{step.description}</td>
                                    <td className="px-4 py-3">{step.is_active ? 'Active' : 'Hidden'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.process-steps.edit', step.id)}>Edit</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Delete this step?')) {
                                                        router.delete(route('admin.process-steps.destroy', step.id));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {steps.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No process steps yet. Add your first step.
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
