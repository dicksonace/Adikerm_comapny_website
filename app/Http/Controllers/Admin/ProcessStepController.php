<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProcessStep;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProcessStepController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/process-steps/index', [
            'steps' => ProcessStep::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/process-steps/create');
    }

    public function store(Request $request): RedirectResponse
    {
        ProcessStep::create($this->validated($request));

        return redirect()->route('admin.process-steps.index')->with('success', 'Process step added.');
    }

    public function edit(ProcessStep $processStep): Response
    {
        return Inertia::render('admin/process-steps/edit', [
            'step' => $processStep,
        ]);
    }

    public function update(Request $request, ProcessStep $processStep): RedirectResponse
    {
        $processStep->update($this->validated($request));

        return redirect()->route('admin.process-steps.index')->with('success', 'Process step updated.');
    }

    public function destroy(ProcessStep $processStep): RedirectResponse
    {
        $processStep->delete();

        return redirect()->route('admin.process-steps.index')->with('success', 'Process step deleted.');
    }

    protected function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:2000'],
            'icon' => ['nullable', 'string', 'max:60'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
