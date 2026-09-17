<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/projects/index', [
            'projects' => Project::query()->orderBy('sort_order')->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/projects/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['cover_image'] = $this->resolveCoverImage($request);

        Project::create($data);

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project created.');
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('admin/projects/edit', [
            'project' => $project,
        ]);
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $data = $this->validated($request, $project);
        $cover = $this->resolveCoverImage($request, $project->cover_image);

        if ($cover !== null) {
            $data['cover_image'] = $cover;
        }

        $project->update($data);

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project updated.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Project $project = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'slug' => [
                'nullable',
                'string',
                'max:200',
                Rule::unique('projects', 'slug')->ignore($project?->id),
            ],
            'cover_image' => ['nullable'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'client' => ['nullable', 'string', 'max:160'],
            'category' => ['nullable', 'string', 'max:120'],
            'technologies' => ['nullable', 'array'],
            'technologies.*' => ['nullable', 'string', 'max:120'],
            'completed_at' => ['nullable', 'date'],
            'project_url' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        if ($request->hasFile('cover_image')) {
            $request->validate([
                'cover_image' => ['image', 'max:4096'],
            ]);
        } elseif ($request->filled('cover_image') && is_string($request->input('cover_image'))) {
            $request->validate([
                'cover_image' => ['string', 'max:500'],
            ]);
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $data['is_featured'] = $request->boolean('is_featured', false);
        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);

        unset($data['cover_image']);

        return $data;
    }

    private function resolveCoverImage(Request $request, ?string $fallback = null): ?string
    {
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('projects', 'public');

            return '/storage/'.$path;
        }

        if ($request->filled('cover_image') && is_string($request->input('cover_image'))) {
            return $request->input('cover_image');
        }

        return $fallback;
    }
}
