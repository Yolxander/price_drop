<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\HotelBooking;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Get actual bookings from database for the authenticated user
        $hotelBookings = HotelBooking::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Add calculated fields to each booking for frontend compatibility
        $hotelBookings->each(function ($booking) {
            $checkIn = Carbon::parse($booking->check_in_date);
            $checkOut = Carbon::parse($booking->check_out_date);
            $nights = $checkIn->diffInDays($checkOut);

            $booking->total_price = $booking->original_price;
            $booking->price_per_night = $booking->original_price / $nights;
            $booking->rooms = 1; // Default to 1 room since we don't store this
            $booking->nights = $nights;

            // Add enriched data for frontend
            $booking->enriched_data = $booking->getEnrichedData();
        });

        // Calculate dashboard stats
        $totalBookings = $hotelBookings->count();
        $activeBookings = $hotelBookings->where('status', 'active')->count();
        $priceDropsDetected = $hotelBookings->where('price_drop_detected', true)->count();
        $totalSavings = $hotelBookings->sum('price_drop_amount');

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
                'user' => $user
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
