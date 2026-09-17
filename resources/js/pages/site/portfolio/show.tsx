import { PageHero, PrimaryButton, SectionEyebrow } from '@/components/site/ui';
import SiteLayout from '@/layouts/site/site-layout';
import type { ProjectItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';

type Props = {
    project: ProjectItem;
};

export default function PortfolioShow({ project }: Props) {
    const { company } = usePage<SharedData>().props;
    const technologies = project.technologies || [];

    return (
        <SiteLayout>
            <Head title={`${project.title} — ${company.name}`} />

            <PageHero
                title={project.title}
                description={project.category || undefined}
                image={
                    project.cover_image ||
                    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=80'
                }
            />

            <section className="py-20 sm:py-28">
                <div className="site-container grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
                    <div>
                        <SectionEyebrow>{project.category || 'Project'}</SectionEyebrow>
                        <h2 className="font-display mt-3 text-3xl font-semibold text-[#0B1F3A] sm:text-4xl">{project.title}</h2>
                        <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                            {(project.description || '')
                                .split('\n')
                                .filter(Boolean)
                                .map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                        </div>

                        {technologies.length > 0 && (
                            <div className="mt-10">
                                <p className="text-xs font-semibold tracking-[0.18em] text-[#0F766E] uppercase">Technologies</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-10 flex flex-wrap gap-3">
                            <PrimaryButton href="/request-quote">Start a similar project</PrimaryButton>
                            {project.project_url && (
                                <a
                                    href={project.project_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-[#0B1F3A] transition hover:bg-slate-50"
                                >
                                    Visit project
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="overflow-hidden rounded-2xl">
                            <img
                                src={
                                    project.cover_image ||
                                    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80'
                                }
                                alt={project.title}
                                className="aspect-[4/3] w-full object-cover"
                            />
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-6">
                            <dl className="space-y-4 text-sm">
                                {project.client && (
                                    <div>
                                        <dt className="text-xs tracking-[0.16em] text-slate-400 uppercase">Client</dt>
                                        <dd className="mt-1 font-medium text-[#0B1F3A]">{project.client}</dd>
                                    </div>
                                )}
                                {project.category && (
                                    <div>
                                        <dt className="text-xs tracking-[0.16em] text-slate-400 uppercase">Category</dt>
                                        <dd className="mt-1 font-medium text-[#0B1F3A]">{project.category}</dd>
                                    </div>
                                )}
                                {project.completed_at && (
                                    <div>
                                        <dt className="text-xs tracking-[0.16em] text-slate-400 uppercase">Completed</dt>
                                        <dd className="mt-1 font-medium text-[#0B1F3A]">{project.completed_at}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </aside>
                </div>
            </section>
        </SiteLayout>
    );
}
