<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class StatusController extends Controller
{
    public function index()
    {
        // Dummy data for API status
        $services = [
            [
                'name' => 'Google Hotels',
                'status' => 'operational',
                'last_heartbeat' => Carbon::now()->subMinutes(5)->toISOString(),
                'uptime_24h' => 99.8,
                'uptime_7d' => 99.5,
                'avg_response_time' => 1.2,
                'request_volume' => 1250,
                'error_rate' => 0.2,
                'last_error' => null
            ],
            [
                'name' => 'Booking.com',
                'status' => 'operational',
                'last_heartbeat' => Carbon::now()->subMinutes(3)->toISOString(),
                'uptime_24h' => 99.9,
                'uptime_7d' => 99.7,
                'avg_response_time' => 1.8,
                'request_volume' => 890,
                'error_rate' => 0.1,
                'last_error' => null
            ],
            [
                'name' => 'Expedia',
                'status' => 'degraded',
                'last_heartbeat' => Carbon::now()->subMinutes(15)->toISOString(),
                'uptime_24h' => 95.2,
                'uptime_7d' => 97.8,
                'avg_response_time' => 3.5,
                'request_volume' => 650,
                'error_rate' => 4.8,
                'last_error' => 'Rate limit exceeded'
            ],
            [
                'name' => 'Hotels.com',
                'status' => 'operational',
                'last_heartbeat' => Carbon::now()->subMinutes(2)->toISOString(),
                'uptime_24h' => 99.6,
                'uptime_7d' => 99.3,
                'avg_response_time' => 2.1,
                'request_volume' => 720,
                'error_rate' => 0.4,
                'last_error' => null
            ],
            [
                'name' => 'Proxy Service',
                'status' => 'operational',
                'last_heartbeat' => Carbon::now()->subMinutes(1)->toISOString(),
                'uptime_24h' => 100.0,
                'uptime_7d' => 99.9,
                'avg_response_time' => 0.8,
                'request_volume' => 3200,
                'error_rate' => 0.0,
                'last_error' => null
            ],
            [
                'name' => 'Queue Worker',
                'status' => 'operational',
                'last_heartbeat' => Carbon::now()->subSeconds(30)->toISOString(),
                'uptime_24h' => 100.0,
                'uptime_7d' => 99.8,
                'avg_response_time' => 0.5,
                'request_volume' => 4500,
                'error_rate' => 0.1,
                'last_error' => null
            ],
            [
                'name' => 'Database',
                'status' => 'operational',
                'last_heartbeat' => Carbon::now()->subSeconds(10)->toISOString(),
                'uptime_24h' => 100.0,
                'uptime_7d' => 100.0,
                'avg_response_time' => 0.2,
                'request_volume' => 15000,
                'error_rate' => 0.0,
                'last_error' => null
            ]
        ];

        $incidents = [
            [
                'id' => 1,
                'service' => 'Expedia',
                'started_at' => Carbon::now()->subHours(2)->toISOString(),
                'ended_at' => Carbon::now()->subHour()->toISOString(),
                'summary' => 'Rate limiting issues causing increased response times',
                'status' => 'resolved'
            ],
            [
                'id' => 2,
                'service' => 'Google Hotels',
                'started_at' => Carbon::now()->subDays(3)->toISOString(),
                'ended_at' => Carbon::now()->subDays(3)->addHours(1)->toISOString(),
                'summary' => 'Temporary API endpoint changes',
                'status' => 'resolved'
            ]
        ];

        return Inertia::render('Status/Index', [
            'auth' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'avatar' => null,
                ],
            ],
            'services' => $services,
            'incidents' => $incidents,
            'overall_status' => 'operational',
            'stats' => [
                'total_services' => count($services),
                'operational_services' => count(array_filter($services, fn($service) => $service['status'] === 'operational')),
                'degraded_services' => count(array_filter($services, fn($service) => $service['status'] === 'degraded')),
                'down_services' => count(array_filter($services, fn($service) => $service['status'] === 'down')),
                'avg_uptime' => 99.2
            ]
        ]);
    }
}
