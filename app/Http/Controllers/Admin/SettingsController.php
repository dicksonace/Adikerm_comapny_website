<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/settings/company', [
            'settings' => SiteSettings::all(),
            'company' => SiteSettings::company(),
            'theme' => SiteSettings::theme(),
            'currency' => SiteSettings::currency(),
            'currencyOptions' => [
                ['code' => 'USD', 'label' => 'USD — US Dollar ($)', 'symbol' => '$'],
                ['code' => 'LKR', 'label' => 'LKR — Sri Lankan Rupee (Rs)', 'symbol' => 'Rs'],
                ['code' => 'EUR', 'label' => 'EUR — Euro (€)', 'symbol' => '€'],
                ['code' => 'GBP', 'label' => 'GBP — British Pound (£)', 'symbol' => '£'],
                ['code' => 'GHS', 'label' => 'GHS — Ghanaian Cedi (GH₵)', 'symbol' => 'GH₵'],
                ['code' => 'INR', 'label' => 'INR — Indian Rupee (₹)', 'symbol' => '₹'],
                ['code' => 'AED', 'label' => 'AED — UAE Dirham', 'symbol' => 'AED'],
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'company_name' => ['required', 'string', 'max:120'],
            'company_tagline' => ['nullable', 'string', 'max:255'],
            'company_email' => ['nullable', 'email', 'max:160'],
            'company_phone' => ['nullable', 'string', 'max:40'],
            'company_whatsapp' => ['nullable', 'string', 'max:40'],
            'company_address' => ['nullable', 'string', 'max:500'],
            'company_address_line' => ['nullable', 'string', 'max:500'],
            'business_hours' => ['nullable', 'string', 'max:160'],
            'footer_description' => ['nullable', 'string', 'max:500'],
            'footer_copyright' => ['nullable', 'string', 'max:255'],
            'social_facebook' => ['nullable', 'string', 'max:255'],
            'social_instagram' => ['nullable', 'string', 'max:255'],
            'social_linkedin' => ['nullable', 'string', 'max:255'],
            'social_x' => ['nullable', 'string', 'max:255'],
            'social_youtube' => ['nullable', 'string', 'max:255'],
            'social_tiktok' => ['nullable', 'string', 'max:255'],
            'theme_primary' => ['nullable', 'string', 'max:20'],
            'theme_secondary' => ['nullable', 'string', 'max:20'],
            'theme_accent' => ['nullable', 'string', 'max:20'],
            'theme_background' => ['nullable', 'string', 'max:20'],
            'theme_text' => ['nullable', 'string', 'max:20'],
            'currency_code' => ['required', 'string', 'max:10'],
            'currency_symbol' => ['nullable', 'string', 'max:10'],
            'currency_position' => ['required', 'in:before,after'],
            'logo' => ['nullable', 'image', 'max:4096'],
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('branding', 'public');
            SiteSettings::set('company_logo', '/storage/'.$path, 'company');
        }

        // Auto-fill symbol when currency code changes if symbol left empty
        if (empty($data['currency_symbol'])) {
            $symbols = [
                'USD' => '$',
                'LKR' => 'Rs',
                'EUR' => '€',
                'GBP' => '£',
                'GHS' => 'GH₵',
                'INR' => '₹',
                'AED' => 'AED',
            ];
            $data['currency_symbol'] = $symbols[strtoupper($data['currency_code'])] ?? strtoupper($data['currency_code']);
        }

        foreach ($data as $key => $value) {
            if ($key === 'logo') {
                continue;
            }
            $group = str_starts_with($key, 'theme_') ? 'theme'
                : (str_starts_with($key, 'social_') ? 'social'
                : (str_starts_with($key, 'footer_') ? 'footer'
                : (str_starts_with($key, 'currency_') ? 'currency' : 'company')));
            SiteSettings::set($key, $value, $group);
        }

        return back()->with('success', 'Settings updated.');
    }
}
