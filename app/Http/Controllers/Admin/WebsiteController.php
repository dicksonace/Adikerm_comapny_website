<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\ProcessStep;
use App\Models\Project;
use App\Models\Service;
use App\Models\SiteSection;
use App\Models\Statistic;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\WhyChooseUs;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/website/index', [
            'counts' => [
                'sections' => SiteSection::count(),
                'statistics' => Statistic::count(),
                'services' => Service::count(),
                'projects' => Project::count(),
                'team' => TeamMember::count(),
                'testimonials' => Testimonial::count(),
                'faqs' => Faq::count(),
                'why_choose_us' => WhyChooseUs::count(),
                'process_steps' => ProcessStep::count(),
            ],
            'modules' => [
                [
                    'title' => 'Homepage Sections',
                    'description' => 'Edit hero text, about story, CTA buttons, and turn sections on/off.',
                    'route' => 'admin.sections.index',
                    'count_key' => 'sections',
                ],
                [
                    'title' => 'Statistics / Numbers',
                    'description' => 'Change Happy Clients, Projects Completed, Years Experience, and add new stats.',
                    'route' => 'admin.statistics.index',
                    'count_key' => 'statistics',
                ],
                [
                    'title' => 'Services',
                    'description' => 'Add or edit services shown on the landing page and services page.',
                    'route' => 'admin.services.index',
                    'count_key' => 'services',
                ],
                [
                    'title' => 'Portfolio / Projects',
                    'description' => 'Add case studies and featured projects.',
                    'route' => 'admin.projects.index',
                    'count_key' => 'projects',
                ],
                [
                    'title' => 'How We Work',
                    'description' => 'Add process steps (Discover → Design → Build → Launch).',
                    'route' => 'admin.process-steps.index',
                    'count_key' => 'process_steps',
                ],
                [
                    'title' => 'Why Choose Us',
                    'description' => 'Add competitive advantages shown on the homepage.',
                    'route' => 'admin.why-choose-us.index',
                    'count_key' => 'why_choose_us',
                ],
                [
                    'title' => 'Team (Website)',
                    'description' => 'People shown publicly on the landing page / team page.',
                    'route' => 'admin.team.index',
                    'count_key' => 'team',
                ],
                [
                    'title' => 'Testimonials',
                    'description' => 'Customer reviews for the homepage carousel.',
                    'route' => 'admin.testimonials.index',
                    'count_key' => 'testimonials',
                ],
                [
                    'title' => 'FAQs',
                    'description' => 'Questions and answers visitors see on the site.',
                    'route' => 'admin.faqs.index',
                    'count_key' => 'faqs',
                ],
                [
                    'title' => 'Company Settings',
                    'description' => 'Company name, logo, phone, address, social links, theme colors.',
                    'route' => 'admin.settings.edit',
                    'count_key' => null,
                ],
            ],
        ]);
    }
}
