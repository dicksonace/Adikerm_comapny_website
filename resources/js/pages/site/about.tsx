import { PrimaryButton, PageHero, SectionEyebrow, SectionHeading } from '@/components/site/ui';
import { localized, useT } from '@/hooks/use-translation';
import SiteLayout from '@/layouts/site/site-layout';
import type { SharedData, SiteSection, TeamItem, WhyItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Briefcase, Headset, ShieldCheck, Target, Users, Wallet, Zap } from 'lucide-react';

type Props = {
    section: SiteSection | null;
    team: TeamItem[];
    whyChooseUs: WhyItem[];
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    users: Users,
    zap: Zap,
    shield: ShieldCheck,
    headset: Headset,
    wallet: Wallet,
    target: Target,
    briefcase: Briefcase,
};

export default function About({ section, team, whyChooseUs }: Props) {
    const { company, locale } = usePage<SharedData>().props;
    const { t } = useT();
    const raw = (section?.content || {}) as Record<string, unknown>;
    const L = (key: string) => localized(raw, key, locale) || '';

    return (
        <SiteLayout>
            <Head title={`${t('nav.about', 'About')} — ${company.name}`} />

            <PageHero
                title={L('title') || 'About us'}
                description={L('who_we_are') || company.tagline}
                image={
                    String(raw.image || '') ||
                    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80'
                }
            />

            <section className="py-20 sm:py-28">
                <div className="site-container grid items-center gap-12 lg:grid-cols-2">
                    <div>
                        <SectionEyebrow>{L('eyebrow') || 'About'}</SectionEyebrow>
                        <SectionHeading title={L('title') || 'About us'} />
                        <p className="mt-6 text-base leading-relaxed text-slate-600">{L('who_we_are')}</p>
                        <p className="mt-4 text-base leading-relaxed text-slate-600">{L('story')}</p>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-[#0B1F3A] p-5 text-white">
                                <p className="text-xs tracking-[0.18em] text-teal-200 uppercase">
                                    {t('common.mission', 'Mission')}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-white/85">{L('mission')}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-100 p-5">
                                <p className="text-xs tracking-[0.18em] text-[#0F766E] uppercase">
                                    {t('common.vision', 'Vision')}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-slate-700">{L('vision')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-teal-700/20 to-transparent" />
                        <img
                            src={
                                String(raw.image || '') ||
                                'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80'
                            }
                            alt={company.name}
                            className="relative aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-2xl shadow-slate-900/15"
                        />
                    </div>
                </div>
            </section>

            {whyChooseUs.length > 0 && (
                <section className="bg-slate-100/70 py-20 sm:py-28">
                    <div className="site-container">
                        <SectionEyebrow>Why us</SectionEyebrow>
                        <SectionHeading title="What sets our work apart" />
                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {whyChooseUs.map((item) => {
                                const Icon = iconMap[item.icon || ''] || ShieldCheck;
                                return (
                                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
                                        <div className="inline-flex rounded-xl bg-teal-50 p-3 text-[#0F766E]">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-display mt-4 text-lg font-semibold text-[#0B1F3A]">{item.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {team.length > 0 && (
                <section className="bg-[#0B1F3A] py-20 text-white sm:py-28">
                    <div className="site-container">
                        <SectionEyebrow>{t('nav.team', 'Team')}</SectionEyebrow>
                        <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">The people behind the work</h2>
                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {team.map((member) => (
                                <div key={member.id} className="overflow-hidden rounded-2xl bg-white/5">
                                    <div className="aspect-[4/5] overflow-hidden">
                                        <img src={member.photo || ''} alt={member.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="p-4">
                                        <p className="font-display text-lg font-semibold">{member.name}</p>
                                        <p className="text-sm text-teal-200">{member.position}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10">
                            <PrimaryButton href="/team">{t('common.meet_team', 'Meet the full team')}</PrimaryButton>
                        </div>
                    </div>
                </section>
            )}
        </SiteLayout>
    );
}
