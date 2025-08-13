<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\HotelBooking;
use App\Jobs\CheckHotelPrices;
use App\Services\SerpApiService;
use Illuminate\Support\Facades\Log;


class HotelBookingController extends Controller
{
    protected $serpApiService;

    public function __construct(SerpApiService $serpApiService)
    {
        $this->serpApiService = $serpApiService;
    }

    /**
     * Display a listing of hotel bookings
     */
    public function index()
    {
        // Get actual bookings from database
        $bookings = HotelBooking::where('user_id', 1) // For demo purposes, use user ID 1
            ->orderBy('created_at', 'desc')
            ->get();

        // Add calculated fields to each booking for frontend compatibility
        $bookings->each(function ($booking) {
            $checkIn = \Carbon\Carbon::parse($booking->check_in_date);
            $checkOut = \Carbon\Carbon::parse($booking->check_out_date);
            $nights = $checkIn->diffInDays($checkOut);

            $booking->total_price = $booking->original_price;
            $booking->price_per_night = $booking->original_price / $nights;
            $booking->rooms = 1; // Default to 1 room since we don't store this
            $booking->nights = $nights;

            // Add enriched data for frontend
            $booking->enriched_data = $booking->getEnrichedData();
        });

        return Inertia::render('Bookings/Index', [
            'auth' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'avatar' => null,
                ],
            ],
            'bookings' => $bookings,
            'stats' => [
                'total_bookings' => $bookings->count(),
                'active_bookings' => $bookings->where('status', 'active')->count(),
                'paused_bookings' => $bookings->where('status', 'paused')->count(),
                'total_savings' => 0 // Will be calculated when price drops are implemented
            ]
        ]);
    }

    /**
     * Show the form for creating a new booking
     */
    public function create()
    {
        return Inertia::render('Bookings/Create', [
            'auth' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'avatar' => null,
                ],
            ],
            'currencies' => [
                'USD' => 'US Dollar',
                'EUR' => 'Euro',
                'GBP' => 'British Pound',
                'CAD' => 'Canadian Dollar',
                'JPY' => 'Japanese Yen',
                'AUD' => 'Australian Dollar',
                'CHF' => 'Swiss Franc',
                'CNY' => 'Chinese Yuan'
            ]
        ]);
    }

    /**
     * Store a newly created booking
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'hotel_name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'guests' => 'required|integer|min:1|max:10',
            'rooms' => 'nullable|integer|min:1|max:10',
            'room_type' => 'nullable|string|max:255',
            'original_price' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
        ]);

        // Calculate nights
        $checkIn = \Carbon\Carbon::parse($validated['check_in_date']);
        $checkOut = \Carbon\Carbon::parse($validated['check_out_date']);
        $nights = $checkIn->diffInDays($checkOut);

        // Create the booking
        $booking = HotelBooking::create([
            'user_id' => 1, // For demo purposes, use user ID 1
            'hotel_name' => $validated['hotel_name'],
            'location' => $validated['location'],
            'check_in_date' => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'],
            'guests' => $validated['guests'],
            'room_type' => $validated['room_type'] ?? null,
            'original_price' => $validated['original_price'],
            'current_price' => $validated['original_price'], // Initially same as original_price
            'currency' => strtoupper($validated['currency']),
            'status' => 'active',
        ]);

                // Log user input data
        Log::info('User booking data received', [
            'booking_id' => $booking->id,
            'user_input' => [
                'hotel_name' => $validated['hotel_name'],
                'location' => $validated['location'],
                'check_in_date' => $validated['check_in_date'],
                'check_out_date' => $validated['check_out_date'],
                'guests' => $validated['guests'],
                'rooms' => $validated['rooms'] ?? 1,
                'room_type' => $validated['room_type'] ?? 'N/A',
                'currency' => strtoupper($validated['currency']),
                'original_price' => $validated['original_price']
            ]
        ]);

        // Enrich booking with SerpAPI data
        try {
            Log::info('Starting SerpAPI enrichment', [
                'booking_id' => $booking->id,
                'hotel_name' => $validated['hotel_name'],
                'location' => $validated['location']
            ]);

            $enrichedData = $this->serpApiService->enrichHotelData(
                $validated['hotel_name'],
                $validated['location'],
                $validated['check_in_date'],
                $validated['check_out_date'],
                strtoupper($validated['currency'])
            );

            Log::info('SerpAPI enrichment response received', [
                'booking_id' => $booking->id,
                'enriched_data' => $enrichedData,
                'data_received' => !empty($enrichedData)
            ]);

            if ($enrichedData) {
                $booking->update($enrichedData);
                Log::info('Hotel booking enriched successfully', [
                    'booking_id' => $booking->id,
                    'hotel_name' => $validated['hotel_name'],
                    'enriched_fields' => array_keys($enrichedData),
                    'canonical_hotel_name' => $enrichedData['canonical_hotel_name'] ?? 'N/A',
                    'star_rating' => $enrichedData['star_rating'] ?? 'N/A',
                    'amenities_count' => count($enrichedData['amenities'] ?? []),
                    'facilities_count' => count($enrichedData['facilities'] ?? [])
                ]);
            } else {
                Log::warning('No enriched data returned from SerpAPI', [
                    'booking_id' => $booking->id,
                    'hotel_name' => $validated['hotel_name']
                ]);

                $booking->update([
                    'enrichment_successful' => false,
                    'enrichment_error' => 'No data returned from SerpAPI'
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to enrich hotel booking', [
                'booking_id' => $booking->id,
                'hotel_name' => $validated['hotel_name'],
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Mark enrichment as failed but don't fail the booking creation
            $booking->update([
                'enrichment_successful' => false,
                'enrichment_error' => $e->getMessage()
            ]);
        }

        // Add calculated fields to the booking for frontend compatibility
        $booking->total_price = $validated['original_price'];
        $booking->price_per_night = $validated['original_price'] / $nights;
        $booking->rooms = $validated['rooms'] ?? 1;
        $booking->nights = $nights;

        return redirect()->back()->with('success', 'Hotel booking added successfully!');
    }

    /**
     * Display the specified booking
     */
    public function show(HotelBooking $booking)
    {
        // Get enriched data for the booking
        $enrichedData = $booking->getEnrichedData();

        // Calculate additional fields
        $checkIn = \Carbon\Carbon::parse($booking->check_in_date);
        $checkOut = \Carbon\Carbon::parse($booking->check_out_date);
        $nights = $checkIn->diffInDays($checkOut);

        $bookingData = [
            'id' => $booking->id,
            'hotel_name' => $booking->hotel_name,
            'location' => $booking->location,
            'check_in_date' => $booking->check_in_date->format('Y-m-d'),
            'check_out_date' => $booking->check_out_date->format('Y-m-d'),
            'guests' => $booking->guests,
            'currency' => $booking->currency,
            'original_price' => $booking->original_price,
            'current_price' => $booking->current_price,
            'last_checked' => $booking->last_checked?->toISOString(),
            'status' => $booking->status,
            'price_drop_detected' => $booking->price_drop_detected,
            'price_drop_amount' => $booking->price_drop_amount,
            'price_drop_percentage' => $booking->price_drop_amount ? round(($booking->price_drop_amount / $booking->original_price) * 100, 1) : 0,
            'booking_reference' => $booking->booking_reference,
            'nights' => $nights,
            'price_per_night' => $booking->original_price / $nights,
            'enriched_data' => $enrichedData,
            'enrichment_successful' => $booking->enrichment_successful,
            'enriched_at' => $booking->enriched_at?->toISOString(),
        ];

        return Inertia::render('Bookings/Show', [
            'auth' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'avatar' => null,
                ],
            ],
            'booking' => $bookingData
        ]);
    }

    /**
     * Show the form for editing the specified booking
     */
    public function edit(HotelBooking $booking)
    {
        // For demo purposes, return dummy booking data
        $booking = [
            'id' => $booking->id,
            'hotel_name' => 'Fairmont Royal York',
            'location' => 'Toronto, ON',
            'check_in_date' => '2025-09-01',
            'check_out_date' => '2025-09-05',
            'guests' => 2,
            'currency' => 'CAD',
            'original_price' => 1316.00,
            'current_price' => 1184.00,
            'last_checked' => now()->subHours(2)->toISOString(),
            'status' => 'active',
            'price_drop_detected' => true,
            'price_drop_amount' => 132.00,
            'price_drop_percentage' => 10.0,
            'booking_reference' => 'FRY-2025-001',
        ];

        return Inertia::render('Bookings/Edit', [
            'auth' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'avatar' => null,
                ],
            ],
            'booking' => $booking
        ]);
    }

    /**
     * Update the specified booking
     */
    public function update(Request $request, HotelBooking $booking)
    {
        // For demo purposes, just redirect with success message
        return redirect()->route('bookings.index')->with('success', 'Hotel booking updated successfully!');
    }

    /**
     * Remove the specified booking
     */
    public function destroy(HotelBooking $booking)
    {
        try {
            $booking->delete();

            return redirect()->route('bookings.index')->with('success', 'Hotel booking deleted successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to delete hotel booking', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);

            return redirect()->route('bookings.index')->with('error', 'Failed to delete booking. Please try again.');
        }
    }

    /**
     * Check prices for all active bookings
     */
    public function checkAllPrices()
    {
        // Dispatch job to check all prices
        CheckHotelPrices::dispatch();

        return response()->json(['message' => 'Price check initiated for all active bookings']);
    }

    /**
     * Check price for a specific booking
     */
    public function checkPrice(HotelBooking $booking)
    {
        // For demo purposes, just return success message
        return response()->json(['message' => 'Price check initiated for this booking']);
    }

    /**
     * Toggle booking status
     */
    public function toggleStatus(HotelBooking $booking)
    {
        // For demo purposes, just return success message
        return response()->json([
            'message' => 'Booking status updated',
            'status' => 'active'
        ]);
    }

    /**
     * Get price history for a booking (dummy data)
     */
    public function priceHistory(HotelBooking $booking)
    {
        // Generate dummy price history
        $priceHistory = [];
        $basePrice = $booking->original_price;

        for ($i = 30; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $variation = rand(-15, 10) / 100; // ±15% variation
            $price = $basePrice * (1 + $variation);

            $priceHistory[] = [
                'date' => $date->format('Y-m-d'),
                'price' => round($price, 2),
                'currency' => $booking->currency
            ];
        }

        return response()->json($priceHistory);
    }

    /**
     * Manually trigger enrichment for a booking
     */
    public function enrichBooking(HotelBooking $booking)
    {
        try {
            $enrichedData = $this->serpApiService->enrichHotelData(
                $booking->hotel_name,
                $booking->location,
                $booking->check_in_date->format('Y-m-d'),
                $booking->check_out_date->format('Y-m-d'),
                $booking->currency
            );

            if ($enrichedData) {
                $booking->update($enrichedData);

                Log::info('Hotel booking enriched manually', [
                    'booking_id' => $booking->id,
                    'hotel_name' => $booking->hotel_name
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Booking enriched successfully',
                    'enriched_data' => $booking->getEnrichedData()
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'No enrichment data available'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Failed to enrich hotel booking manually', [
                'booking_id' => $booking->id,
                'hotel_name' => $booking->hotel_name,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Enrichment failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
