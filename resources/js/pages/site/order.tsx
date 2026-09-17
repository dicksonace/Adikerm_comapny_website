import { PageHero, SectionEyebrow } from '@/components/site/ui';
import { useAsyncForm } from '@/hooks/use-async-form';
import { useT } from '@/hooks/use-translation';
import SiteLayout from '@/layouts/site/site-layout';
import { formatServicePrice } from '@/lib/money';
import type { ServiceItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { FormEventHandler, useMemo } from 'react';

type Props = {
    services: ServiceItem[];
    selected?: string;
};

const fieldClass =
    'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20';

export default function Order({ services, selected }: Props) {
    const { company, currency, locale } = usePage<SharedData>().props;
    const { t } = useT();
    const preselectedId = selected ? String(services.find((s) => s.slug === selected)?.id ?? '') : '';

    const initial = useMemo(
        () => ({
            service_id: preselectedId,
            customer_name: '',
            customer_email: '',
            customer_phone: '',
            requirements: '',
        }),
        [preselectedId],
    );

    const { data, setData, errors, processing, success, reset, submit } = useAsyncForm({
        url: route('site.order.store'),
        initial,
    });

    const onSubmit: FormEventHandler = (e) => {
        void submit(e, {
            service_id: data.service_id === '' ? '' : Number(data.service_id),
        }).then((result) => {
            if (result.ok) {
                reset('customer_name', 'customer_email', 'customer_phone', 'requirements');
            }
        });
    };

    return (
        <SiteLayout>
            <Head title={`${t('nav.place_order', 'Place an Order')} — ${company.name}`} />

            <PageHero
                title={t('order.hero_title', 'Place an order')}
                description={t(
                    'order.hero_desc',
                    'Choose a service, share your requirements, and we will confirm the next steps.',
                )}
                image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
            />

            <section className="py-20 sm:py-28">
                <div className="site-container max-w-3xl">
                    <SectionEyebrow>{t('order.eyebrow', 'Order')}</SectionEyebrow>
                    <h2 className="font-display mt-3 text-3xl font-semibold text-[#0B1F3A]">
                        {t('order.title', 'Service request')}
                    </h2>
                    <p className="mt-3 text-base text-slate-600">
                        {t(
                            'order.blurb',
                            'After you submit, you will receive a reference number so you can follow up easily.',
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
                            <div className="sm:col-span-2">
                                <label htmlFor="service_id" className="text-sm font-medium text-slate-700">
                                    {t('order.service', 'Service')}
                                </label>
                                <select
                                    id="service_id"
                                    className={fieldClass}
                                    value={String(data.service_id)}
                                    onChange={(e) => setData('service_id', e.target.value)}
                                    required
                                >
                                    <option value="">{t('order.select_service', 'Select a service')}</option>
                                    {services.map((service) => {
                                        const name =
                                            locale === 'de' && service.name_de ? service.name_de : service.name;
                                        const price = formatServicePrice(service, currency, {
                                            locale,
                                            fromLabel: t('common.from', 'From'),
                                        });
                                        return (
                                            <option key={service.id} value={service.id}>
                                                {name}
                                                {price ? ` — ${price}` : ''}
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.service_id && <p className="mt-1 text-xs text-red-600">{errors.service_id}</p>}
                            </div>
                            <div>
                                <label htmlFor="customer_name" className="text-sm font-medium text-slate-700">
                                    {t('order.your_name', 'Your name')}
                                </label>
                                <input
                                    id="customer_name"
                                    className={fieldClass}
                                    value={String(data.customer_name)}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    required
                                />
                                {errors.customer_name && (
                                    <p className="mt-1 text-xs text-red-600">{errors.customer_name}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="customer_email" className="text-sm font-medium text-slate-700">
                                    {t('common.email', 'Email')}
                                </label>
                                <input
                                    id="customer_email"
                                    type="email"
                                    className={fieldClass}
                                    value={String(data.customer_email)}
                                    onChange={(e) => setData('customer_email', e.target.value)}
                                    required
                                />
                                {errors.customer_email && (
                                    <p className="mt-1 text-xs text-red-600">{errors.customer_email}</p>
                                )}
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="customer_phone" className="text-sm font-medium text-slate-700">
                                    {t('common.phone', 'Phone')}
                                </label>
                                <input
                                    id="customer_phone"
                                    className={fieldClass}
                                    value={String(data.customer_phone)}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                />
                                {errors.customer_phone && (
                                    <p className="mt-1 text-xs text-red-600">{errors.customer_phone}</p>
                                )}
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="requirements" className="text-sm font-medium text-slate-700">
                                    {t('order.requirements', 'Requirements')}
                                </label>
                                <textarea
                                    id="requirements"
                                    rows={6}
                                    className={fieldClass}
                                    value={String(data.requirements)}
                                    onChange={(e) => setData('requirements', e.target.value)}
                                    required
                                    placeholder={t(
                                        'order.requirements_placeholder',
                                        'Describe goals, features, timeline, and any existing assets or constraints.',
                                    )}
                                />
                                {errors.requirements && (
                                    <p className="mt-1 text-xs text-red-600">{errors.requirements}</p>
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
                                : t('order.submit', 'Submit order')}
                        </button>
                    </form>
                </div>
            </section>
        </SiteLayout>
    );
}
