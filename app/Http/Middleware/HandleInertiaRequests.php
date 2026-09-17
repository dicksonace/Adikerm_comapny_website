<?php

namespace App\Http\Middleware;

use App\Models\NavigationItem;
use App\Services\SiteSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $company = SiteSettings::company();
        $theme = SiteSettings::theme();
        $locale = app()->getLocale();

        $nav = NavigationItem::query()
            ->where('location', 'header')
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->with(['children' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order')])
            ->get()
            ->map(function (NavigationItem $item) use ($locale) {
                return [
                    'id' => $item->id,
                    'label' => $locale === 'de' && $item->label_de ? $item->label_de : $item->label,
                    'url' => $item->url,
                    'children' => $item->children->map(fn (NavigationItem $child) => [
                        'id' => $child->id,
                        'label' => $locale === 'de' && $child->label_de ? $child->label_de : $child->label,
                        'url' => $child->url,
                    ])->values(),
                ];
            });

        return [
            ...parent::share($request),
            'name' => $company['name'] ?? config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'company' => $company,
            'theme' => $theme,
            'currency' => SiteSettings::currency(),
            'locale' => $locale,
            'availableLocales' => ['en', 'de'],
            'translations' => $this->translations($locale),
            'navigation' => [
                'header' => $nav,
            ],
        ];
    }

    protected function translations(string $locale): array
    {
        $path = lang_path("{$locale}.json");
        if (! File::exists($path)) {
            $path = lang_path('en.json');
        }

        return json_decode(File::get($path), true) ?? [];
    }
}
