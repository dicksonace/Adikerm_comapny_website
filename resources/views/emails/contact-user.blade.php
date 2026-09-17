<x-mail::message>
# Thanks for contacting {{ $site['name'] ?? 'us' }}

Hi {{ $payload['name'] ?? 'there' }},

We received your message and will get back to you within one business day.

@if(!empty($payload['subject']))
**Subject:** {{ $payload['subject'] }}
@endif

<x-mail::panel>
{{ $payload['message'] ?? '' }}
</x-mail::panel>

If you need anything sooner, call us at {{ $site['phone'] ?? '' }} or reply to this email.

Thanks,<br>
{{ $site['name'] ?? config('app.name') }}
</x-mail::message>
