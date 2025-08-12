<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index()
    {
        // Dummy data for reports
        $reports = [
            [
                'id' => 1,
                'type' => 'weekly_summary',
                'title' => 'Weekly Summary Report',
                'generated_at' => Carbon::now()->subDays(1)->toISOString(),
                'period' => 'Dec 1-7, 2024',
                'summary' => [
                    'alerts_count' => 12,
                    'savings_potential' => 15267.00,
                    'top_drops' => 3,
                    'providers_reliability' => 98.5
                ]
            ],
            [
                'id' => 2,
                'type' => 'savings_realized',
                'title' => 'Savings Realized Report',
                'generated_at' => Carbon::now()->subDays(3)->toISOString(),
                'period' => 'Nov 2024',
                'summary' => [
                    'total_savings' => 45230.00,
                    'bookings_rebooked' => 8,
                    'avg_savings_per_booking' => 5653.75,
                    'success_rate' => 85.7
                ]
            ],
            [
                'id' => 3,
                'type' => 'provider_performance',
                'title' => 'Provider Performance Report',
                'generated_at' => Carbon::now()->subDays(5)->toISOString(),
                'period' => 'Last 30 days',
                'summary' => [
                    'google_hotels_uptime' => 99.2,
                    'booking_com_uptime' => 98.8,
                    'expedia_uptime' => 97.5,
                    'avg_response_time' => 2.3
                ]
            ]
        ];

        $reportTypes = [
            'weekly_summary' => [
                'name' => 'Weekly Summary',
                'description' => 'Alerts count, savings potential, top drops, providers reliability',
                'frequency' => 'Weekly'
            ],
            'savings_realized' => [
                'name' => 'Savings Realized',
                'description' => 'Sum of confirmed savings from rebooked hotels',
                'frequency' => 'Monthly'
            ],
            'provider_performance' => [
                'name' => 'Provider Performance',
                'description' => 'Uptime, response time, error rates by provider',
                'frequency' => 'Monthly'
            ],
            'coverage' => [
                'name' => 'Coverage Report',
                'description' => 'Checks per booking, skipped checks, throttling events',
                'frequency' => 'Weekly'
            ]
        ];

        return Inertia::render('Reports/Index', [
            'auth' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'avatar' => null,
                ],
            ],
            'reports' => $reports,
            'reportTypes' => $reportTypes,
            'stats' => [
                'total_reports' => count($reports),
                'reports_this_month' => 3,
                'scheduled_reports' => 2,
                'last_generated' => Carbon::now()->subDays(1)->toISOString()
            ]
        ]);
    }
}
