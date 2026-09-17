<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WhyChooseUs;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WhyChooseUsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/why-choose-us/index', [
            'items' => WhyChooseUs::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/why-choose-us/create');
    }

    public function store(Request $request): RedirectResponse
    {
        WhyChooseUs::create($this->validated($request));

        return redirect()
            ->route('admin.why-choose-us.index')
            ->with('success', 'Item created.');
    }

    public function edit(WhyChooseUs $whyChooseUs): Response
    {
        return Inertia::render('admin/why-choose-us/edit', [
            'item' => $whyChooseUs,
        ]);
    }

    public function update(Request $request, WhyChooseUs $whyChooseUs): RedirectResponse
    {
        $whyChooseUs->update($this->validated($request));

        return redirect()
            ->route('admin.why-choose-us.index')
            ->with('success', 'Item updated.');
    }

    public function destroy(WhyChooseUs $whyChooseUs): RedirectResponse
    {
        $whyChooseUs->delete();

        return redirect()
            ->route('admin.why-choose-us.index')
            ->with('success', 'Item deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:120'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);

        return $data;
    }
}
