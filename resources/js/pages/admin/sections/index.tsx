import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SiteSection } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Website Content', href: route('admin.website.index') },
    { title: 'Sections', href: route('admin.sections.index') },
];

export default function SectionsIndex({
    sections,
    guides,
}: {
    sections: SiteSection[];
    guides: Record<string, string>;
}) {
    const toggleEnabled = (section: SiteSection) => {
        router.put(route('admin.sections.update', section.id), {
            is_enabled: !section.is_enabled,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Homepage Sections" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Homepage Sections</h1>
                        <p className="text-sm text-muted-foreground">
                            Edit text for each landing-page block. Enable/disable sections without code.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.website.index')}>Website CMS hub</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Section</th>
                                <th className="px-4 py-3 font-medium">What you can edit</th>
                                <th className="px-4 py-3 font-medium">Order</th>
                                <th className="px-4 py-3 font-medium">Visible</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sections.map((section) => (
                                <tr key={section.id} className="border-t align-top">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{section.name}</div>
                                        <div className="text-xs text-muted-foreground">{section.key}</div>
                                    </td>
                                    <td className="max-w-md px-4 py-3 text-muted-foreground">
                                        {guides[section.key] || 'Section content fields'}
                                    </td>
                                    <td className="px-4 py-3">{section.sort_order}</td>
                                    <td className="px-4 py-3">
                                        <Button type="button" variant="outline" size="sm" onClick={() => toggleEnabled(section)}>
                                            {section.is_enabled ? 'On' : 'Off'}
                                        </Button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('admin.sections.edit', section.id)}>Edit text</Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Need to change numbers or add items?</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" variant="secondary" asChild>
                            <Link href={route('admin.statistics.index')}>Edit statistics numbers</Link>
                        </Button>
                        <Button size="sm" variant="secondary" asChild>
                            <Link href={route('admin.services.index')}>Add / edit services</Link>
                        </Button>
                        <Button size="sm" variant="secondary" asChild>
                            <Link href={route('admin.process-steps.index')}>How we work steps</Link>
                        </Button>
                        <Button size="sm" variant="secondary" asChild>
                            <Link href={route('admin.team.index')}>Team members</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
