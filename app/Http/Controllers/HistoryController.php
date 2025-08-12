<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class HistoryController extends Controller
{
    public function index()
    {
        // Dummy data for price history
        $priceChecks = [
            [
                'id' => 1,
                'booking_id' => 1,
                'hotel_name' => 'Fairmont Royal York',
                'provider' => 'Google Hotels',
                'price' => 1184.00,
                'taxes_fees' => 150.00,
                'currency' => 'CAD',
                'scraped_at' => Carbon::now()->subHours(2)->toISOString(),
                'diff_vs_booked' => -132.00,
                'diff_vs_last' => -50.00,
                'status' => 'success'
            ],
            [
                'id' => 2,
                'booking_id' => 1,
                'hotel_name' => 'Fairmont Royal York',
                'provider' => 'Booking.com',
                'price' => 1234.00,
                'taxes_fees' => 160.00,
                'currency' => 'CAD',
                'scraped_at' => Carbon::now()->subHours(4)->toISOString(),
                'diff_vs_booked' => -82.00,
                'diff_vs_last' => 20.00,
                'status' => 'success'
            ],
            [
                'id' => 3,
                'booking_id' => 3,
                'hotel_name' => 'Hotel Arts Barcelona',
                'provider' => 'Expedia',
                'price' => 765.00,
                'taxes_fees' => 85.00,
                'currency' => 'EUR',
                'scraped_at' => Carbon::now()->subHours(1)->toISOString(),
                'diff_vs_booked' => -85.00,
                'diff_vs_last' => -30.00,
                'status' => 'success'
            ],
            [
                'id' => 4,
                'booking_id' => 4,
                'hotel_name' => 'Park Hyatt Tokyo',
                'provider' => 'Hotels.com',
                'price' => 135000.00,
                'taxes_fees' => 15000.00,
                'currency' => 'JPY',
                'scraped_at' => Carbon::now()->subHours(6)->toISOString(),
                'diff_vs_booked' => -15000.00,
                'diff_vs_last' => -5000.00,
                'status' => 'success'
            ]
        ];

        $filters = [
            'providers' => ['Google Hotels', 'Booking.com', 'Expedia', 'Hotels.com'],
            'cities' => ['Toronto', 'New York', 'Barcelona', 'Tokyo'],
            'date_range' => [
                'start' => Carbon::now()->subDays(30)->format('Y-m-d'),
                'end' => Carbon::now()->format('Y-m-d')
            ]
        ];

        $chartData = [
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            'datasets' => [
                [
                    'label' => 'Average Price',
                    'data' => [1200, 1180, 1220, 1190, 1170, 1150],
                    'borderColor' => '#3b82f6',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)'
                ]
            ]
        ];

        return Inertia::render('History/Index', [
            'auth' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'avatar' => null,
                ],
            ],
            'priceChecks' => $priceChecks,
            'filters' => $filters,
            'chartData' => $chartData,
            'stats' => [
                'total_checks' => count($priceChecks),
                'avg_price_change' => -8.5,
                'total_savings' => 15267.00,
                'providers_checked' => 4
            ]
        ]);
    }
}
