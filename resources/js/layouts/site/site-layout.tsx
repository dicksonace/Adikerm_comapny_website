import { csrfToken } from '@/lib/http';
import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useT } from '@/hooks/use-translation';

export default function SiteLayout({ children }: PropsWithChildren) {
    const { company, navigation, flash, theme, locale } = usePage<SharedData>().props;
    const { t } = useT();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [switchingLocale, setSwitchingLocale] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty('--brand-navy', theme.primary);
        document.documentElement.style.setProperty('--brand-teal', theme.accent);
        document.documentElement.style.setProperty('--brand-slate', theme.secondary);
        document.documentElement.lang = locale || 'en';
    }, [theme, locale]);

    const year = new Date().getFullYear();

    const switchLocale = async (next: 'en' | 'de') => {
        if (next === locale || switchingLocale) {
            return;
        }
        setSwitchingLocale(true);
        try {
            // One JSON request to set session/cookie — avoids Inertia visit + redirect bounce.
            await fetch(route('locale.switch', next), {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': csrfToken(),
                },
            });
            // Single soft reload so translations + nav update once.
            router.reload({ preserveScroll: true });
        } finally {
            setSwitchingLocale(false);
        }
    };

    const LanguageSwitch = ({ mobile = false }: { mobile?: boolean }) => (
        <div
            className={`inline-flex items-center rounded-md border border-white/20 bg-white/5 p-0.5 text-xs font-semibold ${
                mobile ? 'w-full justify-center' : ''
            }`}
            role="group"
            aria-label={t('lang.label', 'Language')}
        >
            <button
                type="button"
                disabled={switchingLocale}
                onClick={() => void switchLocale('en')}
                className={`rounded px-2.5 py-1.5 transition disabled:opacity-60 ${
                    locale === 'en' ? 'bg-white text-[#071525]' : 'text-white/70 hover:text-white'
                }`}
            >
                {t('lang.en', 'EN')}
            </button>
            <button
                type="button"
                disabled={switchingLocale}
                onClick={() => void switchLocale('de')}
                className={`rounded px-2.5 py-1.5 transition disabled:opacity-60 ${
                    locale === 'de' ? 'bg-white text-[#071525]' : 'text-white/70 hover:text-white'
                }`}
            >
                {t('lang.de', 'DE')}
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F7F8FA] text-[#0F172A]">
            {flash?.success && (
                <div className="fixed top-5 right-5 z-[60] max-w-sm rounded-md bg-[#0F766E] px-4 py-3 text-sm text-white shadow-xl shadow-teal-900/20">
                    {flash.success}
                </div>
            )}

            <header
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
                    scrolled
                        ? 'border-b border-white/[0.08] bg-[#071525]/90 shadow-[0_10px_40px_rgba(7,21,37,0.25)] backdrop-blur-xl'
                        : 'bg-transparent'
                }`}
            >
                <div className="site-wide flex h-[4.25rem] items-center justify-between sm:h-20">
                    <Link href="/" className="group flex items-center gap-3">
                        {company.logo ? (
                            <img src={company.logo} alt={company.name} className="h-9 w-auto object-contain" />
                        ) : (
                            <span className="font-display text-[1.65rem] leading-none font-bold tracking-[-0.03em] text-white sm:text-[1.85rem]">
                                {company.name}
                            </span>
                        )}
                    </Link>

                    <nav className="hidden items-center gap-1 xl:flex">
                        {navigation.header.map((item) => (
                            <Link
                                key={item.id}
                                href={item.url || '/'}
                                className="px-3 py-2 text-[13px] font-medium tracking-wide text-white/70 transition hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="ml-2">
                            <LanguageSwitch />
                        </div>
                        <Link
                            href="/request-quote"
                            className="ml-3 rounded-md bg-[#0F766E] px-4 py-2.5 text-[13px] font-semibold tracking-wide text-white transition hover:bg-[#0b5f59]"
                        >
                            {t('nav.request_quote', 'Request a Quote')}
                        </Link>
                    </nav>

                    <button
                        type="button"
                        className="rounded-md p-2 text-white xl:hidden"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {open && (
                    <div className="border-t border-white/10 bg-[#071525]/98 px-5 py-5 backdrop-blur-xl xl:hidden">
                        <div className="flex flex-col gap-1">
                            {navigation.header.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.url || '/'}
                                    className="rounded-md px-3 py-3 text-base text-white/90 hover:bg-white/5"
                                    onClick={() => setOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="mt-3 px-1">
                                <LanguageSwitch mobile />
                            </div>
                            <Link
                                href="/request-quote"
                                className="mt-3 rounded-md bg-[#0F766E] px-4 py-3.5 text-center font-semibold text-white"
                                onClick={() => setOpen(false)}
                            >
                                {t('nav.request_quote', 'Request a Quote')}
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            <main>{children}</main>

            <footer className="relative overflow-hidden bg-[#071525] text-white">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(15,118,110,0.18),transparent_50%)]" />
                <div className="site-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />
                <div className="site-wide relative grid gap-12 border-b border-white/10 py-16 md:grid-cols-12 md:gap-8 lg:py-20">
                    <div className="md:col-span-5">
                        <p className="font-display text-3xl font-bold tracking-[-0.03em]">{company.name}</p>
                        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/60">{company.tagline}</p>
                        <p className="mt-8 whitespace-pre-line text-sm leading-relaxed text-white/45">{company.address}</p>
                    </div>
                    <div className="md:col-span-3 md:col-start-7">
                        <p className="text-[11px] font-semibold tracking-[0.22em] text-white/40 uppercase">
                            {t('nav.navigate', 'Navigate')}
                        </p>
                        <div className="mt-5 flex flex-col gap-3">
                            {navigation.header.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.url || '/'}
                                    className="text-sm text-white/70 transition hover:text-white"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <p className="text-[11px] font-semibold tracking-[0.22em] text-white/40 uppercase">
                            {t('nav.contact', 'Contact')}
                        </p>
                        <div className="mt-5 space-y-3 text-sm text-white/70">
                            {company.phone && <p>{company.phone}</p>}
                            {company.email && <p>{company.email}</p>}
                            {company.business_hours && <p className="text-white/45">{company.business_hours}</p>}
                        </div>
                        <Link
                            href="/order"
                            className="mt-8 inline-flex rounded-md border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/35 hover:bg-white/5"
                        >
                            {t('nav.place_order', 'Place an Order')}
                        </Link>
                    </div>
                </div>
                <div className="site-wide flex flex-col gap-2 py-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {year} {company.name}. {t('footer.rights', 'All rights reserved.')}
                    </p>
                    <p>{t('footer.location', 'Kalutara, Sri Lanka')}</p>
                </div>
            </footer>
        </div>
    );
}
