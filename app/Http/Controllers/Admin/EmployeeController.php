<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmActivity;
use App\Models\CrmNote;
use App\Models\Employee;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Employee::query()->with('manager:id,name')->with('user:id,name,email');

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhere('employee_code', 'like', "%{$search}%");
            });
        }

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        if ($department = $request->string('department')->toString()) {
            $query->where('department', $department);
        }

        return Inertia::render('admin/employees/index', [
            'employees' => $query->orderBy('name')->paginate(15)->withQueryString(),
            'filters' => [
                'search' => $search ?: '',
                'status' => $status ?: '',
                'department' => $department ?: '',
            ],
            'stats' => [
                'total' => Employee::count(),
                'active' => Employee::where('status', 'active')->count(),
                'on_leave' => Employee::where('status', 'on_leave')->count(),
                'departments' => Employee::query()->whereNotNull('department')->distinct()->count('department'),
            ],
            'roles' => Employee::ROLES,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/employees/create', [
            'managers' => Employee::query()->where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'roles' => Employee::ROLES,
            'defaultPermissions' => Employee::DEFAULT_PERMISSIONS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['employee_code'] = Employee::nextCode();
        $data['permissions'] = $data['permissions']
            ?? Employee::DEFAULT_PERMISSIONS[$data['role']]
            ?? [];

        if ($request->hasFile('photo_file')) {
            $path = $request->file('photo_file')->store('employees', 'public');
            $data['photo'] = '/storage/'.$path;
        }

        unset($data['photo_file'], $data['create_login'], $data['password']);

        $employee = Employee::create($data);

        if ($request->boolean('create_login')) {
            $password = $request->input('password', 'password');
            $user = User::updateOrCreate(
                ['email' => $employee->email],
                [
                    'name' => $employee->name,
                    'password' => Hash::make($password),
                    'role' => $employee->role,
                    'phone' => $employee->phone,
                    'department' => $employee->department,
                    'job_title' => $employee->job_title,
                    'is_active' => $employee->status === 'active',
                    'email_verified_at' => now(),
                ]
            );
            $employee->update(['user_id' => $user->id]);
            $user->update(['employee_id' => $employee->id]);
        }

        CrmActivity::log([
            'employee_id' => $employee->id,
            'user_id' => $request->user()?->id,
            'type' => 'created',
            'title' => 'Employee added',
            'description' => "{$employee->name} joined the CRM employee directory.",
        ]);

        return redirect()->route('admin.employees.show', $employee)->with('success', 'Employee created.');
    }

    public function show(Employee $employee): Response
    {
        $employee->load(['manager:id,name', 'user:id,name,email', 'reports:id,name,job_title,department,status']);

        $assignedOrders = Order::query()
            ->where('assigned_to', $employee->user_id)
            ->latest()
            ->take(15)
            ->get();

        $notes = CrmNote::query()
            ->where('notable_type', Employee::class)
            ->where('notable_id', $employee->id)
            ->with('user:id,name')
            ->latest()
            ->get();

        $activities = CrmActivity::query()
            ->where('employee_id', $employee->id)
            ->latest()
            ->take(30)
            ->get();

        return Inertia::render('admin/employees/show', [
            'employee' => $employee,
            'assignedOrders' => $assignedOrders,
            'notes' => $notes,
            'activities' => $activities,
            'roles' => Employee::ROLES,
        ]);
    }

    public function edit(Employee $employee): Response
    {
        return Inertia::render('admin/employees/edit', [
            'employee' => $employee,
            'managers' => Employee::query()
                ->where('status', 'active')
                ->where('id', '!=', $employee->id)
                ->orderBy('name')
                ->get(['id', 'name']),
            'roles' => Employee::ROLES,
            'defaultPermissions' => Employee::DEFAULT_PERMISSIONS,
        ]);
    }

    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $data = $this->validated($request, $employee);
        $oldStatus = $employee->status;

        if ($request->hasFile('photo_file')) {
            $path = $request->file('photo_file')->store('employees', 'public');
            $data['photo'] = '/storage/'.$path;
        }

        unset($data['photo_file'], $data['create_login'], $data['password']);

        $employee->update($data);

        if ($employee->user) {
            $employee->user->update([
                'name' => $employee->name,
                'role' => $employee->role,
                'phone' => $employee->phone,
                'department' => $employee->department,
                'job_title' => $employee->job_title,
                'is_active' => $employee->status === 'active',
            ]);
        }

        if ($oldStatus !== $employee->status) {
            CrmActivity::log([
                'employee_id' => $employee->id,
                'user_id' => $request->user()?->id,
                'type' => 'status_changed',
                'title' => 'Employee status updated',
                'description' => "Status changed from {$oldStatus} to {$employee->status}",
            ]);
        }

        return redirect()->route('admin.employees.show', $employee)->with('success', 'Employee updated.');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        $employee->delete();

        return redirect()->route('admin.employees.index')->with('success', 'Employee removed.');
    }

    public function storeNote(Request $request, Employee $employee): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:note,call,email,meeting,task'],
            'title' => ['nullable', 'string', 'max:180'],
            'body' => ['required', 'string', 'max:5000'],
            'is_pinned' => ['sometimes', 'boolean'],
        ]);

        CrmNote::create([
            ...$data,
            'notable_type' => Employee::class,
            'notable_id' => $employee->id,
            'user_id' => $request->user()?->id,
        ]);

        return back()->with('success', 'Note saved.');
    }

    protected function validated(Request $request, ?Employee $employee = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'email' => ['required', 'email', 'max:160', Rule::unique('employees', 'email')->ignore($employee?->id)],
            'phone' => ['nullable', 'string', 'max:40'],
            'photo' => ['nullable', 'string', 'max:500'],
            'photo_file' => ['nullable', 'image', 'max:4096'],
            'department' => ['nullable', 'string', 'max:120'],
            'job_title' => ['nullable', 'string', 'max:120'],
            'employment_type' => ['required', 'in:full_time,part_time,contract,intern'],
            'role' => ['required', 'in:super_admin,manager,content_manager,sales,support,staff'],
            'permissions' => ['nullable', 'array'],
            'hired_at' => ['nullable', 'date'],
            'status' => ['required', 'in:active,on_leave,suspended,terminated'],
            'manager_id' => ['nullable', 'exists:employees,id'],
            'emergency_contact' => ['nullable', 'string', 'max:180'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'show_on_website' => ['sometimes', 'boolean'],
            'create_login' => ['sometimes', 'boolean'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);
    }
}
