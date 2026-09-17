import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'FAQs', href: route('admin.faqs.index') },
    { title: 'Create', href: route('admin.faqs.create') },
];

export default function FaqsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        question: '',
        answer: '',
        category: '',
        is_active: true,
        sort_order: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.faqs.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create FAQ" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Create FAQ</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.faqs.index')}>Back</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid max-w-3xl gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="question">Question</Label>
                        <Input id="question" value={data.question} onChange={(e) => setData('question', e.target.value)} required />
                        <InputError message={errors.question} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="answer">Answer</Label>
                        <textarea
                            id="answer"
                            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.answer}
                            onChange={(e) => setData('answer', e.target.value)}
                            required
                        />
                        <InputError message={errors.answer} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" value={data.category} onChange={(e) => setData('category', e.target.value)} />
                        <InputError message={errors.category} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="sort_order">Sort order</Label>
                        <Input id="sort_order" type="number" value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                        <InputError message={errors.sort_order} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked === true)} />
                        <Label htmlFor="is_active">Active</Label>
                    </div>
                    <Button type="submit" disabled={processing}>
                        Create FAQ
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
