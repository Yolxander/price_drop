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
                'location' => 'Toronto, ON',
                'triggered_at' => Carbon::now()->subHours(2)->toISOString(),
                'created_at' => Carbon::now()->subHours(2)->toISOString(),
                'provider' => 'Google Hotels',
                'current_price' => 1184.00,
                'booked_price' => 1316.00,
                'delta_amount' => -132.00,
                'delta_percent' => -10.0,
                'rule_threshold' => '>$50 drop',
                'status' => 'new',
                'severity' => 'high',
                'currency' => 'USD',
                'check_in_date' => Carbon::now()->addDays(30)->toISOString()
            ],
            [
                'id' => 2,
                'booking_id' => 3,
                'hotel_name' => 'Hotel Arts Barcelona',
                'location' => 'Barcelona, Spain',
                'triggered_at' => Carbon::now()->subHours(1)->toISOString(),
                'created_at' => Carbon::now()->subHours(1)->toISOString(),
                'provider' => 'Booking.com',
                'current_price' => 765.00,
                'booked_price' => 850.00,
                'delta_amount' => -85.00,
                'delta_percent' => -10.0,
                'rule_threshold' => '>5% drop',
                'status' => 'actioned',
                'severity' => 'medium',
                'currency' => 'USD',
                'check_in_date' => Carbon::now()->addDays(45)->toISOString()
            ],
            [
                'id' => 3,
                'booking_id' => 4,
                'hotel_name' => 'Park Hyatt Tokyo',
                'location' => 'Tokyo, Japan',
                'triggered_at' => Carbon::now()->subHours(4)->toISOString(),
                'created_at' => Carbon::now()->subHours(4)->toISOString(),
                'provider' => 'Expedia',
                'current_price' => 135000.00,
                'booked_price' => 150000.00,
                'delta_amount' => -15000.00,
                'delta_percent' => -10.0,
                'rule_threshold' => '>$1000 drop',
                'status' => 'dismissed',
                'severity' => 'high',
                'currency' => 'JPY',
                'check_in_date' => Carbon::now()->addDays(60)->toISOString()
            ]
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
            'stats' => [
                'total_alerts' => count($alerts),
                'new_alerts' => count(array_filter($alerts, fn($alert) => $alert['status'] === 'new')),
                'actioned_alerts' => count(array_filter($alerts, fn($alert) => $alert['status'] === 'actioned')),
                'total_savings' => array_sum(array_column($alerts, 'delta_amount'))
            ]
        ]);
    }
}
