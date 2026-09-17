import { PrimaryButton, SecondaryButton, SectionEyebrow, SectionHeading } from '@/components/site/ui';
import SiteLayout from '@/layouts/site/site-layout';
import { formatServicePrice } from '@/lib/money';
import { localized, localizedModel, useT } from '@/hooks/use-translation';
import type { ServiceItem, SharedData, SiteSection } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, Briefcase, Code2, Globe2, Layout, Megaphone, Palette } from 'lucide-react';

type Props = {
    section: SiteSection | null;
    services: ServiceItem[];
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    globe: Globe2,
    code: Code2,
    megaphone: Megaphone,
    palette: Palette,
    briefcase: Briefcase,
    layout: Layout,
};

const fallbackImage = 'https://images.unsplash.com/photo-1498050108023-c8199c77f2e0?auto=format&fit=crop&w=1400&q=80';

export default function ServicesIndex({ section, services }: Props) {
    const { company, currency, locale } = usePage<SharedData>().props;
    const { t } = useT();
    const c = (section?.content || {}) as Record<string, unknown>;
    const title = localized(c, 'title', locale) || 'Our services';
    const description = localized(c, 'description', locale);
    const eyebrow = localized(c, 'eyebrow', locale) || 'What we do';

    return (
        <SiteLayout>
            <Head title={`Services — ${company.name}`} />

            <section className="relative isolate overflow-hidden bg-[#071525] pt-28 pb-20 text-white sm:pt-36 sm:pb-24">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(15,118,110,0.22),transparent_55%)]" />
                <div className="site-wide relative">
                    <div className="accent-line mb-6 h-px w-16 bg-[#0F766E]" />
                    <p className="text-[11px] font-semibold tracking-[0.28em] text-teal-200/90 uppercase">
                        {eyebrow}
                    </p>
                    <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                        {title}
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
                        {description ||
                            'Choose a service, share your requirements, and we will guide you from brief to delivery.'}
                    </p>
                </div>
            </section>

            <section className="bg-[#071525] pb-8 text-white">
                <div className="site-wide">
                    <div className="divide-y divide-white/10 border-y border-white/10">
                        {services.map((service, index) => {
                            const Icon = iconMap[service.icon || ''] || Globe2;
                            const reverse = index % 2 === 1;

                            return (
                                <Link
                                    key={service.id}
                                    href={`/services/${service.slug}`}
                                    className="group grid items-center gap-8 py-10 transition hover:bg-white/[0.025] lg:grid-cols-12 lg:gap-12 lg:py-14"
                                >
                                    <div
                                        className={`overflow-hidden rounded-[1.1rem] lg:col-span-5 ${
                                            reverse ? 'lg:order-2' : ''
                                        }`}
                                    >
                                        <div className="aspect-[16/11] overflow-hidden bg-[#0d243f]">
                                            <img
                                                src={service.image || fallbackImage}
                                                alt={service.name}
                                                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.src = fallbackImage;
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className={`lg:col-span-7 ${reverse ? 'lg:order-1' : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="font-display text-sm text-white/30">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className="inline-flex rounded-md bg-teal-500/15 p-2 text-teal-200">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                        </div>
                                        <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight transition group-hover:text-teal-200 sm:text-4xl">
                                            {localizedModel(service as unknown as Record<string, unknown>, 'name', locale) ||
                                                service.name}
                                        </h2>
                                        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/60">
                                            {localizedModel(
                                                service as unknown as Record<string, unknown>,
                                                'short_description',
                                                locale,
                                            ) || service.short_description}
                                        </p>
                                        {service.features && service.features.length > 0 && (
                                            <ul className="mt-5 flex flex-wrap gap-2">
                                                {service.features.slice(0, 4).map((feature) => (
                                                    <li
                                                        key={feature}
                                                        className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/55"
                                                    >
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <div className="mt-7 flex flex-wrap items-center gap-4">
                                            {formatServicePrice(service, currency, {
                                                locale,
                                                fromLabel: t('common.from', 'From'),
                                            }) && (
                                                <span className="text-sm font-semibold text-teal-200">
                                                    {formatServicePrice(service, currency, {
                                                        locale,
                                                        fromLabel: t('common.from', 'From'),
                                                    })}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition group-hover:text-white">
                                                {t('common.view_service', 'View service')}
                                                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-[#F7F8FA] py-20 sm:py-24">
                <div className="site-wide flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <SectionEyebrow>{t('common.next_step', 'Next step')}</SectionEyebrow>
                        <SectionHeading
                            title={t('common.not_sure_service', 'Not sure which service fits?')}
                            description={t(
                                'common.not_sure_service_desc',
                                'Tell us your goals and we will recommend the right starting point.',
                            )}
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <PrimaryButton href="/request-quote">{t('nav.request_quote', 'Request a quote')}</PrimaryButton>
                        <SecondaryButton href="/order" dark>
                            {t('nav.place_order', 'Place an order')}
                        </SecondaryButton>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
