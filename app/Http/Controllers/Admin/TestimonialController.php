<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/testimonials/index', [
            'testimonials' => Testimonial::query()->orderBy('sort_order')->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/testimonials/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['customer_image'] = $this->resolveImage($request);

        Testimonial::create($data);

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimonial created.');
    }

    public function edit(Testimonial $testimonial): Response
    {
        return Inertia::render('admin/testimonials/edit', [
            'testimonial' => $testimonial,
        ]);
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $data = $this->validated($request);
        $image = $this->resolveImage($request, $testimonial->customer_image);

        if ($image !== null) {
            $data['customer_image'] = $image;
        }

        $testimonial->update($data);

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimonial deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:160'],
            'customer_image' => ['nullable'],
            'company' => ['nullable', 'string', 'max:160'],
            'position' => ['nullable', 'string', 'max:160'],
            'content' => ['required', 'string'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        if ($request->hasFile('customer_image')) {
            $request->validate([
                'customer_image' => ['image', 'max:4096'],
            ]);
        } elseif ($request->filled('customer_image') && is_string($request->input('customer_image'))) {
            $request->validate([
                'customer_image' => ['string', 'max:500'],
            ]);
        }

        $data['rating'] = (int) ($data['rating'] ?? 5);
        $data['is_featured'] = $request->boolean('is_featured', true);
        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);

        unset($data['customer_image']);

        return $data;
    }

    private function resolveImage(Request $request, ?string $fallback = null): ?string
    {
        if ($request->hasFile('customer_image')) {
            $path = $request->file('customer_image')->store('testimonials', 'public');

            return '/storage/'.$path;
        }

        if ($request->filled('customer_image') && is_string($request->input('customer_image'))) {
            return $request->input('customer_image');
        }

        return $fallback;
    }
}
