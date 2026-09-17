<x-mail::message>
# New service order

**Reference:** {{ $payload['reference'] ?? '—' }}  
**Service:** {{ $payload['service_name'] ?? '—' }}  
**Customer:** {{ $payload['customer_name'] ?? '—' }}  
**Email:** {{ $payload['customer_email'] ?? '—' }}  
**Phone:** {{ $payload['customer_phone'] ?? '—' }}  
**Amount:** {{ $payload['amount_label'] ?? '—' }}

{{ $payload['requirements'] ?? '' }}

<x-mail::button :url="url('/admin/orders')">
View orders
</x-mail::button>

Thanks,<br>
{{ $site['name'] ?? config('app.name') }}
</x-mail::message>
