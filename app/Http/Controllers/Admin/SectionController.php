<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SectionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/sections/index', [
            'sections' => SiteSection::query()->orderBy('sort_order')->get(),
            'guides' => [
                'hero' => 'Headline, description, CTA buttons, hero image URL, show/hide stats',
                'about' => 'About title, who we are, story, mission, vision, image',
                'services' => 'Services section title & intro text (add services under Services menu)',
                'why_us' => 'Why Choose Us section titles (items under Why Choose Us menu)',
                'statistics' => 'Section wrapper (edit numbers under Statistics menu)',
                'process' => 'How we work section titles (steps under How We Work menu)',
                'portfolio' => 'Portfolio section titles (projects under Projects menu)',
                'industries' => 'Industries / who we serve text and list',
                'testimonials' => 'Testimonials section titles',
                'team' => 'Team section titles',
                'faq' => 'FAQ section titles',
                'contact' => 'Contact section titles on homepage',
                'cta' => 'Bottom call-to-action title, text, buttons, image',
            ],
        ]);
    }

    public function edit(SiteSection $section): Response
    {
        return Inertia::render('admin/sections/edit', [
            'section' => $section,
            'fieldHelp' => $this->fieldHelp($section->key),
        ]);
    }

    public function update(Request $request, SiteSection $section): RedirectResponse
    {
        $data = $request->validate([
            'is_enabled' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'content' => ['sometimes', 'array'],
        ]);

        if (isset($data['content'])) {
            $merged = array_merge($section->content ?? [], $data['content']);
            // Cast boolean-like values
            foreach ($merged as $key => $value) {
                if (is_string($value) && in_array(strtolower($value), ['true', 'false'], true)) {
                    $merged[$key] = strtolower($value) === 'true';
                }
            }
            $data['content'] = $merged;
        }

        $section->update($data);

        return back()->with('success', 'Section updated. Refresh the website to see changes.');
    }

    protected function fieldHelp(string $key): array
    {
        return match ($key) {
            'hero' => [
                'headline' => 'Main headline under the company name',
                'description' => 'Short supporting paragraph',
                'primary_cta_text' => 'Primary button label',
                'primary_cta_url' => 'Primary button link (e.g. /order)',
                'secondary_cta_text' => 'Secondary button label',
                'secondary_cta_url' => 'Secondary button link',
                'image' => 'Full-bleed hero image URL',
                'show_stats' => 'true or false — show numbers under hero',
            ],
            'about' => [
                'eyebrow' => 'Small label above title',
                'title' => 'Section heading',
                'who_we_are' => 'First paragraph',
                'story' => 'Second paragraph / company story',
                'mission' => 'Mission text',
                'vision' => 'Vision text',
                'image' => 'About section image URL',
            ],
            'industries' => [
                'eyebrow' => 'Small label',
                'title' => 'Section heading',
                'description' => 'Intro text',
                'items' => 'Comma-separated industries (e.g. Retail, Logistics, Hospitality)',
            ],
            'contact' => [
                'eyebrow' => 'Small label',
                'title' => 'Section heading',
                'description' => 'Intro text under the heading',
            ],
            default => [],
        };
    }
}
