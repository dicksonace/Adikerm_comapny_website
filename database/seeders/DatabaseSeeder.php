<?php

namespace Database\Seeders;

use App\Models\CrmActivity;
use App\Models\CrmNote;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\Faq;
use App\Models\NavigationItem;
use App\Models\ProcessStep;
use App\Models\Project;
use App\Models\Service;
use App\Models\SiteSection;
use App\Models\Statistic;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\WhyChooseUs;
use App\Services\SiteSettings;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@ace.local'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $settings = [
            ['key' => 'company_name', 'value' => 'Adikern', 'group' => 'company'],
            ['key' => 'company_tagline', 'value' => 'Building digital experiences that grow your business', 'group' => 'company'],
            ['key' => 'company_email', 'value' => 'hello@adikern.lk', 'group' => 'company'],
            ['key' => 'company_phone', 'value' => '+94 77 348 3260', 'group' => 'company'],
            ['key' => 'company_whatsapp', 'value' => '+94773483260', 'group' => 'company'],
            ['key' => 'company_address', 'value' => "No. 1051,\nKajuduwawaththa,\nNagoda,\nKalutara 12000,\nSri Lanka.", 'group' => 'company'],
            ['key' => 'company_address_line', 'value' => 'No. 1051, Kajuduwawaththa, Nagoda, Kalutara 12000, Sri Lanka', 'group' => 'company'],
            ['key' => 'business_hours', 'value' => 'Monday – Friday · 9:00 AM – 6:00 PM', 'group' => 'company'],
            ['key' => 'theme_primary', 'value' => '#0B1F3A', 'group' => 'theme'],
            ['key' => 'theme_secondary', 'value' => '#1E293B', 'group' => 'theme'],
            ['key' => 'theme_accent', 'value' => '#0F766E', 'group' => 'theme'],
            ['key' => 'theme_background', 'value' => '#F8FAFC', 'group' => 'theme'],
            ['key' => 'theme_text', 'value' => '#0F172A', 'group' => 'theme'],
            ['key' => 'theme_radius', 'value' => '0.75rem', 'group' => 'theme'],
            ['key' => 'theme_heading_font', 'value' => 'Syne', 'group' => 'theme'],
            ['key' => 'theme_body_font', 'value' => 'Figtree', 'group' => 'theme'],
            ['key' => 'currency_code', 'value' => 'USD', 'group' => 'currency'],
            ['key' => 'currency_symbol', 'value' => '$', 'group' => 'currency'],
            ['key' => 'currency_position', 'value' => 'before', 'group' => 'currency'],
            ['key' => 'seo_default_title', 'value' => 'Adikern — Professional Services in Sri Lanka', 'group' => 'seo'],
            ['key' => 'seo_default_description', 'value' => 'Adikern delivers web development, software, branding, and digital consulting from Kalutara, Sri Lanka.', 'group' => 'seo'],
            ['key' => 'footer_description', 'value' => 'We help businesses design, build, and grow with modern digital solutions — from strategy to delivery.', 'group' => 'footer'],
            ['key' => 'footer_copyright', 'value' => '© {year} Adikern. All rights reserved.', 'group' => 'footer'],
            ['key' => 'social_facebook', 'value' => '', 'group' => 'social'],
            ['key' => 'social_instagram', 'value' => '', 'group' => 'social'],
            ['key' => 'social_linkedin', 'value' => '', 'group' => 'social'],
            ['key' => 'social_x', 'value' => '', 'group' => 'social'],
            ['key' => 'social_youtube', 'value' => '', 'group' => 'social'],
            ['key' => 'social_tiktok', 'value' => '', 'group' => 'social'],
        ];

        foreach ($settings as $setting) {
            SiteSettings::set($setting['key'], $setting['value'], $setting['group']);
        }

        $sections = [
            ['key' => 'hero', 'name' => 'Hero', 'sort_order' => 1, 'content' => [
                'headline' => 'We build digital products that move business forward',
                'headline_de' => 'Wir entwickeln digitale Produkte, die Ihr Unternehmen voranbringen',
                'description' => 'From strategy and design to development and delivery — Adikern partners with ambitious teams across Sri Lanka and beyond.',
                'description_de' => 'Von Strategie und Design bis Entwicklung und Umsetzung — Adikern begleitet ambitionierte Teams in Sri Lanka und darüber hinaus.',
                'primary_cta_text' => 'Request a Service',
                'primary_cta_text_de' => 'Leistung anfragen',
                'primary_cta_url' => '/order',
                'secondary_cta_text' => 'Explore Our Work',
                'secondary_cta_text_de' => 'Unsere Arbeit entdecken',
                'secondary_cta_url' => '/portfolio',
                'image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
                'show_stats' => true,
            ]],
            ['key' => 'about', 'name' => 'About', 'sort_order' => 2, 'content' => [
                'eyebrow' => 'About Adikern',
                'eyebrow_de' => 'Über Adikern',
                'title' => 'A partner for modern business growth',
                'title_de' => 'Ein Partner für modernes Unternehmenswachstum',
                'who_we_are' => 'Adikern is a professional services company helping organizations launch websites, software, and digital experiences with clarity and craft. We work with founders, operators, and marketing teams who need dependable delivery — not fluff.',
                'who_we_are_de' => 'Adikern ist ein Dienstleistungsunternehmen, das Organisationen beim Launch von Websites, Software und digitalen Erlebnissen mit Klarheit und Handwerk hilft. Wir arbeiten mit Gründern, Betreibern und Marketingteams, die zuverlässige Umsetzung brauchen — keine leeren Versprechen.',
                'story' => 'Based in Kalutara, Sri Lanka, we combine local understanding with global delivery standards. From first brief to final handoff, our team stays close to your goals, timeline, and budget so every engagement stays clear and accountable.',
                'story_de' => 'Mit Sitz in Kalutara, Sri Lanka, verbinden wir lokales Verständnis mit internationalen Lieferstandards. Vom ersten Briefing bis zur Übergabe bleibt unser Team nah an Ihren Zielen, Zeitplänen und Budgets.',
                'mission' => 'To deliver dependable digital solutions that help businesses grow with confidence.',
                'mission_de' => 'Zuverlässige digitale Lösungen liefern, mit denen Unternehmen selbstbewusst wachsen.',
                'vision' => 'To be the trusted digital partner for companies that want quality without complexity.',
                'vision_de' => 'Der vertrauenswürdige digitale Partner für Unternehmen zu sein, die Qualität ohne Komplexität wollen.',
                'values' => 'Clarity, craftsmanship, communication, and ownership — from kickoff to launch.',
                'values_de' => 'Klarheit, Handwerk, Kommunikation und Verantwortung — vom Kickoff bis zum Launch.',
                'image' => 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80',
            ]],
            ['key' => 'services', 'name' => 'Services', 'sort_order' => 3, 'content' => [
                'eyebrow' => 'What we do',
                'eyebrow_de' => 'Was wir tun',
                'title' => 'Services built for real business outcomes',
                'title_de' => 'Leistungen für echte Geschäftsergebnisse',
                'description' => 'Whether you need a new website, custom software, branding, or ongoing digital support — pick a service, share your brief, and we will guide the rest.',
                'description_de' => 'Ob neue Website, individuelle Software, Branding oder laufende digitale Unterstützung — wählen Sie eine Leistung, teilen Sie Ihr Briefing, und wir begleiten den Rest.',
            ]],
            ['key' => 'process', 'name' => 'How We Work', 'sort_order' => 4, 'content' => [
                'eyebrow' => 'Our process',
                'eyebrow_de' => 'Unser Prozess',
                'title' => 'A clear path from idea to delivery',
                'title_de' => 'Ein klarer Weg von der Idee zur Umsetzung',
                'description' => 'Every engagement follows a simple, transparent process so you always know what happens next.',
                'description_de' => 'Jedes Projekt folgt einem einfachen, transparenten Prozess — Sie wissen immer, was als Nächstes kommt.',
            ]],
            ['key' => 'why_us', 'name' => 'Why Choose Us', 'sort_order' => 5, 'content' => [
                'eyebrow' => 'Why Adikern',
                'eyebrow_de' => 'Warum Adikern',
                'title' => 'What sets our work apart',
                'title_de' => 'Was unsere Arbeit auszeichnet',
                'description' => 'Clear communication, careful craft, and delivery you can plan around.',
                'description_de' => 'Klare Kommunikation, sorgfältiges Handwerk und Lieferung, auf die Sie planen können.',
            ]],
            ['key' => 'statistics', 'name' => 'Statistics', 'sort_order' => 6, 'content' => []],
            ['key' => 'industries', 'name' => 'Industries', 'sort_order' => 7, 'content' => [
                'eyebrow' => 'Who we serve',
                'eyebrow_de' => 'Wen wir betreuen',
                'title' => 'Industries we understand',
                'title_de' => 'Branchen, die wir verstehen',
                'description' => 'We adapt our approach to your sector — from customer-facing brands to internal operations tools.',
                'description_de' => 'Wir passen unseren Ansatz an Ihre Branche an — von kundenorientierten Marken bis zu internen Betriebswerkzeugen.',
                'items' => 'Retail & E-commerce, Logistics & Operations, Hospitality, Professional Services, Education, Healthcare, Startups & SMEs, Corporate & Enterprise',
                'items_de' => 'Einzelhandel & E-Commerce, Logistik & Betrieb, Gastgewerbe, Professionelle Dienstleistungen, Bildung, Gesundheitswesen, Startups & KMU, Unternehmen & Konzerne',
            ]],
            ['key' => 'portfolio', 'name' => 'Portfolio', 'sort_order' => 8, 'content' => [
                'eyebrow' => 'Selected work',
                'eyebrow_de' => 'Ausgewählte Arbeiten',
                'title' => 'Projects that speak for themselves',
                'title_de' => 'Projekte, die für sich sprechen',
                'description' => 'A look at recent work across web, product, and brand engagements.',
                'description_de' => 'Ein Blick auf aktuelle Arbeiten in Web, Produkt und Marke.',
            ]],
            ['key' => 'testimonials', 'name' => 'Testimonials', 'sort_order' => 9, 'content' => [
                'eyebrow' => 'Client voices',
                'eyebrow_de' => 'Kundenstimmen',
                'title' => 'Trusted by teams who value delivery',
                'title_de' => 'Vertraut von Teams, die auf Lieferung setzen',
            ]],
            ['key' => 'team', 'name' => 'Team', 'sort_order' => 10, 'content' => [
                'eyebrow' => 'Our people',
                'eyebrow_de' => 'Unsere Leute',
                'title' => 'The team behind the work',
                'title_de' => 'Das Team hinter der Arbeit',
                'description' => 'Specialists who care about clarity, craft, and client outcomes.',
                'description_de' => 'Spezialisten, denen Klarheit, Handwerk und Kundenergebnisse wichtig sind.',
            ]],
            ['key' => 'faq', 'name' => 'FAQ', 'sort_order' => 11, 'content' => [
                'eyebrow' => 'FAQ',
                'eyebrow_de' => 'FAQ',
                'title' => 'Answers before you get started',
                'title_de' => 'Antworten, bevor Sie starten',
            ]],
            ['key' => 'contact', 'name' => 'Contact', 'sort_order' => 12, 'content' => [
                'eyebrow' => 'Visit & reach us',
                'eyebrow_de' => 'Besuchen & kontaktieren',
                'title' => 'Let’s talk about your project',
                'title_de' => 'Lassen Sie uns über Ihr Projekt sprechen',
                'description' => 'Call, email, or send a message. We are based in Kalutara and work with clients across Sri Lanka and internationally. Typical response time: one business day.',
                'description_de' => 'Rufen Sie an, schreiben Sie eine E-Mail oder senden Sie eine Nachricht. Wir sitzen in Kalutara und arbeiten mit Kunden in Sri Lanka und international. Typische Antwortzeit: ein Werktag.',
            ]],
            ['key' => 'cta', 'name' => 'CTA', 'sort_order' => 13, 'content' => [
                'title' => 'Ready to start your next project?',
                'title_de' => 'Bereit für Ihr nächstes Projekt?',
                'description' => 'Tell us what you need. We will respond with a clear next step — quote, proposal, or call.',
                'description_de' => 'Sagen Sie uns, was Sie brauchen. Wir antworten mit dem nächsten klaren Schritt — Angebot, Vorschlag oder Gespräch.',
                'primary_cta_text' => 'Request a Quote',
                'primary_cta_text_de' => 'Angebot anfordern',
                'primary_cta_url' => '/request-quote',
                'secondary_cta_text' => 'Contact Us',
                'secondary_cta_text_de' => 'Kontakt',
                'secondary_cta_url' => '/contact',
                'image' => 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80',
            ]],
        ];

        foreach ($sections as $section) {
            SiteSection::updateOrCreate(
                ['key' => $section['key']],
                [
                    'name' => $section['name'],
                    'is_enabled' => true,
                    'sort_order' => $section['sort_order'],
                    'content' => $section['content'],
                ]
            );
        }

        $nav = [
            ['label' => 'Home', 'label_de' => 'Startseite', 'url' => '/', 'sort_order' => 1],
            ['label' => 'About', 'label_de' => 'Über uns', 'url' => '/about', 'sort_order' => 2],
            ['label' => 'Services', 'label_de' => 'Leistungen', 'url' => '/services', 'sort_order' => 3],
            ['label' => 'Portfolio', 'label_de' => 'Portfolio', 'url' => '/portfolio', 'sort_order' => 4],
            ['label' => 'Team', 'label_de' => 'Team', 'url' => '/team', 'sort_order' => 5],
            ['label' => 'FAQ', 'label_de' => 'FAQ', 'url' => '/faq', 'sort_order' => 6],
            ['label' => 'Contact', 'label_de' => 'Kontakt', 'url' => '/contact', 'sort_order' => 7],
        ];

        foreach ($nav as $item) {
            NavigationItem::updateOrCreate(
                ['label' => $item['label'], 'location' => 'header'],
                [...$item, 'location' => 'header', 'is_active' => true]
            );
        }

        $services = [
            [
                'name' => 'Web Development',
                'name_de' => 'Webentwicklung',
                'short_description' => 'Fast, modern websites built for conversion and clarity.',
                'short_description_de' => 'Schnelle, moderne Websites für Conversion und Klarheit.',
                'description' => 'Custom websites and web applications with clean architecture, responsive design, and admin-friendly content management.',
                'description_de' => 'Individuelle Websites und Webanwendungen mit klarer Architektur, responsivem Design und adminfreundlichem Content-Management.',
                'icon' => 'globe',
                'image' => 'https://images.unsplash.com/photo-1498050108023-c8199c77f2e0?auto=format&fit=crop&w=1400&q=80',
                'features' => ['Responsive design', 'CMS-ready structure', 'Performance focused', 'SEO foundations'],
                'price' => 500,
                'price_label' => null,
                'price_label_de' => null,
            ],
            [
                'name' => 'Software Development',
                'name_de' => 'Softwareentwicklung',
                'short_description' => 'Custom software tailored to your operations.',
                'short_description_de' => 'Individuelle Software, angepasst an Ihre Abläufe.',
                'description' => 'Business systems, dashboards, and internal tools designed around your workflows — not generic templates.',
                'description_de' => 'Geschäftssysteme, Dashboards und interne Tools rund um Ihre Workflows — keine generischen Vorlagen.',
                'icon' => 'code',
                'image' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80',
                'features' => ['Requirements workshop', 'Agile delivery', 'Secure architecture', 'Ongoing support'],
                'price' => null,
                'price_label' => 'Custom quote',
                'price_label_de' => 'Individuelles Angebot',
            ],
            [
                'name' => 'Digital Marketing',
                'name_de' => 'Digitales Marketing',
                'short_description' => 'Campaigns and content that attract the right audience.',
                'short_description_de' => 'Kampagnen und Inhalte, die die richtige Zielgruppe ansprechen.',
                'description' => 'Strategy, creative, and channel execution to grow visibility and qualified leads.',
                'description_de' => 'Strategie, Kreativ und Kanalumsetzung für mehr Sichtbarkeit und qualifizierte Leads.',
                'icon' => 'megaphone',
                'image' => 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1400&q=80',
                'features' => ['Channel strategy', 'Creative assets', 'Analytics reporting', 'Lead tracking'],
                'price' => null,
                'price_label' => 'Monthly retainers',
                'price_label_de' => 'Monatliche Retainer',
            ],
            [
                'name' => 'Branding',
                'name_de' => 'Branding',
                'short_description' => 'Identity systems that feel credible and memorable.',
                'short_description_de' => 'Identitätssysteme, die glaubwürdig und einprägsam wirken.',
                'description' => 'Logo, visual language, and brand guidelines that help your business look and sound consistent.',
                'description_de' => 'Logo, visuelle Sprache und Markenrichtlinien für ein konsistentes Erscheinungsbild.',
                'icon' => 'palette',
                'image' => 'https://images.unsplash.com/photo-1626785774573-4b7993143460?auto=format&fit=crop&w=1400&q=80',
                'features' => ['Brand discovery', 'Visual identity', 'Guidelines', 'Collateral templates'],
                'price' => 250,
                'price_label' => null,
                'price_label_de' => null,
            ],
            [
                'name' => 'IT Consulting',
                'name_de' => 'IT-Beratung',
                'short_description' => 'Practical advice for technology decisions.',
                'short_description_de' => 'Praktische Beratung für Technologieentscheidungen.',
                'description' => 'Architecture reviews, vendor selection, and digital roadmap planning for growing teams.',
                'description_de' => 'Architektur-Reviews, Anbieterauswahl und digitale Roadmap-Planung für wachsende Teams.',
                'icon' => 'briefcase',
                'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
                'features' => ['Discovery sessions', 'Roadmap planning', 'Vendor evaluation', 'Implementation support'],
                'price' => null,
                'price_label' => 'Hourly / project',
                'price_label_de' => 'Stündlich / Projekt',
            ],
            [
                'name' => 'UI/UX Design',
                'name_de' => 'UI/UX-Design',
                'short_description' => 'Interfaces people understand and enjoy using.',
                'short_description_de' => 'Oberflächen, die Menschen verstehen und gerne nutzen.',
                'description' => 'Research-informed product and website design focused on usability and conversion.',
                'description_de' => 'Forschungsbasiertes Produkt- und Website-Design mit Fokus auf Usability und Conversion.',
                'icon' => 'layout',
                'image' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=80',
                'features' => ['Wireframes', 'High-fidelity UI', 'Prototypes', 'Design systems'],
                'price' => 300,
                'price_label' => null,
                'price_label_de' => null,
            ],
        ];

        foreach ($services as $index => $service) {
            Service::updateOrCreate(
                ['slug' => Str::slug($service['name'])],
                [
                    ...$service,
                    'slug' => Str::slug($service['name']),
                    'cta_text' => 'Order this service',
                    'cta_url' => '/order',
                    'is_active' => true,
                    'is_featured' => $index < 3,
                    'sort_order' => $index + 1,
                ]
            );
        }

        $projects = [
            [
                'title' => 'Commerce Platform Refresh',
                'client' => 'Retail Group',
                'category' => 'Web Development',
                'description' => 'A full redesign and rebuild of a multi-category storefront with faster checkout and clearer product discovery.',
                'cover_image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
                'technologies' => ['Laravel', 'React', 'Tailwind'],
            ],
            [
                'title' => 'Operations Dashboard',
                'client' => 'Logistics Co.',
                'category' => 'Software',
                'description' => 'An internal operations console for tracking jobs, staff assignments, and delivery status in real time.',
                'cover_image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
                'technologies' => ['Laravel', 'Inertia', 'Charts'],
            ],
            [
                'title' => 'Brand Identity System',
                'client' => 'Hospitality Brand',
                'category' => 'Branding',
                'description' => 'A complete identity refresh including logo, color system, typography, and print/digital templates.',
                'cover_image' => 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=1400&q=80',
                'technologies' => ['Brand strategy', 'Visual design'],
            ],
            [
                'title' => 'Lead Generation Site',
                'client' => 'Professional Services Firm',
                'category' => 'Marketing',
                'description' => 'A conversion-focused marketing site with quote requests, service pages, and analytics instrumentation.',
                'cover_image' => 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=80',
                'technologies' => ['SEO', 'CMS', 'Analytics'],
            ],
        ];

        foreach ($projects as $index => $project) {
            Project::updateOrCreate(
                ['slug' => Str::slug($project['title'])],
                [
                    ...$project,
                    'slug' => Str::slug($project['title']),
                    'completed_at' => now()->subMonths(4 - $index)->toDateString(),
                    'is_featured' => true,
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ]
            );
        }

        $team = [
            [
                'name' => 'Alex Perera',
                'position' => 'Chief Executive Officer',
                'department' => 'Leadership',
                'bio' => 'Leads strategy and client partnerships with a focus on clear delivery and long-term value.',
                'photo' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Nimali Fernando',
                'position' => 'Head of Operations',
                'department' => 'Operations',
                'bio' => 'Keeps projects on schedule and ensures every engagement has clear ownership and communication.',
                'photo' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Kasun Jayawardena',
                'position' => 'Lead Engineer',
                'department' => 'Engineering',
                'bio' => 'Builds reliable Laravel and React systems with an eye for maintainability and performance.',
                'photo' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Sasha De Silva',
                'position' => 'Design Director',
                'department' => 'Design',
                'bio' => 'Shapes brand and product experiences that feel purposeful, polished, and easy to use.',
                'photo' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
            ],
        ];

        foreach ($team as $index => $member) {
            TeamMember::updateOrCreate(
                ['name' => $member['name']],
                [...$member, 'is_active' => true, 'sort_order' => $index + 1]
            );
        }

        $testimonials = [
            [
                'customer_name' => 'Dilani Wickramasinghe',
                'company' => 'Coastal Retail',
                'position' => 'Managing Director',
                'content' => 'Adikern turned a messy brief into a clear plan and a website our team can actually manage. Communication stayed sharp the whole way.',
                'customer_image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
                'rating' => 5,
            ],
            [
                'customer_name' => 'Ruwan Silva',
                'company' => 'Northline Logistics',
                'position' => 'Operations Lead',
                'content' => 'The dashboard they built cut our status-check time dramatically. They listened, iterated quickly, and delivered what we needed.',
                'customer_image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
                'rating' => 5,
            ],
            [
                'customer_name' => 'Priya Mendis',
                'company' => 'Studio Haven',
                'position' => 'Founder',
                'content' => 'From branding to launch, the process felt professional and calm. The end result looks exactly like the business we wanted to become.',
                'customer_image' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
                'rating' => 5,
            ],
        ];

        foreach ($testimonials as $index => $item) {
            Testimonial::updateOrCreate(
                ['customer_name' => $item['customer_name']],
                [...$item, 'is_featured' => true, 'is_active' => true, 'sort_order' => $index + 1]
            );
        }

        $why = [
            ['title' => 'Experienced team', 'description' => 'Specialists across strategy, design, engineering, and delivery.', 'icon' => 'users'],
            ['title' => 'Fast, clear delivery', 'description' => 'Milestones you can plan around, with transparent progress updates.', 'icon' => 'zap'],
            ['title' => 'Quality assurance', 'description' => 'Reviewed work, tested releases, and documentation that lasts.', 'icon' => 'shield'],
            ['title' => 'Responsive support', 'description' => 'Real people who respond quickly when you need help.', 'icon' => 'headset'],
            ['title' => 'Fair pricing', 'description' => 'Scoped proposals with no surprise line items.', 'icon' => 'wallet'],
            ['title' => 'Business-first approach', 'description' => 'We design around outcomes — not just deliverables.', 'icon' => 'target'],
        ];

        foreach ($why as $index => $item) {
            WhyChooseUs::updateOrCreate(
                ['title' => $item['title']],
                [...$item, 'is_active' => true, 'sort_order' => $index + 1]
            );
        }

        $stats = [
            ['value' => '120', 'suffix' => '+', 'label' => 'Happy Clients', 'icon' => 'smile'],
            ['value' => '250', 'suffix' => '+', 'label' => 'Projects Completed', 'icon' => 'folder'],
            ['value' => '8', 'suffix' => '+', 'label' => 'Years Experience', 'icon' => 'calendar'],
            ['value' => '18', 'suffix' => '', 'label' => 'Team Members', 'icon' => 'users'],
        ];

        foreach ($stats as $index => $stat) {
            Statistic::updateOrCreate(
                ['label' => $stat['label']],
                [...$stat, 'is_active' => true, 'sort_order' => $index + 1]
            );
        }

        $faqs = [
            [
                'question' => 'How long does a typical project take?',
                'answer' => 'Most website projects take 3–8 weeks depending on scope. Software and branding timelines are scoped after a discovery call.',
            ],
            [
                'question' => 'Can I request a quote before placing an order?',
                'answer' => 'Yes. Use Request a Quote with your requirements and budget range — we will respond with a clear estimate.',
            ],
            [
                'question' => 'Do you work with clients outside Kalutara?',
                'answer' => 'Absolutely. We work remotely across Sri Lanka and internationally, with meetings online or on-site when needed.',
            ],
            [
                'question' => 'Can I update website content myself later?',
                'answer' => 'Yes. The platform includes an admin CMS so you can change text, images, services, team members, and more without code.',
            ],
            [
                'question' => 'What do I need to get started?',
                'answer' => 'A short brief is enough: goals, timeline, references, and any files or brand assets you already have.',
            ],
        ];

        foreach ($faqs as $index => $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                [...$faq, 'is_active' => true, 'sort_order' => $index + 1]
            );
        }

        $processSteps = [
            [
                'title' => 'Discover',
                'description' => 'We start with your goals, constraints, and success criteria — so the brief is clear before any design or code begins.',
                'icon' => 'search',
            ],
            [
                'title' => 'Plan & Design',
                'description' => 'Structure, wireframes, and visual direction are aligned with you early, reducing surprises later in the build.',
                'icon' => 'layout',
            ],
            [
                'title' => 'Build',
                'description' => 'We develop in focused milestones with regular demos, so you can review progress and give feedback along the way.',
                'icon' => 'code',
            ],
            [
                'title' => 'Launch & Support',
                'description' => 'Go-live with documentation, training where needed, and optional ongoing support to keep things running smoothly.',
                'icon' => 'zap',
            ],
        ];

        foreach ($processSteps as $index => $step) {
            ProcessStep::updateOrCreate(
                ['title' => $step['title']],
                [...$step, 'is_active' => true, 'sort_order' => $index + 1]
            );
        }

        $this->seedCrm();
    }

    protected function seedCrm(): void
    {
        $admin = User::where('email', 'admin@ace.local')->first();

        $ceo = Employee::updateOrCreate(
            ['email' => 'alex@ace.local'],
            [
                'employee_code' => 'EMP-1001',
                'user_id' => $admin?->id,
                'name' => 'Alex Perera',
                'phone' => '+94 77 100 1001',
                'photo' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
                'department' => 'Leadership',
                'job_title' => 'Chief Executive Officer',
                'employment_type' => 'full_time',
                'role' => 'super_admin',
                'permissions' => Employee::DEFAULT_PERMISSIONS['super_admin'],
                'hired_at' => now()->subYears(5)->toDateString(),
                'status' => 'active',
                'bio' => 'Leads company strategy and client partnerships.',
                'show_on_website' => true,
            ]
        );

        if ($admin) {
            $admin->update([
                'employee_id' => $ceo->id,
                'department' => 'Leadership',
                'job_title' => 'Chief Executive Officer',
                'role' => 'super_admin',
            ]);
        }

        $ops = Employee::updateOrCreate(
            ['email' => 'nimali@ace.local'],
            [
                'employee_code' => 'EMP-1002',
                'name' => 'Nimali Fernando',
                'phone' => '+94 77 100 1002',
                'photo' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
                'department' => 'Operations',
                'job_title' => 'Head of Operations',
                'employment_type' => 'full_time',
                'role' => 'manager',
                'permissions' => Employee::DEFAULT_PERMISSIONS['manager'],
                'hired_at' => now()->subYears(3)->toDateString(),
                'status' => 'active',
                'manager_id' => $ceo->id,
                'bio' => 'Owns delivery timelines and customer operations.',
                'show_on_website' => true,
            ]
        );

        $salesUser = User::updateOrCreate(
            ['email' => 'sales@ace.local'],
            [
                'name' => 'Ruwan Sales',
                'password' => Hash::make('password'),
                'role' => 'sales',
                'phone' => '+94 77 100 1003',
                'department' => 'Sales',
                'job_title' => 'Sales Executive',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $sales = Employee::updateOrCreate(
            ['email' => 'sales@ace.local'],
            [
                'employee_code' => 'EMP-1003',
                'user_id' => $salesUser->id,
                'name' => 'Ruwan Sales',
                'phone' => '+94 77 100 1003',
                'department' => 'Sales',
                'job_title' => 'Sales Executive',
                'employment_type' => 'full_time',
                'role' => 'sales',
                'permissions' => Employee::DEFAULT_PERMISSIONS['sales'],
                'hired_at' => now()->subYears(1)->toDateString(),
                'status' => 'active',
                'manager_id' => $ops->id,
                'show_on_website' => false,
            ]
        );
        $salesUser->update(['employee_id' => $sales->id]);

        $customers = [
            [
                'name' => 'Dilani Wickramasinghe',
                'email' => 'dilani@coastalretail.lk',
                'phone' => '+94 71 222 3344',
                'company' => 'Coastal Retail',
                'job_title' => 'Managing Director',
                'city' => 'Colombo',
                'status' => 'vip',
                'source' => 'referral',
                'priority' => 1,
                'lifetime_value' => 450000,
                'tags' => ['retail', 'website'],
            ],
            [
                'name' => 'Ruwan Silva',
                'email' => 'ruwan@northline.lk',
                'phone' => '+94 71 555 7788',
                'company' => 'Northline Logistics',
                'job_title' => 'Operations Lead',
                'city' => 'Negombo',
                'status' => 'active',
                'source' => 'website',
                'priority' => 2,
                'lifetime_value' => 280000,
                'tags' => ['software', 'logistics'],
            ],
            [
                'name' => 'Priya Mendis',
                'email' => 'priya@studiohaven.lk',
                'phone' => '+94 77 888 1122',
                'company' => 'Studio Haven',
                'job_title' => 'Founder',
                'city' => 'Kalutara',
                'status' => 'prospect',
                'source' => 'social',
                'priority' => 2,
                'lifetime_value' => 0,
                'tags' => ['branding'],
            ],
            [
                'name' => 'Hashan Cooray',
                'email' => 'hashan@example.lk',
                'phone' => '+94 76 111 2233',
                'company' => null,
                'city' => 'Galle',
                'status' => 'lead',
                'source' => 'website',
                'priority' => 3,
                'lifetime_value' => 0,
                'tags' => ['new'],
            ],
        ];

        foreach ($customers as $index => $row) {
            $customer = Customer::updateOrCreate(
                ['email' => $row['email']],
                [
                    ...$row,
                    'customer_code' => 'CUS-'.(1001 + $index),
                    'country' => 'Sri Lanka',
                    'assigned_to' => $salesUser->id,
                    'last_contacted_at' => now()->subDays($index + 1),
                ]
            );

            CrmActivity::log([
                'customer_id' => $customer->id,
                'user_id' => $admin?->id,
                'employee_id' => $sales->id,
                'type' => 'created',
                'title' => 'Customer imported into CRM',
                'description' => $customer->name.' added to Customer CRM.',
            ]);

            CrmNote::create([
                'notable_type' => Customer::class,
                'notable_id' => $customer->id,
                'user_id' => $salesUser->id,
                'type' => 'note',
                'title' => 'Initial CRM note',
                'body' => 'Follow up on requirements and confirm preferred communication channel.',
                'is_pinned' => $index === 0,
            ]);
        }
    }
}
