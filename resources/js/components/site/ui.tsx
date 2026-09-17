import { Link } from '@inertiajs/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PropsWithChildren } from 'react';

export function SectionEyebrow({ children, light = false }: PropsWithChildren<{ light?: boolean }>) {
    return (
        <div className="flex items-center gap-3">
            <span className={`h-px w-8 ${light ? 'bg-teal-300/80' : 'bg-[#0F766E]'}`} />
            <p
                className={`text-[11px] font-semibold tracking-[0.28em] uppercase ${
                    light ? 'text-teal-200/90' : 'text-[#0F766E]'
                }`}
            >
                {children}
            </p>
        </div>
    );
}

export function SectionHeading({
    title,
    description,
    light = false,
}: {
    title: string;
    description?: string;
    light?: boolean;
}) {
    return (
        <div className="max-w-2xl">
            <h2
                className={`font-display mt-4 text-[2rem] leading-[1.15] font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] ${
                    light ? 'text-white' : 'text-[#071525]'
                }`}
            >
                {title}
            </h2>
            {description && (
                <p className={`mt-5 max-w-xl text-[15px] leading-relaxed sm:text-base ${light ? 'text-white/65' : 'text-slate-600'}`}>
                    {description}
                </p>
            )}
        </div>
    );
}

export function PrimaryButton({ href, children }: PropsWithChildren<{ href: string }>) {
    return (
        <Link
            href={href}
            className="group inline-flex items-center gap-2.5 rounded-md bg-[#0F766E] px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition duration-300 hover:bg-[#0b5f59]"
        >
            {children}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
    );
}

export function SecondaryButton({
    href,
    children,
    dark = false,
}: PropsWithChildren<{ href: string; dark?: boolean }>) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-semibold tracking-wide transition duration-300 ${
                dark
                    ? 'border border-slate-300 bg-white text-[#071525] hover:border-slate-400'
                    : 'border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-white/45 hover:bg-white/10'
            }`}
        >
            {children}
        </Link>
    );
}

export function TextLink({ href, children }: PropsWithChildren<{ href: string }>) {
    return (
        <Link
            href={href}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] transition hover:text-[#0b5f59]"
        >
            {children}
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
    );
}

export function PageHero({
    title,
    description,
    image,
}: {
    title: string;
    description?: string;
    image?: string;
}) {
    return (
        <section className="relative isolate min-h-[48vh] overflow-hidden bg-[#071525] pt-28 pb-20 text-white sm:min-h-[52vh] sm:pt-36 sm:pb-24">
            {image && (
                <img src={image} alt="" className="hero-media absolute inset-0 h-full w-full object-cover opacity-40" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,21,37,0.94)_0%,rgba(7,21,37,0.72)_55%,rgba(7,21,37,0.45)_100%)]" />
            <div className="site-grain pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" />
            <div className="site-container relative">
                <div className="accent-line mb-6 h-px w-16 bg-[#0F766E]" />
                <h1 className="font-display max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                    {title}
                </h1>
                {description && (
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{description}</p>
                )}
            </div>
        </section>
    );
}
