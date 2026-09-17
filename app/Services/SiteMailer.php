<?php

namespace App\Services;

use App\Mail\SiteNotificationMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SiteMailer
{
    /**
     * Send admin + optional customer emails. Failures are logged so form saves still succeed.
     *
     * @param  array<string, mixed>  $payload
     */
    public static function notify(string $event, array $payload): void
    {
        $site = SiteSettings::company();
        $payload['site'] = $site;
        $adminEmail = $site['email'] ?? config('mail.from.address');

        $map = [
            'contact' => [
                'admin' => ['subject' => 'New contact message — '.$site['name'], 'view' => 'emails.contact-admin'],
                'user' => ['subject' => 'We received your message — '.$site['name'], 'view' => 'emails.contact-user'],
                'user_email_key' => 'email',
            ],
            'quote' => [
                'admin' => ['subject' => 'New quote request '.$payload['reference'].' — '.$site['name'], 'view' => 'emails.quote-admin'],
                'user' => ['subject' => 'Quote request '.$payload['reference'].' received — '.$site['name'], 'view' => 'emails.quote-user'],
                'user_email_key' => 'email',
            ],
            'order' => [
                'admin' => ['subject' => 'New order '.$payload['reference'].' — '.$site['name'], 'view' => 'emails.order-admin'],
                'user' => ['subject' => 'Order '.$payload['reference'].' received — '.$site['name'], 'view' => 'emails.order-user'],
                'user_email_key' => 'customer_email',
            ],
            'newsletter' => [
                'admin' => ['subject' => 'New newsletter subscriber — '.$site['name'], 'view' => 'emails.newsletter-admin'],
                'user' => ['subject' => 'You are subscribed — '.$site['name'], 'view' => 'emails.newsletter-user'],
                'user_email_key' => 'email',
            ],
        ];

        if (! isset($map[$event])) {
            return;
        }

        $config = $map[$event];

        self::safeSend($adminEmail, $config['admin']['subject'], $config['admin']['view'], $payload);

        $userKey = $config['user_email_key'];
        $userEmail = $payload[$userKey] ?? null;
        if (is_string($userEmail) && filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
            self::safeSend($userEmail, $config['user']['subject'], $config['user']['view'], $payload);
        }
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    protected static function safeSend(string $to, string $subject, string $view, array $payload): void
    {
        try {
            Mail::to($to)->send(new SiteNotificationMail($subject, $view, $payload));
        } catch (Throwable $e) {
            Log::warning('Site mail failed', [
                'to' => $to,
                'subject' => $subject,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
