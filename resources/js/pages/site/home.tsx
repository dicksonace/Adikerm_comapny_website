import { PrimaryButton, SecondaryButton, SectionEyebrow, SectionHeading, TextLink } from '@/components/site/ui';
import SiteLayout from '@/layouts/site/site-layout';
import type {
    FaqItem,
    ProjectItem,
    ServiceItem,
    SharedData,
    SiteSection,
    StatItem,
    TeamItem,
    TestimonialItem,
    WhyItem,
} from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { formatServicePrice } from '@/lib/money';
import { useAsyncForm } from '@/hooks/use-async-form';
import { localized, localizedModel, useT } from '@/hooks/use-translation';
import {
    Briefcase,
    Code2,
    Globe2,
    Headset,
    Layout,
    Mail,
    MapPin,
    Megaphone,
    Palette,
    Phone,
    Search,
    ShieldCheck,
    Target,
    Users,
    Wallet,
    Zap,
} from 'lucide-react';
import { FormEventHandler, useMemo } from 'react';

type ProcessStepItem = {
    id: number;
    title: string;
    description?: string | null;
    icon?: string | null;
};

type Props = {
    sections: Record<string, SiteSection>;
    services: ServiceItem[];
    projects: ProjectItem[];
    team: TeamItem[];
    testimonials: TestimonialItem[];
    whyChooseUs: WhyItem[];
    statistics: StatItem[];
    processSteps: ProcessStepItem[];
    faqs: FaqItem[];
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    globe: Globe2,
    code: Code2,
    megaphone: Megaphone,
    palette: Palette,
    briefcase: Briefcase,
    layout: Layout,
    users: Users,
    zap: Zap,
    shield: ShieldCheck,
    headset: Headset,
    wallet: Wallet,
    target: Target,
    search: Search,
};

function content(section?: SiteSection) {
    return (section?.content || {}) as Record<string, string | boolean | undefined>;
}

function splitItems(raw?: string | boolean): string[] {
    if (!raw || typeof raw !== 'string') {
        return [];
    }
    return raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

export default function Home({
    sections,
    services,
    projects,
    team,
    testimonials,
    whyChooseUs,
    statistics,
    processSteps,
    faqs,
}: Props) {
    const { company, currency, locale } = usePage<SharedData>().props;
    const { t } = useT();
    const hero = content(sections.hero);
    const about = content(sections.about);
    const servicesSec = content(sections.services);
    const processSec = content(sections.process);
    const whySec = content(sections.why_us);
    const industriesSec = content(sections.industries);
    const portfolioSec = content(sections.portfolio);
    const testimonialsSec = content(sections.testimonials);
    const teamSec = content(sections.team);
    const faqSec = content(sections.faq);
    const contactSec = content(sections.contact);
    const cta = content(sections.cta);
    const industries = splitItems(
        (localized(industriesSec as Record<string, unknown>, 'items', locale) ||
            (industriesSec.items as string | undefined)) as string,
    );

    const L = (data: Record<string, string | boolean | undefined>, key: string) =>
        localized(data as Record<string, unknown>, key, locale) || String(data[key] ?? '');

    const newsletterInitial = useMemo(() => ({ email: '', name: '' }), []);
    const newsletter = useAsyncForm({
        url: route('site.newsletter.store'),
        initial: newsletterInitial,
    });
    const submitNewsletter: FormEventHandler = (e) => {
        void newsletter.submit(e).then((result) => {
            if (result.ok) {
                newsletter.reset();
            }
        });
    };

    return (
        <SiteLayout>
            <Head title={`${company.name} — ${company.tagline || 'Professional Services'}`} />

            <section className="relative isolate flex min-h-[100svh] overflow-hidden bg-[#071525] text-white">
                <img
                    src={String(
                        hero.image ||
                            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
                    )}
                    alt=""
                    className="hero-media absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(7,21,37,0.94)_0%,rgba(7,21,37,0.78)_38%,rgba(7,21,37,0.42)_68%,rgba(7,21,37,0.55)_100%)]" />
                <div className="site-grain pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay" />

                <div className="site-wide relative flex w-full flex-col justify-center pt-28 pb-24 sm:pt-32 sm:pb-28">
                    <div className="max-w-3xl">
                        <p className="reveal font-display text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.9] font-bold tracking-[-0.04em] text-white">
                            {company.name}
                        </p>
                        <div className="accent-line mt-6 mb-7 h-px w-20 bg-[#0F766E] sm:mt-8 sm:mb-8" />
                        <h1 className="reveal reveal-delay-1 font-display max-w-2xl text-[1.65rem] leading-[1.2] font-semibold tracking-[-0.02em] text-white/95 sm:text-3xl md:text-[2.15rem]">
                            {L(hero, 'headline')}
                        </h1>
                        <p className="reveal reveal-delay-2 mt-5 max-w-lg text-[15px] leading-relaxed text-white/65 sm:text-base md:text-[17px]">
                            {L(hero, 'description')}
                        </p>
                        <div className="reveal reveal-delay-3 mt-9 flex flex-wrap gap-3 sm:mt-10">
                            <PrimaryButton href={String(hero.primary_cta_url || '/order')}>
                                {L(hero, 'primary_cta_text') || t('common.get_started', 'Get Started')}
                            </PrimaryButton>
                            <SecondaryButton href={String(hero.secondary_cta_url || '/portfolio')}>
                                {L(hero, 'secondary_cta_text') || t('common.view_portfolio', 'Explore Our Work')}
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            </section>

            {hero.show_stats !== false && statistics.length > 0 && (
                <section className="border-b border-slate-200/80 bg-white">
                    <div className="site-wide grid grid-cols-2 divide-x divide-slate-100 md:grid-cols-4">
                        {statistics.map((stat) => (
                            <div key={stat.id} className="px-5 py-10 sm:px-8 sm:py-12">
                                <p className="font-display text-3xl font-bold tracking-tight text-[#071525] sm:text-4xl">
                                    {stat.value}
                                    <span className="text-[#0F766E]">{stat.suffix}</span>
                                </p>
                                <p className="mt-2 text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {sections.about?.is_enabled && (
                <section className="py-24 sm:py-32">
                    <div className="site-wide grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
                        <div className="lg:col-span-6">
                            <SectionEyebrow>{L(about, 'eyebrow') || 'About'}</SectionEyebrow>
                            <SectionHeading title={L(about, 'title') || 'About us'} />
                            <p className="mt-7 text-[15px] leading-[1.75] text-slate-600 sm:text-base">
                                {L(about, 'who_we_are')}
                            </p>
                            <p className="mt-4 text-[15px] leading-[1.75] text-slate-600 sm:text-base">
                                {L(about, 'story')}
                            </p>

                            <div className="mt-10 space-y-8 border-t border-slate-200 pt-10">
                                <div>
                                    <p className="text-[11px] font-semibold tracking-[0.22em] text-[#0F766E] uppercase">
                                        {t('common.mission', 'Mission')}
                                    </p>
                                    <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{L(about, 'mission')}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold tracking-[0.22em] text-[#0F766E] uppercase">
                                        {t('common.vision', 'Vision')}
                                    </p>
                                    <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{L(about, 'vision')}</p>
                                </div>
                                {(L(about, 'values') || about.values) && (
                                    <div>
                                        <p className="text-[11px] font-semibold tracking-[0.22em] text-[#0F766E] uppercase">
                                            {t('common.values', 'Values')}
                                        </p>
                                        <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{L(about, 'values')}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-10 flex flex-wrap gap-3">
                                <PrimaryButton href="/about">{t('common.about_company', 'About the company')}</PrimaryButton>
                                <SecondaryButton href="/request-quote" dark>
                                    {t('nav.request_quote', 'Request a Quote')}
                                </SecondaryButton>
                            </div>
                        </div>

                        <div className="relative lg:col-span-6">
                            <div className="absolute -top-4 -right-4 hidden h-full w-full rounded-[1.25rem] border border-[#0F766E]/25 lg:block" />
                            <img
                                src={String(
                                    about.image ||
                                        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80',
                                )}
                                alt={`About ${company.name}`}
                                className="relative aspect-[4/5] w-full rounded-[1.25rem] object-cover shadow-[0_40px_80px_-30px_rgba(7,21,37,0.45)] sm:aspect-[5/6]"
                            />
                        </div>
                    </div>
                </section>
            )}

            {sections.services?.is_enabled && (
                <section className="bg-[#071525] py-24 text-white sm:py-32">
                    <div className="site-wide">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <SectionEyebrow light>{L(servicesSec, 'eyebrow') || 'Services'}</SectionEyebrow>
                                <SectionHeading
                                    light
                                    title={L(servicesSec, 'title') || 'Our services'}
                                    description={L(servicesSec, 'description')}
                                />
                            </div>
                            <SecondaryButton href="/services">{t('common.view_all_services', 'View all services')}</SecondaryButton>
                        </div>

                        <div className="mt-14 space-y-5">
                            {services.map((service, index) => {
                                const Icon = iconMap[service.icon || ''] || Globe2;
                                return (
                                    <Link
                                        key={service.id}
                                        href={`/services/${service.slug}`}
                                        className="group grid overflow-hidden rounded-[1.15rem] border border-white/10 bg-white/[0.03] transition duration-300 hover:border-teal-400/30 hover:bg-white/[0.05] lg:grid-cols-12"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden lg:col-span-4 lg:aspect-auto lg:min-h-[220px]">
                                            <img
                                                src={
                                                    service.image ||
                                                    'https://images.unsplash.com/photo-1498050108023-c8199c77f2e0?auto=format&fit=crop&w=1400&q=80'
                                                }
                                                alt={service.name}
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        'https://images.unsplash.com/photo-1498050108023-c8199c77f2e0?auto=format&fit=crop&w=1400&q=80';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#071525]/20 to-transparent" />
                                        </div>
                                        <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-8 lg:px-10">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="font-display text-xs tracking-[0.18em] text-white/35">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <span className="inline-flex rounded-md bg-teal-500/15 p-2 text-teal-200">
                                                    <Icon className="h-4 w-4" />
                                                </span>
                                            </div>
                                            <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight transition group-hover:text-teal-200 sm:text-3xl">
                                                {localizedModel(service as unknown as Record<string, unknown>, 'name', locale) ||
                                                    service.name}
                                            </h3>
                                            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
                                                {localizedModel(
                                                    service as unknown as Record<string, unknown>,
                                                    'short_description',
                                                    locale,
                                                ) || service.short_description}
                                            </p>
                                            <div className="mt-6 flex flex-wrap items-center gap-4">
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
                                                <span className="text-sm text-white/45 transition group-hover:translate-x-1 group-hover:text-white">
                                                    {t('common.learn_more', 'Learn more')} →
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {sections.process?.is_enabled && processSteps.length > 0 && (
                <section className="py-24 sm:py-32">
                    <div className="site-wide">
                        <SectionEyebrow>{L(processSec, 'eyebrow') || 'Our process'}</SectionEyebrow>
                        <SectionHeading
                            title={L(processSec, 'title') || 'How we work'}
                            description={L(processSec, 'description')}
                        />
                        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {processSteps.map((step, index) => {
                                const Icon = iconMap[step.icon || ''] || Search;
                                return (
                                    <div key={step.id} className="relative border-t border-slate-200 pt-6">
                                        <p className="font-display text-sm text-[#0F766E]">
                                            {String(index + 1).padStart(2, '0')}
                                        </p>
                                        <div className="mt-4 inline-flex text-[#071525]">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-display mt-4 text-xl font-semibold tracking-tight text-[#071525]">
                                            {step.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {sections.why_us?.is_enabled && (
                <section className="bg-[#EEF1F5] py-24 sm:py-32">
                    <div className="site-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
                        <div className="lg:col-span-4">
                            <SectionEyebrow>{L(whySec, 'eyebrow') || 'Why us'}</SectionEyebrow>
                            <SectionHeading
                                title={L(whySec, 'title') || 'Why choose us'}
                                description={L(whySec, 'description')}
                            />
                        </div>
                        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-8">
                            {whyChooseUs.map((item, index) => {
                                const Icon = iconMap[item.icon || ''] || ShieldCheck;
                                return (
                                    <div key={item.id}>
                                        <div className="mb-4 flex items-center gap-3">
                                            <span className="font-display text-xs text-slate-400">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className="inline-flex text-[#0F766E]">
                                                <Icon className="h-5 w-5" />
                                            </span>
                                        </div>
                                        <h3 className="font-display text-lg font-semibold tracking-tight text-[#071525]">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {sections.industries?.is_enabled && industries.length > 0 && (
                <section className="py-24 sm:py-32">
                    <div className="site-wide">
                        <SectionEyebrow>{L(industriesSec, 'eyebrow') || 'Who we serve'}</SectionEyebrow>
                        <SectionHeading
                            title={L(industriesSec, 'title') || 'Industries'}
                            description={L(industriesSec, 'description')}
                        />
                        <div className="mt-12 flex flex-wrap gap-3">
                            {industries.map((item) => (
                                <span
                                    key={item}
                                    className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#071525]"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {sections.portfolio?.is_enabled && (
                <section className="bg-[#EEF1F5] py-24 sm:py-32">
                    <div className="site-wide">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <SectionEyebrow>{L(portfolioSec, 'eyebrow') || 'Portfolio'}</SectionEyebrow>
                                <SectionHeading
                                    title={L(portfolioSec, 'title') || 'Selected work'}
                                    description={L(portfolioSec, 'description')}
                                />
                            </div>
                            <TextLink href="/portfolio">{t('common.view_portfolio', 'View full portfolio')}</TextLink>
                        </div>

                        <div className="mt-14 grid gap-5 md:grid-cols-2">
                            {projects.map((project, index) => (
                                <Link
                                    key={project.id}
                                    href={`/portfolio/${project.slug}`}
                                    className={`group relative overflow-hidden rounded-[1.25rem] bg-[#071525] ${
                                        index === 0 ? 'md:row-span-2' : ''
                                    }`}
                                >
                                    <div className={`overflow-hidden ${index === 0 ? 'aspect-[4/5] md:h-full' : 'aspect-[16/11]'}`}>
                                        <img
                                            src={project.cover_image || ''}
                                            alt={project.title}
                                            className="h-full w-full object-cover transition duration-[1.1s] ease-out group-hover:scale-[1.04]"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#071525] via-[#071525]/20 to-transparent" />
                                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                                        <p className="text-[11px] font-semibold tracking-[0.2em] text-teal-200/90 uppercase">
                                            {project.category}
                                        </p>
                                        <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                            {project.title}
                                        </h3>
                                        <p className="mt-2 line-clamp-2 max-w-md text-sm text-white/60">{project.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {sections.testimonials?.is_enabled && testimonials.length > 0 && (
                <section className="py-24 sm:py-32">
                    <div className="site-wide">
                        <SectionEyebrow>{L(testimonialsSec, 'eyebrow') || 'Testimonials'}</SectionEyebrow>
                        <SectionHeading title={L(testimonialsSec, 'title') || 'What clients say'} />
                        <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-8">
                            {testimonials.map((item) => (
                                <article key={item.id} className="border-t border-slate-200 pt-8">
                                    <p className="font-display text-4xl leading-none text-[#0F766E]/40">“</p>
                                    <p className="mt-3 text-[15px] leading-[1.7] text-slate-700">{item.content}</p>
                                    <div className="mt-8 flex items-center gap-3">
                                        {item.customer_image && (
                                            <img
                                                src={item.customer_image}
                                                alt={item.customer_name}
                                                className="h-11 w-11 rounded-full object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-[#071525]">{item.customer_name}</p>
                                            <p className="text-xs text-slate-500">
                                                {item.position}
                                                {item.company ? ` · ${item.company}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {sections.team?.is_enabled && (
                <section className="bg-[#071525] py-24 text-white sm:py-32">
                    <div className="site-wide">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <SectionEyebrow light>{L(teamSec, 'eyebrow') || 'Team'}</SectionEyebrow>
                                <SectionHeading
                                    light
                                    title={L(teamSec, 'title') || 'Our team'}
                                    description={L(teamSec, 'description')}
                                />
                            </div>
                            <SecondaryButton href="/team">{t('common.meet_team', 'Meet the team')}</SecondaryButton>
                        </div>
                        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {team.map((member) => (
                                <div key={member.id} className="group">
                                    <div className="aspect-[4/5] overflow-hidden rounded-[1rem] bg-white/5">
                                        <img
                                            src={member.photo || ''}
                                            alt={member.name}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <p className="font-display text-lg font-semibold tracking-tight">{member.name}</p>
                                        <p className="mt-1 text-sm text-teal-200/85">{member.position}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {sections.faq?.is_enabled && (
                <section className="py-24 sm:py-32">
                    <div className="site-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
                        <div className="lg:col-span-4">
                            <SectionEyebrow>{L(faqSec, 'eyebrow') || 'FAQ'}</SectionEyebrow>
                            <SectionHeading title={L(faqSec, 'title') || 'Frequently asked questions'} />
                            <div className="mt-8">
                                <PrimaryButton href="/faq">{t('common.view_faqs', 'View all FAQs')}</PrimaryButton>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-200 border-y border-slate-200 lg:col-span-8">
                            {faqs.map((faq) => (
                                <details key={faq.id} className="group py-5">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#071525]">
                                        <span className="text-[15px] sm:text-base">{faq.question}</span>
                                        <span className="text-lg text-slate-400 transition group-open:rotate-45">+</span>
                                    </summary>
                                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {sections.contact?.is_enabled && (
                <section className="border-y border-slate-200 bg-white py-24 sm:py-28">
                    <div className="site-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
                        <div className="lg:col-span-5">
                            <SectionEyebrow>{L(contactSec, 'eyebrow') || 'Contact'}</SectionEyebrow>
                            <SectionHeading
                                title={L(contactSec, 'title') || 'Get in touch'}
                                description={L(contactSec, 'description')}
                            />
                            <div className="mt-10 space-y-5">
                                {company.address && (
                                    <div className="flex gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" />
                                        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                                            {company.address}
                                        </p>
                                    </div>
                                )}
                                {company.phone && (
                                    <div className="flex gap-3">
                                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" />
                                        <p className="text-sm text-slate-700">{company.phone}</p>
                                    </div>
                                )}
                                {company.email && (
                                    <div className="flex gap-3">
                                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" />
                                        <p className="text-sm text-slate-700">{company.email}</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <PrimaryButton href="/contact">{t('common.open_contact', 'Open contact form')}</PrimaryButton>
                                <SecondaryButton href="/order" dark>
                                    Place an order
                                </SecondaryButton>
                            </div>
                        </div>
                        <div className="rounded-[1.25rem] bg-[#071525] p-8 text-white lg:col-span-7 lg:p-10">
                            <h3 className="font-display text-2xl font-semibold tracking-tight">{t('common.stay_updated', 'Stay updated')}</h3>
                            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
                                {t('common.newsletter_blurb', 'Subscribe for company news, project updates, and service announcements. You can unsubscribe anytime.')}
                            </p>
                            <form onSubmit={submitNewsletter} className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="email"
                                    required
                                    placeholder={t('common.your_email', 'Your email')}
                                    value={String(newsletter.data.email)}
                                    onChange={(e) => newsletter.setData('email', e.target.value)}
                                    className="w-full flex-1 rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-teal-400"
                                />
                                <button
                                    type="submit"
                                    disabled={newsletter.processing}
                                    className="rounded-md bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5f59] disabled:opacity-60"
                                >
                                    {newsletter.processing ? '…' : t('common.subscribe', 'Subscribe')}
                                </button>
                            </form>
                            {newsletter.success && (
                                <p className="mt-3 text-sm text-teal-200">{newsletter.success}</p>
                            )}
                            {(newsletter.errors.form || newsletter.errors.email) && (
                                <p className="mt-3 text-sm text-red-300">
                                    {newsletter.errors.form || newsletter.errors.email}
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {sections.cta?.is_enabled && (
                <section className="relative isolate overflow-hidden py-28 text-white sm:py-32">
                    <img
                        src={String(
                            cta.image ||
                                'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1800&q=80',
                        )}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#071525]/88" />
                    <div className="site-grain pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" />
                    <div className="site-wide relative max-w-3xl text-center lg:mx-auto">
                        <div className="mx-auto mb-6 h-px w-16 bg-[#0F766E]" />
                        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                            {L(cta, 'title')}
                        </h2>
                        <p className="mx-auto mt-5 max-w-xl text-base text-white/65">{L(cta, 'description')}</p>
                        <div className="mt-10 flex flex-wrap justify-center gap-3">
                            <PrimaryButton href={String(cta.primary_cta_url || '/request-quote')}>
                                {L(cta, 'primary_cta_text') || t('nav.request_quote', 'Request a Quote')}
                            </PrimaryButton>
                            <SecondaryButton href={String(cta.secondary_cta_url || '/contact')}>
                                {L(cta, 'secondary_cta_text') || t('nav.contact', 'Contact Us')}
                            </SecondaryButton>
                        </div>
                    </div>
                </section>
            )}
        </SiteLayout>
    );
}
