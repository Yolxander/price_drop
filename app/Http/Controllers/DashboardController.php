<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Dummy data for hotel bookings
        $hotelBookings = [
            [
                'id' => 1,
                'hotel_name' => 'Fairmont Royal York',
                'location' => 'Toronto, ON',
                'check_in_date' => '2025-09-01',
                'check_out_date' => '2025-09-05',
                'guests' => 2,
                'currency' => 'CAD',
                'original_price' => 1316.00,
                'current_price' => 1184.00,
                'last_checked' => Carbon::now()->subHours(2)->toISOString(),
                'status' => 'active',
                'price_drop_detected' => true,
                'price_drop_amount' => 132.00,
                'booking_reference' => 'FRY-2025-001',
                'price_drop_percentage' => 10.0
            ],
            [
                'id' => 2,
                'hotel_name' => 'The Ritz-Carlton',
                'location' => 'New York, NY',
                'check_in_date' => '2025-10-15',
                'check_out_date' => '2025-10-18',
                'guests' => 2,
                'currency' => 'USD',
                'original_price' => 1200.00,
                'current_price' => 1200.00,
                'last_checked' => Carbon::now()->subHours(6)->toISOString(),
                'status' => 'active',
                'price_drop_detected' => false,
                'price_drop_amount' => null,
                'booking_reference' => 'RC-NY-2025-002',
                'price_drop_percentage' => 0.0
            ],
            [
                'id' => 3,
                'hotel_name' => 'Hotel Arts Barcelona',
                'location' => 'Barcelona, Spain',
                'check_in_date' => '2025-11-20',
                'check_out_date' => '2025-11-25',
                'guests' => 3,
                'currency' => 'EUR',
                'original_price' => 850.00,
                'current_price' => 765.00,
                'last_checked' => Carbon::now()->subHours(1)->toISOString(),
                'status' => 'active',
                'price_drop_detected' => true,
                'price_drop_amount' => 85.00,
                'booking_reference' => 'HAB-2025-003',
                'price_drop_percentage' => 10.0
            ],
            [
                'id' => 4,
                'hotel_name' => 'Park Hyatt Tokyo',
                'location' => 'Tokyo, Japan',
                'check_in_date' => '2025-12-10',
                'check_out_date' => '2025-12-15',
                'guests' => 2,
                'currency' => 'JPY',
                'original_price' => 150000.00,
                'current_price' => 135000.00,
                'last_checked' => Carbon::now()->subHours(4)->toISOString(),
                'status' => 'active',
                'price_drop_detected' => true,
                'price_drop_amount' => 15000.00,
                'booking_reference' => 'PHT-2025-004',
                'price_drop_percentage' => 10.0
            ]
        ];

        // Calculate dashboard stats
        $totalBookings = count($hotelBookings);
        $activeBookings = count(array_filter($hotelBookings, fn($booking) => $booking['status'] === 'active'));
        $priceDropsDetected = count(array_filter($hotelBookings, fn($booking) => $booking['price_drop_detected']));
        $totalSavings = array_sum(array_column(array_filter($hotelBookings, fn($booking) => $booking['price_drop_detected']), 'price_drop_amount'));

        // Recent price checks
        $recentChecks = [
            [
                'id' => 1,
                'hotel_name' => 'Fairmont Royal York',
                'check_time' => Carbon::now()->subHours(2)->toISOString(),
                'price_change' => -132.00,
                'percentage_change' => -10.0,
                'status' => 'drop'
            ],
            [
                'id' => 2,
                'hotel_name' => 'Hotel Arts Barcelona',
                'check_time' => Carbon::now()->subHours(1)->toISOString(),
                'price_change' => -85.00,
                'percentage_change' => -10.0,
                'status' => 'drop'
            ],
            [
                'id' => 3,
                'hotel_name' => 'Park Hyatt Tokyo',
                'check_time' => Carbon::now()->subHours(4)->toISOString(),
                'price_change' => -15000.00,
                'percentage_change' => -10.0,
                'status' => 'drop'
            ],
            [
                'id' => 4,
                'hotel_name' => 'The Ritz-Carlton',
                'check_time' => Carbon::now()->subHours(6)->toISOString(),
                'price_change' => 0.00,
                'percentage_change' => 0.0,
                'status' => 'stable'
            ]
        ];

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'avatar' => null,
                ],
            ],
            'stats' => [
                'total_bookings' => $totalBookings,
                'active_bookings' => $activeBookings,
                'price_drops_detected' => $priceDropsDetected,
                'total_savings' => $totalSavings
            ],
            'hotel_bookings' => $hotelBookings,
            'recent_checks' => $recentChecks
        ]);
    }
}
