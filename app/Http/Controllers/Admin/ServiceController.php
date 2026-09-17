<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/services/index', [
            'services' => Service::query()->orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/services/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['image'] = $this->resolveImage($request);

        Service::create($data);

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service created.');
    }

    public function edit(Service $service): Response
    {
        return Inertia::render('admin/services/edit', [
            'service' => $service,
        ]);
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $data = $this->validated($request, $service);
        $image = $this->resolveImage($request, $service->image);

        if ($image !== null) {
            $data['image'] = $image;
        }

        $service->update($data);

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service updated.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Service $service = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'slug' => [
                'nullable',
                'string',
                'max:160',
                Rule::unique('services', 'slug')->ignore($service?->id),
            ],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:120'],
            'image' => ['nullable'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'price_label' => ['nullable', 'string', 'max:120'],
            'features' => ['nullable', 'array'],
            'features.*' => ['nullable', 'string', 'max:255'],
            'cta_text' => ['nullable', 'string', 'max:120'],
            'cta_url' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => ['image', 'max:4096'],
            ]);
        } elseif ($request->filled('image') && is_string($request->input('image'))) {
            $request->validate([
                'image' => ['string', 'max:500'],
            ]);
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $data['is_active'] = $request->boolean('is_active', true);
        $data['is_featured'] = $request->boolean('is_featured', false);
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);

        unset($data['image']);

        return $data;
    }

    private function resolveImage(Request $request, ?string $fallback = null): ?string
    {
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('services', 'public');

            return '/storage/'.$path;
        }

        if ($request->filled('image') && is_string($request->input('image'))) {
            return $request->input('image');
        }

        return $fallback;
    }
}
