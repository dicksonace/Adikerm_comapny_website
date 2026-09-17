<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/orders/index', [
            'orders' => Order::query()
                ->with(['service:id,name', 'assignee:id,name'])
                ->latest()
                ->get(),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['service', 'assignee', 'updates.user', 'user']);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
            'admins' => User::query()
                ->where('role', 'admin')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate([
            'status' => [
                'sometimes',
                'required',
                Rule::in(['pending', 'confirmed', 'processing', 'in_progress', 'completed', 'cancelled']),
            ],
            'payment_status' => [
                'sometimes',
                'required',
                Rule::in(['unpaid', 'paid', 'partial', 'refunded']),
            ],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'admin_notes' => ['nullable', 'string'],
        ]);

        $order->update($data);

        return back()->with('success', 'Order updated.');
    }
}
