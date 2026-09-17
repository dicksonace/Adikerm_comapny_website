import { PageHero, PrimaryButton, SectionEyebrow, SectionHeading } from '@/components/site/ui';
import { localized, useT } from '@/hooks/use-translation';
import SiteLayout from '@/layouts/site/site-layout';
import type { FaqItem, SharedData, SiteSection } from '@/types';
import { Head, usePage } from '@inertiajs/react';

type Props = {
    section: SiteSection | null;
    faqs: FaqItem[];
};

export default function Faq({ section, faqs }: Props) {
    const { company, locale } = usePage<SharedData>().props;
    const { t } = useT();
    const raw = (section?.content || {}) as Record<string, unknown>;
    const L = (key: string) => localized(raw, key, locale) || '';

    return (
        <SiteLayout>
            <Head title={`${t('nav.faq', 'FAQ')} — ${company.name}`} />

            <PageHero
                title={L('title') || t('faq.title', 'Frequently asked questions')}
                description={L('description')}
                image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
            />

            <section className="py-20 sm:py-28">
                <div className="site-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
                    <div>
                        <SectionEyebrow>{L('eyebrow') || t('faq.eyebrow', 'FAQ')}</SectionEyebrow>
                        <SectionHeading
                            title={L('title') || t('faq.title', 'Frequently asked questions')}
                            description={L('description')}
                        />
                        <div className="mt-8">
                            <PrimaryButton href="/contact">{t('nav.contact', 'Contact us')}</PrimaryButton>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq) => (
                            <details
                                key={faq.id}
                                className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-sm"
                            >
                                <summary className="cursor-pointer list-none font-semibold text-[#0B1F3A]">
                                    {faq.question}
                                </summary>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
