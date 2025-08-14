<?php

namespace App\Http\Controllers;

use App\Models\HotelBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class CalendarController extends Controller
{
    public function index()
    {
        // Get all bookings for the current user (using user ID 1 for demo purposes)
        $bookings = HotelBooking::where('user_id', 1)
            ->orderBy('check_in_date')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'hotel_name' => $booking->hotel_name,
                    'location' => $booking->location,
                    'check_in_date' => $booking->check_in_date,
                    'check_out_date' => $booking->check_out_date,
                    'status' => $booking->status,
                    'star_rating' => $booking->star_rating,
                    'current_price' => $booking->current_price,
                    'currency' => $booking->currency,
                    'price_drop_detected' => $booking->price_drop_detected,
                    'price_drop_amount' => $booking->price_drop_amount,
                    'guests' => $booking->guests,
                    'room_type' => $booking->room_type,
                ];
            });

        // Get upcoming bookings (next 7 days)
        $upcomingBookings = HotelBooking::where('user_id', 1)
            ->where('check_in_date', '>=', Carbon::now())
            ->where('check_in_date', '<=', Carbon::now()->addDays(7))
            ->orderBy('check_in_date')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'hotel_name' => $booking->hotel_name,
                    'location' => $booking->location,
                    'check_in_date' => $booking->check_in_date,
                    'check_out_date' => $booking->check_out_date,
                    'status' => $booking->status,
                    'star_rating' => $booking->star_rating,
                    'current_price' => $booking->current_price,
                    'currency' => $booking->currency,
                    'price_drop_detected' => $booking->price_drop_detected,
                    'price_drop_amount' => $booking->price_drop_amount,
                    'guests' => $booking->guests,
                    'room_type' => $booking->room_type,
                ];
            });

        return Inertia::render('Calendar/Index', [
            'auth' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'avatar' => null,
                ],
            ],
            'bookings' => $bookings,
            'upcomingBookings' => $upcomingBookings,
        ]);
    }
}
