<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PriceAlert;
use App\Models\HotelBooking;
use App\Models\AlertSetting;
use App\Services\SerpApiService;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AlertController extends Controller
{
    protected $serpApiService;

    public function __construct(SerpApiService $serpApiService)
    {
        $this->serpApiService = $serpApiService;
    }

    /**
     * Get the first available user ID or create a default user
     */
    private function getFirstUserId()
    {
        $user = \App\Models\User::first();

        if (!$user) {
            // Create a default user if none exists
            $user = \App\Models\User::create([
                'name' => 'Default User',
                'email' => 'default@pricepulse.com',
                'password' => bcrypt('password123'),
            ]);
        }

        return $user->id;
    }

    /**
     * Display a listing of price alerts
     */
    public function index()
    {
        $userId = $this->getFirstUserId();

        $alerts = PriceAlert::where('user_id', $userId)
            ->with('hotelBooking')
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total_alerts' => $alerts->count(),
            'unread_alerts' => $alerts->where('is_read', false)->count(),
            'actioned_alerts' => $alerts->where('is_actioned', true)->count(),
            'total_savings' => $alerts->sum('delta_amount')
        ];

        return Inertia::render('Alerts/Index', [
            'auth' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'avatar' => null,
                ],
            ],
            'alerts' => $alerts,
            'stats' => $stats
        ]);
    }

    public function markAsActioned(Request $request, $id)
    {
        $alert = PriceAlert::findOrFail($id);
        $alert->markAsActioned();

        return response()->json(['success' => true, 'alert' => $alert]);
    }

    public function dismiss(Request $request, $id)
    {
        $alert = PriceAlert::findOrFail($id);
        $alert->dismiss();

        return response()->json(['success' => true, 'alert' => $alert]);
    }

    public function markAllAsRead(Request $request)
    {
        PriceAlert::where('status', 'new')->update([
            'status' => 'actioned',
            'actioned_at' => now()
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Get alert settings for the current user
     */
    public function getAlertSettings()
    {
        $userId = $this->getFirstUserId();

        $settings = AlertSetting::where('user_id', $userId)->first();

        if (!$settings) {
            // Create default settings if none exist
            $settings = AlertSetting::create([
                'user_id' => $userId,
                'min_price_drop_amount' => 10.00,
                'min_price_drop_percent' => 5.0,
                'notification_email' => true,
                'notification_push' => true,
                'auto_rebook' => false,
                'monitoring_frequency' => 'hourly',
                'preferred_providers' => ['booking.com', 'expedia', 'hotels.com'],
                'blacklisted_providers' => [],
                'location_preferences' => [],
                'price_thresholds' => [
                    'budget' => 100,
                    'mid_range' => 300,
                    'luxury' => 1000
                ]
            ]);
        }

        return response()->json($settings);
    }

    /**
     * Update alert settings
     */
    public function updateAlertSettings(Request $request)
    {
        $userId = $this->getFirstUserId();

        $validated = $request->validate([
            'min_price_drop_amount' => 'required|numeric|min:0',
            'min_price_drop_percent' => 'required|numeric|min:0|max:100',
            'notification_email' => 'boolean',
            'notification_push' => 'boolean',
            'auto_rebook' => 'boolean',
            'monitoring_frequency' => 'required|in:every_15_minutes,every_30_minutes,hourly,daily',
            'preferred_providers' => 'array',
            'blacklisted_providers' => 'array',
            'location_preferences' => 'array',
            'price_thresholds' => 'array'
        ]);

        $settings = AlertSetting::updateOrCreate(
            ['user_id' => $userId],
            $validated
        );

        return response()->json(['success' => true, 'settings' => $settings]);
    }

    public function createPriceAlert(Request $request)
    {
        $request->validate([
            'hotel_booking_id' => 'required|exists:hotel_bookings,id',
            'current_price' => 'required|numeric|min:0',
            'provider' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        $booking = HotelBooking::findOrFail($request->hotel_booking_id);

        // Calculate price drop
        $deltaAmount = $booking->current_price - $request->current_price;
        $deltaPercent = $deltaAmount > 0 ? ($deltaAmount / $booking->current_price) * 100 : 0;

        // Check if we should create an alert based on user settings
        $alertSettings = AlertSetting::where('user_id', $booking->user_id)->first();

        if ($alertSettings && $alertSettings->shouldNotify($deltaAmount, $deltaPercent, $request->provider, $booking->location)) {
            $alert = PriceAlert::create([
                'hotel_booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'hotel_name' => $booking->hotel_name,
                'location' => $booking->location,
                'provider' => $request->provider,
                'booked_price' => $booking->current_price,
                'current_price' => $request->current_price,
                'delta_amount' => $deltaAmount,
                'delta_percent' => $deltaPercent,
                'currency' => $booking->currency,
                'rule_threshold' => $this->determineRuleThreshold($deltaAmount, $deltaPercent),
                'severity' => $this->determineSeverity($deltaAmount, $deltaPercent),
                'triggered_at' => now(),
                'notes' => $request->notes
            ]);

            return response()->json(['success' => true, 'alert' => $alert]);
        }

        return response()->json(['success' => false, 'message' => 'Price drop does not meet alert criteria']);
    }

    private function determineRuleThreshold($deltaAmount, $deltaPercent)
    {
        if ($deltaAmount >= 100) {
            return '>$100 drop';
        } elseif ($deltaAmount >= 50) {
            return '>$50 drop';
        } elseif ($deltaPercent >= 10) {
            return '>10% drop';
        } elseif ($deltaPercent >= 5) {
            return '>5% drop';
        } else {
            return '>$10 drop';
        }
    }

    private function determineSeverity($deltaAmount, $deltaPercent)
    {
        if ($deltaAmount >= 100 || $deltaPercent >= 15) {
            return 'high';
        } elseif ($deltaAmount >= 50 || $deltaPercent >= 10) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    public function checkPrices(Request $request)
    {
        try {
            $service = new \App\Services\PriceAlertService();
            $alertsCreated = $service->checkAllPrices();

            return response()->json([
                'success' => true,
                'message' => "Price check completed. {$alertsCreated} new alerts created.",
                'alerts_created' => $alertsCreated
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error checking prices: ' . $e->getMessage()
            ], 500);
        }
    }
}
