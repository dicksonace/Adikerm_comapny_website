import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Service = {
    id: number;
    name: string;
    slug: string;
    short_description?: string | null;
    description?: string | null;
    icon?: string | null;
    image?: string | null;
    price?: string | number | null;
    price_label?: string | null;
    features?: string[] | null;
    cta_text?: string | null;
    cta_url?: string | null;
    is_active?: boolean;
    is_featured?: boolean;
    sort_order?: number;
};

export default function ServicesEdit({ service }: { service: Service }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Services', href: route('admin.services.index') },
        { title: service.name, href: route('admin.services.edit', service.id) },
    ];

    const { data, setData, post, processing, errors, transform } = useForm({
        _method: 'put',
        name: service.name || '',
        slug: service.slug || '',
        short_description: service.short_description || '',
        description: service.description || '',
        icon: service.icon || '',
        image: null as File | null,
        price: service.price?.toString() || '',
        price_label: service.price_label || '',
        features_text: (service.features || []).join('\n'),
        cta_text: service.cta_text || '',
        cta_url: service.cta_url || '',
        is_active: service.is_active ?? true,
        is_featured: service.is_featured ?? false,
        sort_order: service.sort_order ?? 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        transform((form) => ({
            ...form,
            features: form.features_text
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean),
            price: form.price === '' ? null : form.price,
        }));
        post(route('admin.services.update', service.id), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${service.name}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Edit service</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.services.index')}>Back</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid max-w-3xl gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                        <InputError message={errors.slug} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="short_description">Short description</Label>
                        <Input id="short_description" value={data.short_description} onChange={(e) => setData('short_description', e.target.value)} />
                        <InputError message={errors.short_description} />
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
                            <Label htmlFor="icon">Icon</Label>
                            <Input id="icon" value={data.icon} onChange={(e) => setData('icon', e.target.value)} />
                            <InputError message={errors.icon} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="image">Image</Label>
                            {service.image && <img src={service.image} alt="" className="mb-2 h-16 w-auto rounded object-cover" />}
                            <Input id="image" type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} />
                            <InputError message={errors.image} />
                        </div>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (number in selected currency)</Label>
                            <Input id="price" type="number" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} />
                            <p className="text-xs text-muted-foreground">Leave empty if using a custom label like “Custom quote”.</p>
                            <InputError message={errors.price} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price_label">Custom price label (optional)</Label>
                            <Input id="price_label" value={data.price_label} onChange={(e) => setData('price_label', e.target.value)} placeholder="Custom quote / Monthly retainers" />
                            <p className="text-xs text-muted-foreground">Used only when Price is empty. Change currency in Company Settings.</p>
                            <InputError message={errors.price_label} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="features_text">Features (one per line)</Label>
                        <textarea
                            id="features_text"
                            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.features_text}
                            onChange={(e) => setData('features_text', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="cta_text">CTA text</Label>
                            <Input id="cta_text" value={data.cta_text} onChange={(e) => setData('cta_text', e.target.value)} />
                            <InputError message={errors.cta_text} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cta_url">CTA URL</Label>
                            <Input id="cta_url" value={data.cta_url} onChange={(e) => setData('cta_url', e.target.value)} />
                            <InputError message={errors.cta_url} />
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
                        Save service
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
