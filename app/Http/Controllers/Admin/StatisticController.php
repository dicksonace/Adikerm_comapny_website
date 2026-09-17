<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Statistic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StatisticController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/statistics/index', [
            'statistics' => Statistic::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/statistics/create');
    }

    public function store(Request $request): RedirectResponse
    {
        Statistic::create($this->validated($request));

        return redirect()
            ->route('admin.statistics.index')
            ->with('success', 'Statistic created.');
    }

    public function edit(Statistic $statistic): Response
    {
        return Inertia::render('admin/statistics/edit', [
            'statistic' => $statistic,
        ]);
    }

    public function update(Request $request, Statistic $statistic): RedirectResponse
    {
        $statistic->update($this->validated($request));

        return redirect()
            ->route('admin.statistics.index')
            ->with('success', 'Statistic updated.');
    }

    public function destroy(Statistic $statistic): RedirectResponse
    {
        $statistic->delete();

        return redirect()
            ->route('admin.statistics.index')
            ->with('success', 'Statistic deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:160'],
            'value' => ['required', 'string', 'max:80'],
            'suffix' => ['nullable', 'string', 'max:40'],
            'icon' => ['nullable', 'string', 'max:120'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);

        return $data;
    }
}
