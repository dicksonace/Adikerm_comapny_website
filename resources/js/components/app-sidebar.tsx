import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    ClipboardList,
    ContactRound,
    FolderKanban,
    HelpCircle,
    IdCard,
    LayoutGrid,
    Mail,
    MessageSquareQuote,
    Settings,
    Sparkles,
    Star,
    Users,
    BarChart3,
    Layers,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', url: route('admin.dashboard'), icon: LayoutGrid },
    { title: 'Website Content', url: route('admin.website.index'), icon: Layers },
    { title: 'Customers', url: route('admin.customers.index'), icon: ContactRound },
    { title: 'Employees', url: route('admin.employees.index'), icon: IdCard },
    { title: 'Orders', url: route('admin.orders.index'), icon: ClipboardList },
    { title: 'Leads', url: route('admin.leads.index'), icon: Briefcase },
    { title: 'Messages', url: route('admin.messages.index'), icon: Mail },
    { title: 'Services', url: route('admin.services.index'), icon: Sparkles },
    { title: 'Projects', url: route('admin.projects.index'), icon: FolderKanban },
    { title: 'How We Work', url: route('admin.process-steps.index'), icon: BarChart3 },
    { title: 'Team', url: route('admin.team.index'), icon: Users },
    { title: 'Testimonials', url: route('admin.testimonials.index'), icon: MessageSquareQuote },
    { title: 'FAQs', url: route('admin.faqs.index'), icon: HelpCircle },
    { title: 'Why Choose Us', url: route('admin.why-choose-us.index'), icon: Star },
    { title: 'Statistics', url: route('admin.statistics.index'), icon: BarChart3 },
    { title: 'Sections', url: route('admin.sections.index'), icon: Layers },
    { title: 'Company Settings', url: route('admin.settings.edit'), icon: Settings },
];

const footerNavItems: NavItem[] = [
    {
        title: 'View site',
        url: route('home'),
        icon: Building2,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('admin.dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
