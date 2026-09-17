<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/messages/index', [
            'messages' => ContactMessage::query()->latest()->get(),
        ]);
    }

    public function show(ContactMessage $contactMessage): Response
    {
        if ($contactMessage->status === 'new' && $contactMessage->read_at === null) {
            $contactMessage->update([
                'status' => 'read',
                'read_at' => now(),
            ]);
        }

        return Inertia::render('admin/messages/show', [
            'message' => $contactMessage->fresh(),
        ]);
    }

    public function update(Request $request, ContactMessage $contactMessage): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['new', 'read', 'archived'])],
        ]);

        if ($data['status'] === 'read' && $contactMessage->read_at === null) {
            $data['read_at'] = now();
        }

        if ($data['status'] === 'new') {
            $data['read_at'] = null;
        }

        $contactMessage->update($data);

        return back()->with('success', 'Message updated.');
    }
}
