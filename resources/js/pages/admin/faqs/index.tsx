import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Faq = {
    id: number;
    question: string;
    category?: string | null;
    is_active?: boolean;
    sort_order?: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'FAQs', href: route('admin.faqs.index') },
];

export default function FaqsIndex({ faqs }: { faqs: Faq[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="FAQs" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">FAQs</h1>
                        <p className="text-sm text-muted-foreground">Manage frequently asked questions.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.faqs.create')}>Add FAQ</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Question</th>
                                <th className="px-4 py-3 font-medium">Category</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faqs.map((faq) => (
                                <tr key={faq.id} className="border-t">
                                    <td className="px-4 py-3">{faq.question}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{faq.category || '—'}</td>
                                    <td className="px-4 py-3">{faq.is_active ? 'Active' : 'Inactive'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.faqs.edit', faq.id)}>Edit</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Delete this FAQ?')) {
                                                        router.delete(route('admin.faqs.destroy', faq.id));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {faqs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                        No FAQs yet.
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
