import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Website Content', href: route('admin.website.index') },
];

type Module = {
    title: string;
    description: string;
    route: string;
    count_key: string | null;
};

export default function WebsiteIndex({
    counts,
    modules,
}: {
    counts: Record<string, number>;
    modules: Module[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Website Content" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Website Content CMS</h1>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                        Everything on the public landing page is editable here. Change numbers, add services, update
                        hero text, team, FAQs — no code needed.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {modules.map((module) => (
                        <Card key={module.title} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-3">
                                    <CardTitle className="text-base">{module.title}</CardTitle>
                                    {module.count_key && (
                                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                                            {counts[module.count_key] ?? 0}
                                        </span>
                                    )}
                                </div>
                                <CardDescription>{module.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <Button asChild className="w-full sm:w-auto">
                                    <Link href={route(module.route)}>Manage</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Quick tip</CardTitle>
                        <CardDescription>
                            To change <strong>120+</strong> Happy Clients → open <strong>Statistics / Numbers</strong>,
                            edit the value. To change the hero headline → open <strong>Homepage Sections</strong> →
                            Hero. To add a new service → open <strong>Services</strong> → Add service.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </AppLayout>
    );
}
