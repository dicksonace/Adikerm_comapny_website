<?php

namespace App\Http\Controllers;

use App\Http\Middleware\SetLocale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public function switch(Request $request, string $locale): JsonResponse|RedirectResponse
    {
        if (! in_array($locale, SetLocale::LOCALES, true)) {
            $locale = 'en';
        }

        $request->session()->put('locale', $locale);
        app()->setLocale($locale);

        $cookie = cookie()->forever('locale', $locale);

        // Axios-style: set locale once, frontend does a single soft reload.
        if ($request->expectsJson() || $request->wantsJson() || $request->ajax()) {
            return response()
                ->json(['success' => true, 'locale' => $locale])
                ->withCookie($cookie);
        }

        return back()->withCookie($cookie);
    }
}
