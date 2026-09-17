import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Testimonial = {
    id: number;
    customer_name: string;
    company?: string | null;
    rating: number;
    is_active?: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Testimonials', href: route('admin.testimonials.index') },
];

export default function TestimonialsIndex({ testimonials }: { testimonials: Testimonial[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Testimonials" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Testimonials</h1>
                        <p className="text-sm text-muted-foreground">Manage client testimonials.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.testimonials.create')}>Add testimonial</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Customer</th>
                                <th className="px-4 py-3 font-medium">Company</th>
                                <th className="px-4 py-3 font-medium">Rating</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testimonials.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-3">{item.customer_name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.company || '—'}</td>
                                    <td className="px-4 py-3">{item.rating}/5</td>
                                    <td className="px-4 py-3">{item.is_active ? 'Active' : 'Inactive'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.testimonials.edit', item.id)}>Edit</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Delete this testimonial?')) {
                                                        router.delete(route('admin.testimonials.destroy', item.id));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {testimonials.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No testimonials yet.
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
