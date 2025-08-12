<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\HotelBooking;
use App\Jobs\CheckHotelPrices;
use App\Services\SerpApiService;


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
        // For demo purposes, return dummy data instead of user-specific bookings
        $bookings = collect([
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
                'last_checked' => now()->subHours(2)->toISOString(),
                'status' => 'active',
                'price_drop_detected' => true,
                'price_drop_amount' => 132.00,
                'price_drop_percentage' => 10.0,
                'booking_reference' => 'FRY-2025-001',
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
                'last_checked' => now()->subHours(6)->toISOString(),
                'status' => 'active',
                'price_drop_detected' => false,
                'price_drop_amount' => null,
                'price_drop_percentage' => 0.0,
                'booking_reference' => 'RC-NY-2025-002',
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
                'last_checked' => now()->subHours(1)->toISOString(),
                'status' => 'active',
                'price_drop_detected' => true,
                'price_drop_amount' => 85.00,
                'price_drop_percentage' => 10.0,
                'booking_reference' => 'HAB-2025-003',
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
                'last_checked' => now()->subHours(4)->toISOString(),
                'status' => 'paused',
                'price_drop_detected' => true,
                'price_drop_amount' => 15000.00,
                'price_drop_percentage' => 10.0,
                'booking_reference' => 'PHT-2025-004',
            ]
        ]);

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
                'total_savings' => $bookings->sum('price_drop_amount')
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
            'check_in_date' => 'required|date|after:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'guests' => 'required|integer|min:1|max:10',
            'currency' => 'required|string|size:3',
            'original_price' => 'required|numeric|min:0',
            'booking_reference' => 'nullable|string|max:255',
        ]);

        // Get current price from SerpAPI
        $currentPriceData = $this->serpApiService->checkHotelPrice(
            $validated['hotel_name'],
            $validated['check_in_date'],
            $validated['check_out_date'],
            $validated['currency'],
            $validated['guests']
        );

        $currentPrice = $currentPriceData['price'] ?? $currentPriceData['total_price'] ?? $validated['original_price'];

        // For demo purposes, just redirect with success message
        // In production, you would create the actual booking
        return redirect()->route('bookings.index')->with('success', 'Hotel booking added successfully!');

        return redirect()->route('bookings.index')->with('success', 'Hotel booking added successfully!');
    }

    /**
     * Display the specified booking
     */
    public function show(HotelBooking $booking)
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

        return Inertia::render('Bookings/Show', [
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
        // For demo purposes, just redirect with success message
        return redirect()->route('bookings.index')->with('success', 'Hotel booking deleted successfully!');
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
        $basePrice = 1316.00; // Fairmont Royal York price

        for ($i = 30; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $variation = rand(-15, 10) / 100; // ±15% variation
            $price = $basePrice * (1 + $variation);

            $priceHistory[] = [
                'date' => $date->format('Y-m-d'),
                'price' => round($price, 2),
                'currency' => 'CAD'
            ];
        }

        return response()->json($priceHistory);
    }
}
