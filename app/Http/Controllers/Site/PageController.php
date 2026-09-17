<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Page;
use App\Models\Project;
use App\Models\Service;
use App\Models\SiteSection;
use App\Models\TeamMember;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('site/about', [
            'section' => SiteSection::where('key', 'about')->first(),
            'team' => TeamMember::query()->where('is_active', true)->orderBy('sort_order')->get(),
            'whyChooseUs' => \App\Models\WhyChooseUs::query()->where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function services(): Response
    {
        return Inertia::render('site/services/index', [
            'section' => SiteSection::where('key', 'services')->first(),
            'services' => Service::query()->where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function serviceShow(string $slug): Response
    {
        $service = Service::query()->where('slug', $slug)->where('is_active', true)->firstOrFail();

        return Inertia::render('site/services/show', [
            'service' => $service,
            'related' => Service::query()
                ->where('is_active', true)
                ->where('id', '!=', $service->id)
                ->orderBy('sort_order')
                ->take(3)
                ->get(),
        ]);
    }

    public function portfolio(): Response
    {
        return Inertia::render('site/portfolio/index', [
            'section' => SiteSection::where('key', 'portfolio')->first(),
            'projects' => Project::query()->where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function portfolioShow(string $slug): Response
    {
        $project = Project::query()->where('slug', $slug)->where('is_active', true)->firstOrFail();

        return Inertia::render('site/portfolio/show', [
            'project' => $project,
        ]);
    }

    public function team(): Response
    {
        return Inertia::render('site/team', [
            'section' => SiteSection::where('key', 'team')->first(),
            'team' => TeamMember::query()->where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function faq(): Response
    {
        return Inertia::render('site/faq', [
            'section' => SiteSection::where('key', 'faq')->first(),
            'faqs' => Faq::query()->where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('site/contact', [
            'section' => SiteSection::where('key', 'contact')->first(),
        ]);
    }

    public function requestQuote(): Response
    {
        return Inertia::render('site/request-quote', [
            'services' => Service::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name']),
        ]);
    }

    public function order(): Response
    {
        return Inertia::render('site/order', [
            'services' => Service::query()->where('is_active', true)->orderBy('sort_order')->get(),
            'selected' => request('service'),
        ]);
    }

    public function customPage(string $slug): Response
    {
        $page = Page::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return Inertia::render('site/page', [
            'page' => $page,
        ]);
    }
}
