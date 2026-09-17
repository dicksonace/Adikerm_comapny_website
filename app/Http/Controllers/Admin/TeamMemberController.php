<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamMemberController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/team/index', [
            'members' => TeamMember::query()->orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/team/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['photo'] = $this->resolvePhoto($request);

        TeamMember::create($data);

        return redirect()
            ->route('admin.team.index')
            ->with('success', 'Team member created.');
    }

    public function edit(TeamMember $teamMember): Response
    {
        return Inertia::render('admin/team/edit', [
            'member' => $teamMember,
        ]);
    }

    public function update(Request $request, TeamMember $teamMember): RedirectResponse
    {
        $data = $this->validated($request);
        $photo = $this->resolvePhoto($request, $teamMember->photo);

        if ($photo !== null) {
            $data['photo'] = $photo;
        }

        $teamMember->update($data);

        return redirect()
            ->route('admin.team.index')
            ->with('success', 'Team member updated.');
    }

    public function destroy(TeamMember $teamMember): RedirectResponse
    {
        $teamMember->delete();

        return redirect()
            ->route('admin.team.index')
            ->with('success', 'Team member deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'position' => ['required', 'string', 'max:160'],
            'department' => ['nullable', 'string', 'max:120'],
            'photo' => ['nullable'],
            'bio' => ['nullable', 'string'],
            'email' => ['nullable', 'email', 'max:160'],
            'social_links' => ['nullable', 'array'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        if ($request->hasFile('photo')) {
            $request->validate([
                'photo' => ['image', 'max:4096'],
            ]);
        } elseif ($request->filled('photo') && is_string($request->input('photo'))) {
            $request->validate([
                'photo' => ['string', 'max:500'],
            ]);
        }

        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);

        unset($data['photo']);

        return $data;
    }

    private function resolvePhoto(Request $request, ?string $fallback = null): ?string
    {
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('team', 'public');

            return '/storage/'.$path;
        }

        if ($request->filled('photo') && is_string($request->input('photo'))) {
            return $request->input('photo');
        }

        return $fallback;
    }
}
