<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\CrmActivity;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\QuoteRequest;
use App\Models\Service;
use App\Services\CustomerCrm;
use App\Services\SiteMailer;
use App\Services\SiteSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FormController extends Controller
{
    public function contact(Request $request): JsonResponse|RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:40'],
            'subject' => ['nullable', 'string', 'max:180'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $customer = CustomerCrm::findOrCreateFromContact($data, 'contact_form');

        ContactMessage::create([
            ...$data,
            'customer_id' => $customer->id,
        ]);

        CrmActivity::log([
            'customer_id' => $customer->id,
            'type' => 'contacted',
            'title' => 'Contact form submitted',
            'description' => $data['subject'] ?: 'New website contact message',
        ]);

        SiteMailer::notify('contact', $data);

        $message = 'Thanks — your message has been sent. We will get back to you soon.';

        return $this->formResponse($request, $message);
    }

    public function quote(Request $request): JsonResponse|RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:40'],
            'company' => ['nullable', 'string', 'max:160'],
            'service_id' => ['nullable', 'exists:services,id'],
            'budget' => ['nullable', 'string', 'max:80'],
            'description' => ['required', 'string', 'max:5000'],
            'preferred_deadline' => ['nullable', 'date'],
            'attachment' => ['nullable', 'file', 'max:10240'],
        ]);

        $customer = CustomerCrm::findOrCreateFromContact($data, 'quote_request');
        if ($customer->status === 'lead') {
            $customer->update(['status' => 'prospect']);
        }

        $serviceName = null;
        if (! empty($data['service_id'])) {
            $serviceName = Service::find($data['service_id'])?->name;
        }

        $path = null;
        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('quote-attachments', 'public');
        }

        $quote = QuoteRequest::create([
            ...collect($data)->except('attachment')->all(),
            'customer_id' => $customer->id,
            'reference' => 'QT-'.strtoupper(Str::random(8)),
            'service_name' => $serviceName,
            'attachment' => $path,
            'status' => 'new',
        ]);

        CrmActivity::log([
            'customer_id' => $customer->id,
            'type' => 'quote_requested',
            'subject_type' => QuoteRequest::class,
            'subject_id' => $quote->id,
            'title' => 'Quote requested',
            'description' => "Quote {$quote->reference}".($serviceName ? " for {$serviceName}" : ''),
        ]);

        SiteMailer::notify('quote', [
            ...$data,
            'reference' => $quote->reference,
            'service_name' => $serviceName,
            'company_name' => $data['company'] ?? null,
        ]);

        $message = "Quote request submitted. Reference: {$quote->reference}";

        return $this->formResponse($request, $message, $quote->reference);
    }

    public function order(Request $request): JsonResponse|RedirectResponse
    {
        $data = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_email' => ['required', 'email', 'max:160'],
            'customer_phone' => ['nullable', 'string', 'max:40'],
            'requirements' => ['required', 'string', 'max:5000'],
            'options' => ['nullable', 'array'],
            'attachments.*' => ['nullable', 'file', 'max:10240'],
        ]);

        $service = Service::findOrFail($data['service_id']);
        $customer = CustomerCrm::findOrCreateFromContact($data, 'order');
        $customer->update(['status' => 'active']);

        $files = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $files[] = $file->store('order-attachments', 'public');
            }
        }

        $currency = SiteSettings::currency();
        $order = Order::create([
            'reference' => 'ORD-'.strtoupper(Str::random(8)),
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'service_name' => $service->name,
            'customer_name' => $data['customer_name'],
            'customer_email' => $data['customer_email'],
            'customer_phone' => $data['customer_phone'] ?? null,
            'requirements' => $data['requirements'],
            'options' => $data['options'] ?? null,
            'attachments' => $files,
            'amount' => $service->price,
            'currency' => $currency['code'] ?? 'USD',
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);

        if ($service->price) {
            $customer->increment('lifetime_value', (float) $service->price);
        }

        CrmActivity::log([
            'customer_id' => $customer->id,
            'type' => 'order_placed',
            'subject_type' => Order::class,
            'subject_id' => $order->id,
            'title' => 'Order placed',
            'description' => "Order {$order->reference} for {$service->name}",
        ]);

        $amountLabel = $service->price
            ? (($currency['symbol'] ?? '$').number_format((float) $service->price, 2))
            : ($service->price_label ?: 'Custom quote');

        SiteMailer::notify('order', [
            ...$data,
            'reference' => $order->reference,
            'service_name' => $service->name,
            'amount_label' => $amountLabel,
        ]);

        $message = "Order received. Your reference number is {$order->reference}.";

        return $this->formResponse($request, $message, $order->reference);
    }

    public function newsletter(Request $request): JsonResponse|RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:160'],
            'name' => ['nullable', 'string', 'max:120'],
        ]);

        NewsletterSubscriber::updateOrCreate(
            ['email' => $data['email']],
            [
                'name' => $data['name'] ?? null,
                'status' => 'active',
                'subscribed_at' => now(),
            ]
        );

        SiteMailer::notify('newsletter', $data);

        $message = 'You are subscribed to our newsletter.';

        return $this->formResponse($request, $message);
    }

    protected function formResponse(Request $request, string $message, ?string $reference = null): JsonResponse|RedirectResponse
    {
        if ($request->expectsJson() || $request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'reference' => $reference,
            ]);
        }

        return back()->with('success', $message);
    }
}
