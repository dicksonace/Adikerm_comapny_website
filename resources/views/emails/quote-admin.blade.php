<x-mail::message>
# New quote request

**Reference:** {{ $payload['reference'] ?? '—' }}  
**Name:** {{ $payload['name'] ?? '—' }}  
**Email:** {{ $payload['email'] ?? '—' }}  
**Phone:** {{ $payload['phone'] ?? '—' }}  
**Company:** {{ $payload['company_name'] ?? '—' }}  
**Service:** {{ $payload['service_name'] ?? '—' }}  
**Budget:** {{ $payload['budget'] ?? '—' }}  
**Deadline:** {{ $payload['preferred_deadline'] ?? '—' }}

{{ $payload['description'] ?? '' }}

<x-mail::button :url="url('/admin/leads')">
View leads
</x-mail::button>

Thanks,<br>
{{ $site['name'] ?? config('app.name') }}
</x-mail::message>
