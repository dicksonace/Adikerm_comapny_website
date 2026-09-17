import { PageHero, SectionEyebrow } from '@/components/site/ui';
import { useAsyncForm } from '@/hooks/use-async-form';
import { useT } from '@/hooks/use-translation';
import SiteLayout from '@/layouts/site/site-layout';
import type { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { FormEventHandler, useMemo } from 'react';

type Props = {
    services: { id: number; name: string; name_de?: string | null }[];
};

const fieldClass =
    'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20';

export default function RequestQuote({ services }: Props) {
    const { company, locale } = usePage<SharedData>().props;
    const { t } = useT();

    const initial = useMemo(
        () => ({
            name: '',
            email: '',
            phone: '',
            company: '',
            service_id: '' as string | number | null,
            budget: '',
            description: '',
            preferred_deadline: '',
        }),
        [],
    );

    const { data, setData, errors, processing, success, reset, submit } = useAsyncForm({
        url: route('site.quote.store'),
        initial,
    });

    const onSubmit: FormEventHandler = (e) => {
        void submit(e, {
            service_id: data.service_id === '' ? null : Number(data.service_id),
        }).then((result) => {
            if (result.ok) {
                reset();
            }
        });
    };

    return (
        <SiteLayout>
            <Head title={`${t('nav.request_quote', 'Request a Quote')} — ${company.name}`} />

            <PageHero
                title={t('quote.hero_title', 'Request a quote')}
                description={t(
                    'quote.hero_desc',
                    'Tell us what you need. We will respond with a clear next step — quote, proposal, or call.',
                )}
                image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80"
            />

            <section className="py-20 sm:py-28">
                <div className="site-container max-w-3xl">
                    <SectionEyebrow>{t('quote.eyebrow', 'Quote')}</SectionEyebrow>
                    <h2 className="font-display mt-3 text-3xl font-semibold text-[#0B1F3A]">
                        {t('quote.title', 'Project details')}
                    </h2>
                    <p className="mt-3 text-base text-slate-600">
                        {t(
                            'quote.blurb',
                            'Share as much as you can — scope, timeline, and budget help us respond faster.',
                        )}
                    </p>

                    <form
                        onSubmit={onSubmit}
                        className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-8"
                    >
                        {success && (
                            <div className="mb-6 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
                                {success}
                            </div>
                        )}
                        {errors.form && (
                            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {errors.form}
                            </div>
                        )}

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="text-sm font-medium text-slate-700">
                                    {t('common.name', 'Name')}
                                </label>
                                <input
                                    id="name"
                                    className={fieldClass}
                                    value={String(data.name)}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    {t('common.email', 'Email')}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className={fieldClass}
                                    value={String(data.email)}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                                    {t('common.phone', 'Phone')}
                                </label>
                                <input
                                    id="phone"
                                    className={fieldClass}
                                    value={String(data.phone)}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                            </div>
                            <div>
                                <label htmlFor="company" className="text-sm font-medium text-slate-700">
                                    {t('common.company', 'Company')}
                                </label>
                                <input
                                    id="company"
                                    className={fieldClass}
                                    value={String(data.company)}
                                    onChange={(e) => setData('company', e.target.value)}
                                />
                                {errors.company && <p className="mt-1 text-xs text-red-600">{errors.company}</p>}
                            </div>
                            <div>
                                <label htmlFor="service_id" className="text-sm font-medium text-slate-700">
                                    {t('order.service', 'Service')}
                                </label>
                                <select
                                    id="service_id"
                                    className={fieldClass}
                                    value={data.service_id === null ? '' : String(data.service_id)}
                                    onChange={(e) => setData('service_id', e.target.value)}
                                >
                                    <option value="">{t('order.select_service', 'Select a service')}</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {locale === 'de' && service.name_de ? service.name_de : service.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.service_id && <p className="mt-1 text-xs text-red-600">{errors.service_id}</p>}
                            </div>
                            <div>
                                <label htmlFor="budget" className="text-sm font-medium text-slate-700">
                                    {t('quote.budget', 'Budget')}
                                </label>
                                <input
                                    id="budget"
                                    className={fieldClass}
                                    placeholder="e.g. USD 1,500 – 3,000"
                                    value={String(data.budget)}
                                    onChange={(e) => setData('budget', e.target.value)}
                                />
                                {errors.budget && <p className="mt-1 text-xs text-red-600">{errors.budget}</p>}
                            </div>
                            <div>
                                <label htmlFor="preferred_deadline" className="text-sm font-medium text-slate-700">
                                    {t('quote.deadline', 'Preferred deadline')}
                                </label>
                                <input
                                    id="preferred_deadline"
                                    type="date"
                                    className={fieldClass}
                                    value={String(data.preferred_deadline)}
                                    onChange={(e) => setData('preferred_deadline', e.target.value)}
                                />
                                {errors.preferred_deadline && (
                                    <p className="mt-1 text-xs text-red-600">{errors.preferred_deadline}</p>
                                )}
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="text-sm font-medium text-slate-700">
                                    {t('quote.description', 'Project description')}
                                </label>
                                <textarea
                                    id="description"
                                    rows={6}
                                    className={fieldClass}
                                    value={String(data.description)}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                                )}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-6 inline-flex rounded-lg bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d9488] disabled:opacity-60"
                        >
                            {processing
                                ? t('common.submitting', 'Submitting…')
                                : t('quote.submit', 'Submit quote request')}
                        </button>
                    </form>
                </div>
            </section>
        </SiteLayout>
    );
}
