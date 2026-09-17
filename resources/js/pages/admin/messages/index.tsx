import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Message = {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    subject?: string | null;
    status: string;
    created_at: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Messages', href: route('admin.messages.index') },
];

export default function MessagesIndex({ messages }: { messages: Message[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Messages" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Messages</h1>
                    <p className="text-sm text-muted-foreground">Contact form submissions.</p>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Subject</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((message) => (
                                <tr key={message.id} className="border-t">
                                    <td className="px-4 py-3">{message.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{message.email}</td>
                                    <td className="px-4 py-3">{message.subject || '—'}</td>
                                    <td className="px-4 py-3 capitalize">{message.status}</td>
                                    <td className="px-4 py-3">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('admin.messages.show', message.id)}>View</Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No messages yet.
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
