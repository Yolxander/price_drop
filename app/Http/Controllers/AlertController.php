<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AlertController extends Controller
{
    public function index()
    {
        // Dummy data for price alerts
        $alerts = [
            [
                'id' => 1,
                'booking_id' => 1,
                'hotel_name' => 'Fairmont Royal York',
                'triggered_at' => Carbon::now()->subHours(2)->toISOString(),
                'provider' => 'Google Hotels',
                'old_price' => 1316.00,
                'new_price' => 1184.00,
                'delta_amount' => -132.00,
                'delta_percent' => -10.0,
                'rule_threshold' => '>$50 drop',
                'status' => 'new',
                'severity' => 'high'
            ],
            [
                'id' => 2,
                'booking_id' => 3,
                'hotel_name' => 'Hotel Arts Barcelona',
                'triggered_at' => Carbon::now()->subHours(1)->toISOString(),
                'provider' => 'Booking.com',
                'old_price' => 850.00,
                'new_price' => 765.00,
                'delta_amount' => -85.00,
                'delta_percent' => -10.0,
                'rule_threshold' => '>5% drop',
                'status' => 'actioned',
                'severity' => 'medium'
            ],
            [
                'id' => 3,
                'booking_id' => 4,
                'hotel_name' => 'Park Hyatt Tokyo',
                'triggered_at' => Carbon::now()->subHours(4)->toISOString(),
                'provider' => 'Expedia',
                'old_price' => 150000.00,
                'new_price' => 135000.00,
                'delta_amount' => -15000.00,
                'delta_percent' => -10.0,
                'rule_threshold' => '>$1000 drop',
                'status' => 'dismissed',
                'severity' => 'high'
            ]
        ];

        $filters = [
            'status' => ['new', 'actioned', 'dismissed'],
            'severity' => ['low', 'medium', 'high'],
            'providers' => ['Google Hotels', 'Booking.com', 'Expedia', 'Hotels.com']
        ];

        return Inertia::render('Alerts/Index', [
            'auth' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'avatar' => null,
                ],
            ],
            'alerts' => $alerts,
            'filters' => $filters,
            'stats' => [
                'total_alerts' => count($alerts),
                'new_alerts' => count(array_filter($alerts, fn($alert) => $alert['status'] === 'new')),
                'actioned_alerts' => count(array_filter($alerts, fn($alert) => $alert['status'] === 'actioned')),
                'total_savings' => array_sum(array_column($alerts, 'delta_amount'))
            ]
        ]);
    }
}
