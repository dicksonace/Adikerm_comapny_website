import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type CompanyInfo, type CurrencySettings, type ThemeSettings } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Company Settings', href: route('admin.settings.edit') },
];

type SettingsMap = Record<string, string | null | undefined>;

type CurrencyOption = { code: string; label: string; symbol: string };

export default function CompanySettings({
    settings,
    company,
    theme,
    currency,
    currencyOptions,
}: {
    settings: SettingsMap;
    company: CompanyInfo;
    theme: ThemeSettings;
    currency: CurrencySettings;
    currencyOptions: CurrencyOption[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        company_name: company.name || '',
        company_tagline: company.tagline || '',
        company_email: company.email || '',
        company_phone: company.phone || '',
        company_whatsapp: company.whatsapp || '',
        company_address: company.address || '',
        company_address_line: company.address_line || '',
        business_hours: company.business_hours || '',
        footer_description: settings.footer_description || '',
        footer_copyright: settings.footer_copyright || '',
        social_facebook: company.social?.facebook || '',
        social_instagram: company.social?.instagram || '',
        social_linkedin: company.social?.linkedin || '',
        social_x: company.social?.x || '',
        social_youtube: company.social?.youtube || '',
        social_tiktok: company.social?.tiktok || '',
        theme_primary: theme.primary || '',
        theme_secondary: theme.secondary || '',
        theme_accent: theme.accent || '',
        theme_background: theme.background || '',
        theme_text: theme.text || '',
        currency_code: currency.code || 'USD',
        currency_symbol: currency.symbol || '$',
        currency_position: currency.position || 'before',
        logo: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), { forceFormData: true });
    };

    const onCurrencyChange = (code: string) => {
        const option = currencyOptions.find((o) => o.code === code);
        setData((prev) => ({
            ...prev,
            currency_code: code,
            currency_symbol: option?.symbol || prev.currency_symbol,
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Company Settings" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Company Settings</h1>
                    <p className="text-sm text-muted-foreground">
                        Update branding, currency, contact details, and theme colors.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Currency</CardTitle>
                            <CardDescription>
                                This currency is used for service prices and orders across the website. Current default:{' '}
                                <strong>USD</strong>.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="currency_code">Currency</Label>
                                <select
                                    id="currency_code"
                                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    value={data.currency_code}
                                    onChange={(e) => onCurrencyChange(e.target.value)}
                                >
                                    {currencyOptions.map((option) => (
                                        <option key={option.code} value={option.code}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.currency_code} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="currency_symbol">Symbol</Label>
                                <Input
                                    id="currency_symbol"
                                    value={data.currency_symbol}
                                    onChange={(e) => setData('currency_symbol', e.target.value)}
                                />
                                <InputError message={errors.currency_symbol} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="currency_position">Symbol position</Label>
                                <select
                                    id="currency_position"
                                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    value={data.currency_position}
                                    onChange={(e) => setData('currency_position', e.target.value)}
                                >
                                    <option value="before">Before amount ($100)</option>
                                    <option value="after">After amount (100 USD)</option>
                                </select>
                                <InputError message={errors.currency_position} />
                            </div>
                            <p className="text-sm text-muted-foreground md:col-span-3">
                                Preview:{' '}
                                <span className="font-semibold text-foreground">
                                    {data.currency_position === 'after'
                                        ? `1,500 ${data.currency_code}`
                                        : `${data.currency_symbol}1,500`}
                                </span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Company</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="company_name">Company name</Label>
                                <Input id="company_name" value={data.company_name} onChange={(e) => setData('company_name', e.target.value)} />
                                <InputError message={errors.company_name} />
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="company_tagline">Tagline</Label>
                                <Input id="company_tagline" value={data.company_tagline} onChange={(e) => setData('company_tagline', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="company_email">Email</Label>
                                <Input id="company_email" type="email" value={data.company_email} onChange={(e) => setData('company_email', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="company_phone">Phone</Label>
                                <Input id="company_phone" value={data.company_phone} onChange={(e) => setData('company_phone', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="company_whatsapp">WhatsApp</Label>
                                <Input id="company_whatsapp" value={data.company_whatsapp} onChange={(e) => setData('company_whatsapp', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="business_hours">Business hours</Label>
                                <Input id="business_hours" value={data.business_hours} onChange={(e) => setData('business_hours', e.target.value)} />
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="company_address">Address</Label>
                                <textarea
                                    id="company_address"
                                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={data.company_address}
                                    onChange={(e) => setData('company_address', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="company_address_line">Address line</Label>
                                <Input
                                    id="company_address_line"
                                    value={data.company_address_line}
                                    onChange={(e) => setData('company_address_line', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="logo">Logo</Label>
                                {company.logo && <img src={company.logo} alt="Current logo" className="mb-2 h-12 w-auto object-contain" />}
                                <Input id="logo" type="file" accept="image/*" onChange={(e) => setData('logo', e.target.files?.[0] ?? null)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Footer</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="footer_description">Footer description</Label>
                                <textarea
                                    id="footer_description"
                                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={data.footer_description}
                                    onChange={(e) => setData('footer_description', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="footer_copyright">Footer copyright</Label>
                                <Input id="footer_copyright" value={data.footer_copyright} onChange={(e) => setData('footer_copyright', e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Social links</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            {(
                                [
                                    ['social_facebook', 'Facebook'],
                                    ['social_instagram', 'Instagram'],
                                    ['social_linkedin', 'LinkedIn'],
                                    ['social_x', 'X'],
                                    ['social_youtube', 'YouTube'],
                                    ['social_tiktok', 'TikTok'],
                                ] as const
                            ).map(([key, label]) => (
                                <div key={key} className="grid gap-2">
                                    <Label htmlFor={key}>{label}</Label>
                                    <Input id={key} value={data[key]} onChange={(e) => setData(key, e.target.value)} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Theme colors</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {(
                                [
                                    ['theme_primary', 'Primary'],
                                    ['theme_secondary', 'Secondary'],
                                    ['theme_accent', 'Accent'],
                                    ['theme_background', 'Background'],
                                    ['theme_text', 'Text'],
                                ] as const
                            ).map(([key, label]) => (
                                <div key={key} className="grid gap-2">
                                    <Label htmlFor={key}>{label}</Label>
                                    <div className="flex gap-2">
                                        <Input type="color" className="w-12 p-1" value={data[key] || '#000000'} onChange={(e) => setData(key, e.target.value)} />
                                        <Input id={key} value={data[key]} onChange={(e) => setData(key, e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Button type="submit" disabled={processing}>
                        Save settings
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
