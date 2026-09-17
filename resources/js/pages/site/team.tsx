import { PageHero, PrimaryButton, SectionEyebrow } from '@/components/site/ui';
import { localized, useT } from '@/hooks/use-translation';
import SiteLayout from '@/layouts/site/site-layout';
import type { SharedData, SiteSection, TeamItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

type Props = {
    section: SiteSection | null;
    team: TeamItem[];
};

export default function Team({ section, team }: Props) {
    const { company, locale } = usePage<SharedData>().props;
    const { t } = useT();
    const raw = (section?.content || {}) as Record<string, unknown>;
    const L = (key: string) => localized(raw, key, locale) || '';

    return (
        <SiteLayout>
            <Head title={`${t('nav.team', 'Team')} — ${company.name}`} />

            <PageHero
                title={L('title') || t('team.title', 'Our team')}
                description={L('description')}
                image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
            />

            <section className="py-20 sm:py-28">
                <div className="site-container">
                    <SectionEyebrow>{L('eyebrow') || t('team.eyebrow', 'Team')}</SectionEyebrow>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {team.map((member) => (
                            <article
                                key={member.id}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5"
                            >
                                <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                                    <img
                                        src={
                                            member.photo ||
                                            'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'
                                        }
                                        alt={member.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="p-5">
                                    <h2 className="font-display text-lg font-semibold text-[#0B1F3A]">{member.name}</h2>
                                    <p className="text-sm text-[#0F766E]">{member.position}</p>
                                    {member.department && (
                                        <p className="mt-1 text-xs tracking-wide text-slate-400 uppercase">
                                            {member.department}
                                        </p>
                                    )}
                                    {member.bio && (
                                        <p className="mt-3 text-sm leading-relaxed text-slate-600">{member.bio}</p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                    <div className="mt-12">
                        <PrimaryButton href="/contact">{t('nav.contact', 'Contact us')}</PrimaryButton>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
