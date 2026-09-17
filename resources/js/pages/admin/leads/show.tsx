import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

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
    description?: string | null;
    attachment?: string | null;
    preferred_deadline?: string | null;
    status: string;
    created_at: string;
};

const statuses = ['new', 'reviewed', 'contacted', 'quoted', 'accepted', 'rejected', 'archived'];

export default function LeadsShow({ quote }: { quote: Quote }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Leads', href: route('admin.leads.index') },
        { title: quote.name, href: route('admin.leads.show', quote.id) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        status: quote.status,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.leads.update', quote.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Lead ${quote.name}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">{quote.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            {quote.reference ? `${quote.reference} · ` : ''}
                            {new Date(quote.created_at).toLocaleString()}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.leads.index')}>Back</Link>
                    </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Lead details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>
                                <span className="text-muted-foreground">Email:</span> {quote.email}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Phone:</span> {quote.phone || '—'}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Company:</span> {quote.company || '—'}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Service:</span> {quote.service?.name || quote.service_name || '—'}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Budget:</span> {quote.budget || '—'}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Preferred deadline:</span>{' '}
                                {quote.preferred_deadline ? new Date(quote.preferred_deadline).toLocaleDateString() : '—'}
                            </p>
                            {quote.description && (
                                <div>
                                    <p className="text-muted-foreground">Description</p>
                                    <p className="whitespace-pre-wrap">{quote.description}</p>
                                </div>
                            )}
                            {quote.attachment && (
                                <p>
                                    <span className="text-muted-foreground">Attachment:</span>{' '}
                                    <a href={quote.attachment} className="underline" target="_blank" rel="noreferrer">
                                        View file
                                    </a>
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Update status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.status} />
                                </div>
                                <Button type="submit" disabled={processing}>
                                    Save status
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
