<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\QuoteRequest;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'orders_total' => Order::count(),
                'orders_pending' => Order::where('status', 'pending')->count(),
                'orders_completed' => Order::where('status', 'completed')->count(),
                'revenue' => (float) Order::where('payment_status', 'paid')->sum('amount'),
                'leads' => QuoteRequest::where('status', 'new')->count(),
                'messages' => ContactMessage::where('status', 'new')->count(),
                'subscribers' => NewsletterSubscriber::where('status', 'active')->count(),
                'services' => Service::where('is_active', true)->count(),
                'customers' => Customer::count(),
                'customers_active' => Customer::where('status', 'active')->count(),
                'employees' => Employee::where('status', 'active')->count(),
            ],
            'recentOrders' => Order::query()->latest()->take(5)->get(),
            'recentLeads' => QuoteRequest::query()->latest()->take(5)->get(),
            'recentMessages' => ContactMessage::query()->latest()->take(5)->get(),
            'recentCustomers' => Customer::query()->latest()->take(5)->get(),
        ]);
    }
}
