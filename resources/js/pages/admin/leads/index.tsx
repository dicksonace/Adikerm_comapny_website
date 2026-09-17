import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Quote = {
    id: number;
    reference?: string | null;
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    service_name?: string | null;
    service?: { id: number; name: string } | null;
    budget?: string | null;
    status: string;
    created_at: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Leads', href: route('admin.leads.index') },
];

export default function LeadsIndex({ quotes }: { quotes: Quote[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Leads</h1>
                    <p className="text-sm text-muted-foreground">Quote requests submitted from the site.</p>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Service</th>
                                <th className="px-4 py-3 font-medium">Budget</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotes.map((quote) => (
                                <tr key={quote.id} className="border-t">
                                    <td className="px-4 py-3">{quote.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{quote.email}</td>
                                    <td className="px-4 py-3">{quote.service?.name || quote.service_name || '—'}</td>
                                    <td className="px-4 py-3">{quote.budget || '—'}</td>
                                    <td className="px-4 py-3 capitalize">{quote.status}</td>
                                    <td className="px-4 py-3">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('admin.leads.show', quote.id)}>View</Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {quotes.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No leads yet.
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
