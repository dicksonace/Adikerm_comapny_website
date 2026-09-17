<x-mail::message>
# You are subscribed

Hi{{ !empty($payload['name']) ? ' '.$payload['name'] : '' }},

Thanks for subscribing to updates from {{ $site['name'] ?? 'us' }}. You will receive news, project updates, and announcements. You can unsubscribe anytime by contacting us.

Thanks,<br>
{{ $site['name'] ?? config('app.name') }}
</x-mail::message>
