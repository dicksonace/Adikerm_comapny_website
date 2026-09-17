import { PageHero, SectionEyebrow } from '@/components/site/ui';
import { localized, useT } from '@/hooks/use-translation';
import SiteLayout from '@/layouts/site/site-layout';
import type { ProjectItem, SharedData, SiteSection } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

type Props = {
    section: SiteSection | null;
    projects: ProjectItem[];
};

export default function PortfolioIndex({ section, projects }: Props) {
    const { company, locale } = usePage<SharedData>().props;
    const { t } = useT();
    const raw = (section?.content || {}) as Record<string, unknown>;
    const L = (key: string) => localized(raw, key, locale) || '';

    return (
        <SiteLayout>
            <Head title={`${t('nav.portfolio', 'Portfolio')} — ${company.name}`} />

            <PageHero
                title={L('title') || t('portfolio.title', 'Selected work')}
                description={L('description')}
                image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
            />

            <section className="py-20 sm:py-28">
                <div className="site-container">
                    <SectionEyebrow>{L('eyebrow') || t('portfolio.eyebrow', 'Portfolio')}</SectionEyebrow>
                    <div className="mt-12 grid gap-6 md:grid-cols-2">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/portfolio/${project.slug}`}
                                className="group overflow-hidden rounded-2xl bg-[#0B1F3A] text-white"
                            >
                                <div className="aspect-[16/11] overflow-hidden">
                                    <img
                                        src={
                                            project.cover_image ||
                                            'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1400&q=80'
                                        }
                                        alt={project.title}
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <p className="text-xs tracking-[0.16em] text-teal-200 uppercase">
                                        {project.category}
                                    </p>
                                    <h2 className="font-display mt-2 text-2xl font-semibold">{project.title}</h2>
                                    <p className="mt-2 line-clamp-2 text-sm text-white/65">{project.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
