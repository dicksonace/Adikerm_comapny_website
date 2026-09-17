<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuoteRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class QuoteRequestController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/leads/index', [
            'quotes' => QuoteRequest::query()
                ->with('service:id,name')
                ->latest()
                ->get(),
        ]);
    }

    public function show(QuoteRequest $quoteRequest): Response
    {
        $quoteRequest->load('service');

        return Inertia::render('admin/leads/show', [
            'quote' => $quoteRequest,
        ]);
    }

    public function update(Request $request, QuoteRequest $quoteRequest): RedirectResponse
    {
        $data = $request->validate([
            'status' => [
                'required',
                Rule::in(['new', 'reviewed', 'contacted', 'quoted', 'accepted', 'rejected', 'archived']),
            ],
        ]);

        $quoteRequest->update($data);

        return back()->with('success', 'Quote request updated.');
    }
}
