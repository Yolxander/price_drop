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
        // Get all bookings for the current user (using dummy user ID 3 for demo purposes)
        $bookings = HotelBooking::where('user_id', 3)
            ->orderBy('check_in_date')
            ->get()
            ->map(function ($booking) {
                $checkIn = Carbon::parse($booking->check_in_date);
                $checkOut = Carbon::parse($booking->check_out_date);
                $nights = $checkIn->diffInDays($checkOut);

                return [
                    'id' => $booking->id,
                    'hotel_name' => $booking->hotel_name,
                    'canonical_hotel_name' => $booking->canonical_hotel_name,
                    'location' => $booking->location,
                    'address' => $booking->address,
                    'check_in_date' => $booking->check_in_date,
                    'check_out_date' => $booking->check_out_date,
                    'status' => $booking->status,
                    'star_rating' => $booking->star_rating,
                    'original_price' => $booking->original_price,
                    'current_price' => $booking->current_price,
                    'currency' => $booking->currency,
                    'price_drop_detected' => $booking->price_drop_detected,
                    'price_drop_amount' => $booking->price_drop_amount,
                    'guests' => $booking->guests,
                    'room_type' => $booking->room_type,
                    'room_description' => $booking->room_description,
                    'nights' => $nights,
                    'total_price' => $booking->original_price,
                    'price_per_night' => $booking->original_price / $nights,
                    'booking_reference' => $booking->booking_reference,
                    'booking_link' => $booking->booking_link,
                    'hotel_website' => $booking->hotel_website,
                    'cancellation_policy' => $booking->cancellation_policy,
                    'breakfast_included' => $booking->breakfast_included,
                    'amenities' => $booking->amenities,
                    'facilities' => $booking->facilities,
                    'screenshots' => $booking->screenshots,
                    'last_checked' => $booking->last_checked,
                    'enriched_data' => $booking->getEnrichedData(),
                ];
            });

        // Get upcoming bookings (next 7 days)
        $upcomingBookings = HotelBooking::where('user_id', 3)
            ->where('check_in_date', '>=', Carbon::now())
            ->where('check_in_date', '<=', Carbon::now()->addDays(7))
            ->orderBy('check_in_date')
            ->get()
            ->map(function ($booking) {
                $checkIn = Carbon::parse($booking->check_in_date);
                $checkOut = Carbon::parse($booking->check_out_date);
                $nights = $checkIn->diffInDays($checkOut);

                return [
                    'id' => $booking->id,
                    'hotel_name' => $booking->hotel_name,
                    'canonical_hotel_name' => $booking->canonical_hotel_name,
                    'location' => $booking->location,
                    'address' => $booking->address,
                    'check_in_date' => $booking->check_in_date,
                    'check_out_date' => $booking->check_out_date,
                    'status' => $booking->status,
                    'star_rating' => $booking->star_rating,
                    'original_price' => $booking->original_price,
                    'current_price' => $booking->current_price,
                    'currency' => $booking->currency,
                    'price_drop_detected' => $booking->price_drop_detected,
                    'price_drop_amount' => $booking->price_drop_amount,
                    'guests' => $booking->guests,
                    'room_type' => $booking->room_type,
                    'room_description' => $booking->room_description,
                    'nights' => $nights,
                    'total_price' => $booking->original_price,
                    'price_per_night' => $booking->original_price / $nights,
                    'booking_reference' => $booking->booking_reference,
                    'booking_link' => $booking->booking_link,
                    'hotel_website' => $booking->hotel_website,
                    'cancellation_policy' => $booking->cancellation_policy,
                    'breakfast_included' => $booking->breakfast_included,
                    'amenities' => $booking->amenities,
                    'facilities' => $booking->facilities,
                    'screenshots' => $booking->screenshots,
                    'last_checked' => $booking->last_checked,
                    'enriched_data' => $booking->getEnrichedData(),
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
