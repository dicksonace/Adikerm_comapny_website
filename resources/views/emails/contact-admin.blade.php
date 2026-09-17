<x-mail::message>
# New contact message

**Name:** {{ $payload['name'] ?? '—' }}  
**Email:** {{ $payload['email'] ?? '—' }}  
**Phone:** {{ $payload['phone'] ?? '—' }}  
**Subject:** {{ $payload['subject'] ?? '—' }}

{{ $payload['message'] ?? '' }}

<x-mail::button :url="url('/admin/messages')">
View in admin
</x-mail::button>

Thanks,<br>
{{ $site['name'] ?? config('app.name') }}
</x-mail::message>
