import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Item = {
    id: number;
    title: string;
    description?: string | null;
    icon?: string | null;
    is_active?: boolean;
    sort_order?: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Why Choose Us', href: route('admin.why-choose-us.index') },
];

export default function WhyChooseUsIndex({ items }: { items: Item[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Why Choose Us" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Why Choose Us</h1>
                        <p className="text-sm text-muted-foreground">Manage selling points shown on the site.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.why-choose-us.create')}>Add item</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Title</th>
                                <th className="px-4 py-3 font-medium">Icon</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-3">{item.title}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.icon || '—'}</td>
                                    <td className="px-4 py-3">{item.is_active ? 'Active' : 'Inactive'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.why-choose-us.edit', item.id)}>Edit</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Delete this item?')) {
                                                        router.delete(route('admin.why-choose-us.destroy', item.id));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                        No items yet.
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
