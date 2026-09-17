<x-mail::message>
# New newsletter subscriber

**Email:** {{ $payload['email'] ?? '—' }}  
**Name:** {{ $payload['name'] ?? '—' }}

Thanks,<br>
{{ $site['name'] ?? config('app.name') }}
</x-mail::message>
