<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        // Dummy data for settings
        $settings = [
            'providers' => [
                'google_hotels' => [
                    'name' => 'Google Hotels',
                    'enabled' => true,
                    'api_key' => 'sk-...',
                    'last_updated' => '2024-12-08T10:30:00Z'
                ],
                'booking_com' => [
                    'name' => 'Booking.com',
                    'enabled' => true,
                    'api_key' => 'bk-...',
                    'last_updated' => '2024-12-08T09:15:00Z'
                ],
                'expedia' => [
                    'name' => 'Expedia',
                    'enabled' => true,
                    'api_key' => 'ex-...',
                    'last_updated' => '2024-12-08T08:45:00Z'
                ],
                'hotels_com' => [
                    'name' => 'Hotels.com',
                    'enabled' => false,
                    'api_key' => null,
                    'last_updated' => null
                ]
            ],
            'alert_rules' => [
                'global_threshold' => 50.00,
                'global_percentage' => 5.0,
                'quiet_hours_start' => '22:00',
                'quiet_hours_end' => '08:00',
                'email_notifications' => true,
                'webhook_url' => 'https://hooks.slack.com/...',
                'slack_channel' => '#hotel-alerts'
            ],
            'check_frequency' => [
                'default_cadence' => '6h',
                'options' => ['1h', '3h', '6h', '12h', '24h']
            ],
            'currency' => [
                'default_currency' => 'USD',
                'supported_currencies' => ['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD'],
                'tax_inclusive' => true
            ],
            'team' => [
                'members' => [
                    [
                        'id' => 1,
                        'name' => 'John Doe',
                        'email' => 'john@example.com',
                        'role' => 'admin',
                        'joined_at' => '2024-01-15T00:00:00Z'
                    ],
                    [
                        'id' => 2,
                        'name' => 'Jane Smith',
                        'email' => 'jane@example.com',
                        'role' => 'viewer',
                        'joined_at' => '2024-03-20T00:00:00Z'
                    ]
                ],
                'roles' => ['admin', 'viewer']
            ],
            'data_retention' => [
                'retention_window' => 90,
                'auto_export' => false,
                'export_frequency' => 'monthly'
            ]
        ];

        return Inertia::render('Settings/Index', [
            'auth' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'avatar' => null,
                ],
            ],
            'settings' => $settings,
            'stats' => [
                'active_providers' => count(array_filter($settings['providers'], fn($provider) => $provider['enabled'])),
                'team_members' => count($settings['team']['members']),
                'last_backup' => '2024-12-07T23:00:00Z',
                'storage_used' => '2.3 GB'
            ]
        ]);
    }
}
