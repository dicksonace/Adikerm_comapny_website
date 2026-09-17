import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Statistic = {
    id: number;
    label: string;
    value: string;
    suffix?: string | null;
    icon?: string | null;
    is_active?: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Statistics', href: route('admin.statistics.index') },
];

export default function StatisticsIndex({ statistics }: { statistics: Statistic[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Statistics" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Statistics / Numbers</h1>
                        <p className="text-sm text-muted-foreground">
                            These numbers appear under the hero (e.g. 120+ Happy Clients). Edit values or add new stats anytime.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.statistics.create')}>Add new number</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Label</th>
                                <th className="px-4 py-3 font-medium">Value</th>
                                <th className="px-4 py-3 font-medium">Suffix</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statistics.map((statistic) => (
                                <tr key={statistic.id} className="border-t">
                                    <td className="px-4 py-3">{statistic.label}</td>
                                    <td className="px-4 py-3">{statistic.value}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{statistic.suffix || '—'}</td>
                                    <td className="px-4 py-3">{statistic.is_active ? 'Active' : 'Inactive'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.statistics.edit', statistic.id)}>Edit</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Delete this statistic?')) {
                                                        router.delete(route('admin.statistics.destroy', statistic.id));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {statistics.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No statistics yet.
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
