<?php

namespace App\Http\Controllers\Site;

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

class HomeController extends Controller
{
    public function index(): Response
    {
        $sections = SiteSection::query()
            ->where('is_enabled', true)
            ->orderBy('sort_order')
            ->get()
            ->keyBy('key');

        return Inertia::render('site/home', [
            'sections' => $sections,
            'services' => Service::query()->where('is_active', true)->orderBy('sort_order')->take(6)->get(),
            'projects' => Project::query()->where('is_active', true)->where('is_featured', true)->orderBy('sort_order')->take(4)->get(),
            'team' => TeamMember::query()->where('is_active', true)->orderBy('sort_order')->take(4)->get(),
            'testimonials' => Testimonial::query()->where('is_active', true)->where('is_featured', true)->orderBy('sort_order')->get(),
            'whyChooseUs' => WhyChooseUs::query()->where('is_active', true)->orderBy('sort_order')->get(),
            'statistics' => Statistic::query()->where('is_active', true)->orderBy('sort_order')->get(),
            'processSteps' => ProcessStep::query()->where('is_active', true)->orderBy('sort_order')->get(),
            'faqs' => Faq::query()->where('is_active', true)->orderBy('sort_order')->take(6)->get(),
        ]);
    }
}
