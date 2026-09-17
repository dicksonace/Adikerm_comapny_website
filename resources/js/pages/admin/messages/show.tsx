import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Message = {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    subject?: string | null;
    message: string;
    status: string;
    read_at?: string | null;
    created_at: string;
};

const statuses = ['new', 'read', 'archived'];

export default function MessagesShow({ message }: { message: Message }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Messages', href: route('admin.messages.index') },
        { title: message.name, href: route('admin.messages.show', message.id) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        status: message.status,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.messages.update', message.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Message from ${message.name}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">{message.subject || 'Contact message'}</h1>
                        <p className="text-sm text-muted-foreground">{new Date(message.created_at).toLocaleString()}</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.messages.index')}>Back</Link>
                    </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Message</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>
                                <span className="text-muted-foreground">From:</span> {message.name}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Email:</span> {message.email}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Phone:</span> {message.phone || '—'}
                            </p>
                            <div>
                                <p className="text-muted-foreground">Content</p>
                                <p className="whitespace-pre-wrap">{message.message}</p>
                            </div>
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
