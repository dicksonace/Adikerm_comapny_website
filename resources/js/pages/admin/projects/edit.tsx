import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Project = {
    id: number;
    title: string;
    slug: string;
    cover_image?: string | null;
    description?: string | null;
    client?: string | null;
    category?: string | null;
    technologies?: string[] | null;
    completed_at?: string | null;
    project_url?: string | null;
    is_featured?: boolean;
    is_active?: boolean;
    sort_order?: number;
};

export default function ProjectsEdit({ project }: { project: Project }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Projects', href: route('admin.projects.index') },
        { title: project.title, href: route('admin.projects.edit', project.id) },
    ];

    const { data, setData, post, processing, errors, transform } = useForm({
        _method: 'put',
        title: project.title || '',
        slug: project.slug || '',
        cover_image: null as File | null,
        description: project.description || '',
        client: project.client || '',
        category: project.category || '',
        technologies_text: (project.technologies || []).join(', '),
        completed_at: project.completed_at ? project.completed_at.slice(0, 10) : '',
        project_url: project.project_url || '',
        is_featured: project.is_featured ?? false,
        is_active: project.is_active ?? true,
        sort_order: project.sort_order ?? 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        transform((form) => ({
            ...form,
            technologies: form.technologies_text
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
            completed_at: form.completed_at || null,
        }));
        post(route('admin.projects.update', project.id), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${project.title}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Edit project</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.projects.index')}>Back</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid max-w-3xl gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                        <InputError message={errors.title} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                        <InputError message={errors.slug} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cover_image">Cover image</Label>
                        {project.cover_image && <img src={project.cover_image} alt="" className="mb-2 h-24 w-auto rounded object-cover" />}
                        <Input id="cover_image" type="file" accept="image/*" onChange={(e) => setData('cover_image', e.target.files?.[0] ?? null)} />
                        <InputError message={errors.cover_image} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} />
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="client">Client</Label>
                            <Input id="client" value={data.client} onChange={(e) => setData('client', e.target.value)} />
                            <InputError message={errors.client} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" value={data.category} onChange={(e) => setData('category', e.target.value)} />
                            <InputError message={errors.category} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="technologies_text">Technologies (comma separated)</Label>
                        <Input id="technologies_text" value={data.technologies_text} onChange={(e) => setData('technologies_text', e.target.value)} />
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="completed_at">Completed at</Label>
                            <Input id="completed_at" type="date" value={data.completed_at} onChange={(e) => setData('completed_at', e.target.value)} />
                            <InputError message={errors.completed_at} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="project_url">Project URL</Label>
                            <Input id="project_url" value={data.project_url} onChange={(e) => setData('project_url', e.target.value)} />
                            <InputError message={errors.project_url} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="sort_order">Sort order</Label>
                        <Input id="sort_order" type="number" value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                        <InputError message={errors.sort_order} />
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked === true)} />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="is_featured" checked={data.is_featured} onCheckedChange={(checked) => setData('is_featured', checked === true)} />
                            <Label htmlFor="is_featured">Featured</Label>
                        </div>
                    </div>
                    <Button type="submit" disabled={processing}>
                        Save project
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
