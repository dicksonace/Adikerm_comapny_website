import { PageHero, PrimaryButton, SecondaryButton, SectionEyebrow } from '@/components/site/ui';
import { localizedModel, useT } from '@/hooks/use-translation';
import SiteLayout from '@/layouts/site/site-layout';
import { formatServicePrice } from '@/lib/money';
import type { ServiceItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Check } from 'lucide-react';

type Props = {
    service: ServiceItem;
    related: ServiceItem[];
};

const fallbackImage = 'https://images.unsplash.com/photo-1498050108023-c8199c77f2e0?auto=format&fit=crop&w=1600&q=80';

export default function ServiceShow({ service, related }: Props) {
    const { company, currency, locale } = usePage<SharedData>().props;
    const { t } = useT();
    const features = service.features || [];
    const name =
        localizedModel(service as unknown as Record<string, unknown>, 'name', locale) || service.name;
    const shortDescription =
        localizedModel(service as unknown as Record<string, unknown>, 'short_description', locale) ||
        service.short_description;
    const description =
        localizedModel(service as unknown as Record<string, unknown>, 'description', locale) ||
        service.description;
    const displayPrice =
        formatServicePrice(service, currency, {
            locale,
            fromLabel: t('common.from', 'From'),
        }) || t('common.custom_quote', 'Custom quote');

    return (
        <SiteLayout>
            <Head title={`${name} — ${company.name}`} />

            <PageHero title={name} description={shortDescription || undefined} image={service.image || fallbackImage} />

            <section className="py-20 sm:py-28">
                <div className="site-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7">
                        <SectionEyebrow>{t('common.service_details', 'Service details')}</SectionEyebrow>
                        <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[#071525] sm:text-4xl">
                            {name}
                        </h2>
                        <div className="mt-6 space-y-4 text-[15px] leading-[1.75] text-slate-600 sm:text-base">
                            {(description || shortDescription || '')
                                .split('\n')
                                .filter(Boolean)
                                .map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                        </div>

                        {features.length > 0 && (
                            <div className="mt-10">
                                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#0F766E] uppercase">
                                    {t('common.whats_included', "What's included")}
                                </p>
                                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                                        >
                                            <span className="mt-0.5 inline-flex text-[#0F766E]">
                                                <Check className="h-4 w-4" />
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-10 flex flex-wrap gap-3">
                            <PrimaryButton href={service.cta_url || `/order?service=${service.slug}`}>
                                {service.cta_text || t('common.get_started', 'Get started')}
                            </PrimaryButton>
                            <SecondaryButton href="/request-quote" dark>
                                {t('nav.request_quote', 'Request a quote')}
                            </SecondaryButton>
                        </div>
                    </div>

                    <aside className="lg:col-span-5">
                        <div className="overflow-hidden rounded-[1.25rem] bg-[#071525] text-white">
                            {service.image && (
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img
                                        src={service.image}
                                        alt={name}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = fallbackImage;
                                        }}
                                    />
                                </div>
                            )}
                            <div className="p-7 sm:p-8">
                                <p className="text-[11px] font-semibold tracking-[0.2em] text-teal-200/90 uppercase">
                                    {t('common.pricing', 'Pricing')}
                                </p>
                                <p className="font-display mt-3 text-3xl font-semibold tracking-tight">
                                    {displayPrice}
                                </p>
                                <p className="mt-3 text-sm leading-relaxed text-white/60">
                                    {t(
                                        'common.not_sure_service_desc',
                                        'Tell us your goals and we will recommend the right starting point.',
                                    )}
                                </p>
                                <div className="mt-8">
                                    <SecondaryButton href={`/order?service=${service.slug}`}>
                                        {t('common.get_started', 'Get started')}
                                    </SecondaryButton>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {related.length > 0 && (
                <section className="border-t border-slate-200 bg-[#EEF1F5] py-20 sm:py-28">
                    <div className="site-wide">
                        <SectionEyebrow>{t('common.related', 'Related')}</SectionEyebrow>
                        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[#071525]">
                            {t('common.other_services', 'Other services')}
                        </h2>
                        <div className="mt-10 grid gap-5 md:grid-cols-3">
                            {related.map((item) => {
                                const itemName =
                                    localizedModel(item as unknown as Record<string, unknown>, 'name', locale) ||
                                    item.name;
                                const itemShort =
                                    localizedModel(
                                        item as unknown as Record<string, unknown>,
                                        'short_description',
                                        locale,
                                    ) || item.short_description;

                                return (
                                    <Link
                                        key={item.id}
                                        href={`/services/${item.slug}`}
                                        className="group overflow-hidden rounded-[1.1rem] border border-slate-200/80 bg-white transition hover:border-teal-700/25"
                                    >
                                        <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                                            <img
                                                src={item.image || fallbackImage}
                                                alt={itemName}
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                                                onError={(e) => {
                                                    e.currentTarget.src = fallbackImage;
                                                }}
                                            />
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-display text-lg font-semibold text-[#071525]">
                                                {itemName}
                                            </h3>
                                            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{itemShort}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </SiteLayout>
    );
}
