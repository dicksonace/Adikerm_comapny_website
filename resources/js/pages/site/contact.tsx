import { PageHero, SectionEyebrow } from '@/components/site/ui';
import { useAsyncForm } from '@/hooks/use-async-form';
import { localized, useT } from '@/hooks/use-translation';
import SiteLayout from '@/layouts/site/site-layout';
import type { SharedData, SiteSection } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { FormEventHandler, useMemo } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

type Props = {
    section: SiteSection | null;
};

const fieldClass =
    'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20';

export default function Contact({ section }: Props) {
    const { company, locale } = usePage<SharedData>().props;
    const { t } = useT();
    const raw = (section?.content || {}) as Record<string, unknown>;
    const L = (key: string) => localized(raw, key, locale) || '';

    const initial = useMemo(
        () => ({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        }),
        [],
    );

    const { data, setData, errors, processing, success, reset, submit } = useAsyncForm({
        url: route('site.contact.store'),
        initial,
    });

    const onSubmit: FormEventHandler = (e) => {
        void submit(e).then((result) => {
            if (result.ok) {
                reset();
            }
        });
    };

    return (
        <SiteLayout>
            <Head title={`${t('nav.contact', 'Contact')} — ${company.name}`} />

            <PageHero
                title={L('title') || 'Contact us'}
                description={L('description')}
                image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1600&q=80"
            />

            <section className="py-20 sm:py-28">
                <div className="site-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <SectionEyebrow>{L('eyebrow') || t('nav.contact', 'Contact')}</SectionEyebrow>
                        <h2 className="font-display mt-3 text-3xl font-semibold text-[#0B1F3A]">
                            {t('common.get_in_touch', 'Get in touch')}
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-600">
                            {L('description') ||
                                t(
                                    'common.contact_blurb',
                                    'Reach us by phone, email, or the form. We typically respond within one business day.',
                                )}
                        </p>

                        <div className="mt-10 space-y-5">
                            {company.address && (
                                <div className="flex gap-3">
                                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#0F766E]">
                                        <MapPin className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="text-xs tracking-[0.16em] text-slate-400 uppercase">
                                            {t('common.address', 'Address')}
                                        </p>
                                        <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{company.address}</p>
                                    </div>
                                </div>
                            )}
                            {company.phone && (
                                <div className="flex gap-3">
                                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#0F766E]">
                                        <Phone className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="text-xs tracking-[0.16em] text-slate-400 uppercase">
                                            {t('common.phone', 'Phone')}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-700">{company.phone}</p>
                                    </div>
                                </div>
                            )}
                            {company.email && (
                                <div className="flex gap-3">
                                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#0F766E]">
                                        <Mail className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="text-xs tracking-[0.16em] text-slate-400 uppercase">
                                            {t('common.email', 'Email')}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-700">{company.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <form
                        onSubmit={onSubmit}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-8"
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
                                <label htmlFor="subject" className="text-sm font-medium text-slate-700">
                                    {t('common.subject', 'Subject')}
                                </label>
                                <input
                                    id="subject"
                                    className={fieldClass}
                                    value={String(data.subject)}
                                    onChange={(e) => setData('subject', e.target.value)}
                                />
                                {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="text-sm font-medium text-slate-700">
                                    {t('common.message', 'Message')}
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className={fieldClass}
                                    value={String(data.message)}
                                    onChange={(e) => setData('message', e.target.value)}
                                    required
                                />
                                {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-6 inline-flex rounded-lg bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d9488] disabled:opacity-60"
                        >
                            {processing
                                ? t('common.sending', 'Sending…')
                                : t('common.send_message', 'Send message')}
                        </button>
                    </form>
                </div>
            </section>
        </SiteLayout>
    );
}
