<?php

namespace App\Services;

use App\Models\CrmActivity;
use App\Models\Customer;

class CustomerCrm
{
    public static function findOrCreateFromContact(array $data, string $source = 'website'): Customer
    {
        $email = $data['email'] ?? $data['customer_email'] ?? null;
        $name = $data['name'] ?? $data['customer_name'] ?? 'Unknown';
        $phone = $data['phone'] ?? $data['customer_phone'] ?? null;

        $customer = null;

        if ($email) {
            $customer = Customer::query()->where('email', $email)->first();
        }

        if (! $customer && $phone) {
            $customer = Customer::query()->where('phone', $phone)->first();
        }

        if ($customer) {
            $customer->fill(array_filter([
                'name' => $name,
                'phone' => $phone,
                'company' => $data['company'] ?? $customer->company,
                'last_contacted_at' => now(),
            ]));
            $customer->save();

            return $customer;
        }

        $customer = Customer::create([
            'customer_code' => Customer::nextCode(),
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'company' => $data['company'] ?? null,
            'status' => 'lead',
            'source' => $source,
            'priority' => 3,
            'country' => 'Sri Lanka',
            'last_contacted_at' => now(),
        ]);

        CrmActivity::log([
            'customer_id' => $customer->id,
            'type' => 'created',
            'title' => 'Customer created',
            'description' => "New customer from {$source}",
            'meta' => ['source' => $source],
        ]);

        return $customer;
    }
}
