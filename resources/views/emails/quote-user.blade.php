<x-mail::message>
# Quote request received

Hi {{ $payload['name'] ?? 'there' }},

Thanks for requesting a quote from {{ $site['name'] ?? 'us' }}.

**Your reference:** {{ $payload['reference'] ?? '—' }}

Keep this reference for follow-ups. We will review your details and reply with next steps soon.

@if(!empty($payload['service_name']))
**Service:** {{ $payload['service_name'] }}
@endif

<x-mail::panel>
{{ $payload['description'] ?? '' }}
</x-mail::panel>

Thanks,<br>
{{ $site['name'] ?? config('app.name') }}
</x-mail::message>
