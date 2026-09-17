<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmActivity;
use App\Models\CrmNote;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Customer::query()
            ->with('assignee:id,name')
            ->withCount(['orders', 'quoteRequests']);

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('customer_code', 'like', "%{$search}%");
            });
        }

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        return Inertia::render('admin/customers/index', [
            'customers' => $query->latest()->paginate(15)->withQueryString(),
            'filters' => [
                'search' => $search ?: '',
                'status' => $status ?: '',
            ],
            'stats' => [
                'total' => Customer::count(),
                'leads' => Customer::where('status', 'lead')->count(),
                'active' => Customer::where('status', 'active')->count(),
                'vip' => Customer::where('status', 'vip')->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/customers/create', [
            'staff' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['customer_code'] = Customer::nextCode();

        $customer = Customer::create($data);

        CrmActivity::log([
            'customer_id' => $customer->id,
            'user_id' => $request->user()?->id,
            'type' => 'created',
            'title' => 'Customer created in CRM',
            'description' => $customer->name.' was added manually.',
        ]);

        return redirect()->route('admin.customers.show', $customer)->with('success', 'Customer created.');
    }

    public function show(Customer $customer): Response
    {
        $customer->load([
            'assignee:id,name,email',
            'orders' => fn ($q) => $q->latest()->take(20),
            'quoteRequests' => fn ($q) => $q->latest()->take(20),
            'contactMessages' => fn ($q) => $q->latest()->take(20),
            'activities' => fn ($q) => $q->latest()->take(30),
        ]);

        $notes = CrmNote::query()
            ->where('notable_type', Customer::class)
            ->where('notable_id', $customer->id)
            ->with('user:id,name')
            ->latest()
            ->get();

        return Inertia::render('admin/customers/show', [
            'customer' => $customer,
            'notes' => $notes,
            'staff' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function edit(Customer $customer): Response
    {
        return Inertia::render('admin/customers/edit', [
            'customer' => $customer,
            'staff' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $data = $this->validated($request);
        $oldStatus = $customer->status;

        $customer->update($data);

        if ($oldStatus !== $customer->status) {
            CrmActivity::log([
                'customer_id' => $customer->id,
                'user_id' => $request->user()?->id,
                'type' => 'status_changed',
                'title' => 'Status updated',
                'description' => "Status changed from {$oldStatus} to {$customer->status}",
            ]);
        }

        return redirect()->route('admin.customers.show', $customer)->with('success', 'Customer updated.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->delete();

        return redirect()->route('admin.customers.index')->with('success', 'Customer deleted.');
    }

    public function storeNote(Request $request, Customer $customer): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:note,call,email,meeting,task'],
            'title' => ['nullable', 'string', 'max:180'],
            'body' => ['required', 'string', 'max:5000'],
            'is_pinned' => ['sometimes', 'boolean'],
            'remind_at' => ['nullable', 'date'],
        ]);

        CrmNote::create([
            ...$data,
            'notable_type' => Customer::class,
            'notable_id' => $customer->id,
            'user_id' => $request->user()?->id,
        ]);

        $customer->update(['last_contacted_at' => now()]);

        CrmActivity::log([
            'customer_id' => $customer->id,
            'user_id' => $request->user()?->id,
            'type' => 'note_added',
            'title' => 'CRM note added',
            'description' => ($data['title'] ?: ucfirst($data['type'])).' logged on customer profile.',
        ]);

        return back()->with('success', 'Note saved.');
    }

    protected function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'email' => ['nullable', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:40'],
            'whatsapp' => ['nullable', 'string', 'max:40'],
            'company' => ['nullable', 'string', 'max:160'],
            'job_title' => ['nullable', 'string', 'max:120'],
            'website' => ['nullable', 'string', 'max:255'],
            'address_line' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:120'],
            'country' => ['nullable', 'string', 'max:120'],
            'status' => ['required', 'in:lead,prospect,active,inactive,vip'],
            'source' => ['nullable', 'string', 'max:80'],
            'priority' => ['nullable', 'integer', 'min:1', 'max:5'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'tags' => ['nullable', 'array'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);
    }
}
