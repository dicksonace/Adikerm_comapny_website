import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface CompanyInfo {
    name: string;
    tagline?: string;
    logo?: string | null;
    favicon?: string | null;
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
    address_line?: string;
    business_hours?: string;
    map_embed?: string | null;
    social?: Record<string, string | null | undefined>;
}

export interface ThemeSettings {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    radius: string;
    heading_font: string;
    body_font: string;
}

export interface CurrencySettings {
    code: string;
    symbol: string;
    name: string;
    position: 'before' | 'after' | string;
}

export interface NavLink {
    id: number;
    label: string;
    url: string | null;
    children?: NavLink[];
}

export interface SharedData {
    name: string;
    auth: Auth;
    flash: {
        success?: string | null;
        error?: string | null;
    };
    company: CompanyInfo;
    theme: ThemeSettings;
    currency: CurrencySettings;
    locale: string;
    availableLocales: string[];
    translations: Record<string, string>;
    navigation: {
        header: NavLink[];
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface ServiceItem {
    id: number;
    name: string;
    name_de?: string | null;
    slug: string;
    icon?: string | null;
    image?: string | null;
    short_description?: string | null;
    short_description_de?: string | null;
    description?: string | null;
    description_de?: string | null;
    price?: string | number | null;
    price_label?: string | null;
    price_label_de?: string | null;
    features?: string[] | null;
    cta_text?: string | null;
    cta_url?: string | null;
    is_featured?: boolean;
}

export interface ProjectItem {
    id: number;
    title: string;
    slug: string;
    cover_image?: string | null;
    description?: string | null;
    client?: string | null;
    category?: string | null;
    technologies?: string[] | null;
    completed_at?: string | null;
    project_url?: string | null;
}

export interface TeamItem {
    id: number;
    name: string;
    position: string;
    department?: string | null;
    photo?: string | null;
    bio?: string | null;
    email?: string | null;
}

export interface TestimonialItem {
    id: number;
    customer_name: string;
    customer_image?: string | null;
    company?: string | null;
    position?: string | null;
    content: string;
    rating: number;
}

export interface StatItem {
    id: number;
    label: string;
    value: string;
    suffix?: string | null;
    icon?: string | null;
}

export interface FaqItem {
    id: number;
    question: string;
    answer: string;
}

export interface WhyItem {
    id: number;
    title: string;
    description?: string | null;
    icon?: string | null;
}

export interface SiteSection {
    id: number;
    key: string;
    name: string;
    is_enabled: boolean;
    sort_order: number;
    content: Record<string, unknown> | null;
}
