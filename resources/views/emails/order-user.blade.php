<x-mail::message>
# Order received

Hi {{ $payload['customer_name'] ?? 'there' }},

We received your service request for **{{ $payload['service_name'] ?? 'your project' }}**.

**Your reference:** {{ $payload['reference'] ?? '—' }}

Our team will review your requirements and confirm the next steps shortly.

<x-mail::panel>
{{ $payload['requirements'] ?? '' }}
</x-mail::panel>

Questions? Reply to this email or call {{ $site['phone'] ?? '' }}.

Thanks,<br>
{{ $site['name'] ?? config('app.name') }}
</x-mail::message>
