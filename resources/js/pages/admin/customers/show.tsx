import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Staff = { id: number; name: string };

type OrderRow = {
    id: number;
    reference: string;
    status: string;
    amount?: string | number | null;
    created_at: string;
};

type QuoteRow = {
    id: number;
    reference?: string | null;
    name?: string;
    service_name?: string | null;
    status: string;
    created_at: string;
};

type MessageRow = {
    id: number;
    subject?: string | null;
    status: string;
    created_at: string;
};

type Activity = {
    id: number;
    type?: string | null;
    title?: string | null;
    description?: string | null;
    created_at: string;
};

type Note = {
    id: number;
    type: string;
    title?: string | null;
    body: string;
    created_at: string;
    user?: { name: string } | null;
};

type Customer = {
    id: number;
    customer_code: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    company?: string | null;
    job_title?: string | null;
    website?: string | null;
    address_line?: string | null;
    city?: string | null;
    country?: string | null;
    status: string;
    source?: string | null;
    priority?: number | null;
    notes?: string | null;
    last_contacted_at?: string | null;
    assignee?: { id: number; name: string; email?: string } | null;
    orders?: OrderRow[];
    quote_requests?: QuoteRow[];
    quoteRequests?: QuoteRow[];
    contact_messages?: MessageRow[];
    contactMessages?: MessageRow[];
    activities?: Activity[];
};

const noteTypes = ['note', 'call', 'email', 'meeting', 'task'];

export default function CustomersShow({
    customer,
    notes,
}: {
    customer: Customer;
    notes: Note[];
    staff?: Staff[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Customers', href: route('admin.customers.index') },
        { title: customer.name, href: route('admin.customers.show', customer.id) },
    ];

    const quotes = customer.quoteRequests || customer.quote_requests || [];
    const messages = customer.contactMessages || customer.contact_messages || [];
    const activities = customer.activities || [];
    const orders = customer.orders || [];

    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'note',
        title: '',
        body: '',
    });

    const submitNote: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.customers.notes.store', customer.id), {
            onSuccess: () => reset('title', 'body'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={customer.name} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-semibold">{customer.name}</h1>
                            <Badge variant="secondary" className="capitalize">
                                {customer.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {customer.customer_code}
                            {customer.company ? ` · ${customer.company}` : ''}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href={route('admin.customers.edit', customer.id)}>Edit</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('admin.customers.index')}>Back</Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Contact info</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                        <p>
                            <span className="text-muted-foreground">Email:</span> {customer.email || '—'}
                        </p>
                        <p>
                            <span className="text-muted-foreground">Phone:</span> {customer.phone || '—'}
                        </p>
                        <p>
                            <span className="text-muted-foreground">WhatsApp:</span> {customer.whatsapp || '—'}
                        </p>
                        <p>
                            <span className="text-muted-foreground">Job title:</span> {customer.job_title || '—'}
                        </p>
                        <p>
                            <span className="text-muted-foreground">Website:</span> {customer.website || '—'}
                        </p>
                        <p>
                            <span className="text-muted-foreground">Source:</span> {customer.source || '—'}
                        </p>
                        <p>
                            <span className="text-muted-foreground">Priority:</span> {customer.priority ?? '—'}
                        </p>
                        <p>
                            <span className="text-muted-foreground">Assignee:</span> {customer.assignee?.name || '—'}
                        </p>
                        <p>
                            <span className="text-muted-foreground">Last contacted:</span>{' '}
                            {customer.last_contacted_at ? new Date(customer.last_contacted_at).toLocaleString() : '—'}
                        </p>
                        <p className="sm:col-span-2">
                            <span className="text-muted-foreground">Address:</span>{' '}
                            {[customer.address_line, customer.city, customer.country].filter(Boolean).join(', ') || '—'}
                        </p>
                        {customer.notes && (
                            <div className="sm:col-span-2 lg:col-span-3">
                                <p className="text-muted-foreground">Profile notes</p>
                                <p className="whitespace-pre-wrap">{customer.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Orders</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {orders.length === 0 && <p className="text-sm text-muted-foreground">No orders.</p>}
                            {orders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={route('admin.orders.show', order.id)}
                                    className="block rounded-md border p-3 text-sm hover:bg-muted/40"
                                >
                                    <div className="flex justify-between gap-2">
                                        <span className="font-medium">{order.reference}</span>
                                        <span className="capitalize text-muted-foreground">{order.status.replace('_', ' ')}</span>
                                    </div>
                                    <p className="text-muted-foreground">
                                        {order.amount ?? '—'} · {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quotes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {quotes.length === 0 && <p className="text-sm text-muted-foreground">No quote requests.</p>}
                            {quotes.map((quote) => (
                                <Link
                                    key={quote.id}
                                    href={route('admin.leads.show', quote.id)}
                                    className="block rounded-md border p-3 text-sm hover:bg-muted/40"
                                >
                                    <div className="flex justify-between gap-2">
                                        <span className="font-medium">{quote.reference || quote.service_name || `Quote #${quote.id}`}</span>
                                        <span className="capitalize text-muted-foreground">{quote.status}</span>
                                    </div>
                                    <p className="text-muted-foreground">{new Date(quote.created_at).toLocaleDateString()}</p>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Messages</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {messages.length === 0 && <p className="text-sm text-muted-foreground">No messages.</p>}
                            {messages.map((message) => (
                                <Link
                                    key={message.id}
                                    href={route('admin.messages.show', message.id)}
                                    className="block rounded-md border p-3 text-sm hover:bg-muted/40"
                                >
                                    <div className="flex justify-between gap-2">
                                        <span className="font-medium">{message.subject || `Message #${message.id}`}</span>
                                        <span className="capitalize text-muted-foreground">{message.status}</span>
                                    </div>
                                    <p className="text-muted-foreground">{new Date(message.created_at).toLocaleDateString()}</p>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {activities.length === 0 && <p className="text-sm text-muted-foreground">No activity yet.</p>}
                            {activities.map((activity) => (
                                <div key={activity.id} className="rounded-md border p-3 text-sm">
                                    <div className="flex justify-between gap-2">
                                        <span className="font-medium">{activity.title || activity.type || 'Activity'}</span>
                                        <span className="text-muted-foreground">{new Date(activity.created_at).toLocaleString()}</span>
                                    </div>
                                    {activity.description && <p className="mt-1 text-muted-foreground">{activity.description}</p>}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
                            {notes.map((note) => (
                                <div key={note.id} className="rounded-md border p-3 text-sm">
                                    <div className="flex justify-between gap-2">
                                        <span className="font-medium capitalize">{note.title || note.type}</span>
                                        <span className="text-muted-foreground">{new Date(note.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{note.user?.name || 'System'}</p>
                                    <p className="mt-1 whitespace-pre-wrap">{note.body}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Add note</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitNote} className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Type</Label>
                                    <select
                                        id="type"
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                    >
                                        {noteTypes.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.type} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                    <InputError message={errors.title} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="body">Body</Label>
                                    <textarea
                                        id="body"
                                        className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={data.body}
                                        onChange={(e) => setData('body', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.body} />
                                </div>
                                <Button type="submit" disabled={processing}>
                                    Save note
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
