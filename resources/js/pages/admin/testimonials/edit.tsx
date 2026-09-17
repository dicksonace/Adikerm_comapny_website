import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Testimonial = {
    id: number;
    customer_name: string;
    customer_image?: string | null;
    company?: string | null;
    position?: string | null;
    content: string;
    rating: number;
    is_featured?: boolean;
    is_active?: boolean;
    sort_order?: number;
};

export default function TestimonialsEdit({ testimonial }: { testimonial: Testimonial }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Testimonials', href: route('admin.testimonials.index') },
        { title: testimonial.customer_name, href: route('admin.testimonials.edit', testimonial.id) },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        customer_name: testimonial.customer_name || '',
        customer_image: null as File | null,
        company: testimonial.company || '',
        position: testimonial.position || '',
        content: testimonial.content || '',
        rating: testimonial.rating || 5,
        is_featured: testimonial.is_featured ?? true,
        is_active: testimonial.is_active ?? true,
        sort_order: testimonial.sort_order ?? 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.testimonials.update', testimonial.id), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${testimonial.customer_name}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Edit testimonial</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.testimonials.index')}>Back</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid max-w-3xl gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="customer_name">Customer name</Label>
                        <Input id="customer_name" value={data.customer_name} onChange={(e) => setData('customer_name', e.target.value)} required />
                        <InputError message={errors.customer_name} />
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" value={data.company} onChange={(e) => setData('company', e.target.value)} />
                            <InputError message={errors.company} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="position">Position</Label>
                            <Input id="position" value={data.position} onChange={(e) => setData('position', e.target.value)} />
                            <InputError message={errors.position} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <textarea
                            id="content"
                            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            required
                        />
                        <InputError message={errors.content} />
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rating">Rating</Label>
                            <Input id="rating" type="number" min={1} max={5} value={data.rating} onChange={(e) => setData('rating', Number(e.target.value))} />
                            <InputError message={errors.rating} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="customer_image">Customer image</Label>
                            {testimonial.customer_image && (
                                <img src={testimonial.customer_image} alt="" className="mb-2 h-16 w-16 rounded-full object-cover" />
                            )}
                            <Input id="customer_image" type="file" accept="image/*" onChange={(e) => setData('customer_image', e.target.files?.[0] ?? null)} />
                            <InputError message={errors.customer_image} />
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
                        Save testimonial
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
