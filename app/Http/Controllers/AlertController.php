<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PriceAlert;
use App\Models\HotelBooking;
use App\Models\AlertSetting;
use App\Services\PriceAlertService;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AlertController extends Controller
{
    protected $priceAlertService;

    public function __construct(PriceAlertService $priceAlertService)
    {
        $this->priceAlertService = $priceAlertService;
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

        // Get active price alerts (bookings with monitoring enabled)
        $activeBookings = HotelBooking::where('user_id', $userId)
            ->where('status', 'active')
            ->where('price_alert_active', true)
            ->get();

        $stats = [
            'total_alerts' => $alerts->count(),
            'new_alerts' => $alerts->where('status', 'new')->count(),
            'actioned_alerts' => $alerts->where('status', 'actioned')->count(),
            'total_savings' => $alerts->sum('delta_amount'),
            'active_monitoring' => $activeBookings->count()
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
            'activeBookings' => $activeBookings,
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
                'email_notifications' => true,
                'push_notifications' => true,
                'sms_notifications' => false,
                'notification_frequency' => 'immediate',
                'excluded_providers' => [],
                'included_locations' => []
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
            'email_notifications' => 'boolean',
            'push_notifications' => 'boolean',
            'sms_notifications' => 'boolean',
            'notification_frequency' => 'required|in:immediate,daily,weekly',
            'excluded_providers' => 'array',
            'included_locations' => 'array',
            'quiet_hours_start' => 'nullable|date_format:H:i',
            'quiet_hours_end' => 'nullable|date_format:H:i'
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
            $alertsCreated = $this->priceAlertService->checkAllPrices();

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

    /**
     * Check price for a specific booking
     */
    public function checkSingleBooking(Request $request, $bookingId)
    {
        try {
            $alert = $this->priceAlertService->checkSingleBooking($bookingId);

            if ($alert) {
                return response()->json([
                    'success' => true,
                    'message' => 'Price drop detected and alert created!',
                    'alert' => $alert
                ]);
            } else {
                return response()->json([
                    'success' => true,
                    'message' => 'No price drop detected for this booking.',
                    'alert' => null
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error checking price: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get price history for a booking
     */
    public function getPriceHistory(Request $request, $bookingId)
    {
        try {
            $history = $this->priceAlertService->getPriceHistory($bookingId);

            return response()->json([
                'success' => true,
                'history' => $history
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error getting price history: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle monitoring for a booking
     */
    public function toggleMonitoring(Request $request, $bookingId)
    {
        try {
            $booking = HotelBooking::findOrFail($bookingId);
            $newStatus = $booking->status === 'active' ? 'paused' : 'active';

            if ($newStatus === 'active') {
                $this->priceAlertService->activateMonitoring($bookingId);
            } else {
                $this->priceAlertService->pauseMonitoring($bookingId);
            }

            return response()->json([
                'success' => true,
                'message' => "Monitoring {$newStatus} for booking",
                'status' => $newStatus
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error toggling monitoring: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Set price alert on a booking
     */
    public function setPriceAlert(Request $request, $bookingId)
    {
        try {
            $booking = HotelBooking::findOrFail($bookingId);

            // Activate price monitoring for this booking
            $booking->update([
                'price_alert_active' => true,
                'status' => 'active',
                'last_checked' => null // Reset to force immediate check
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Price alert activated for this booking!',
                'booking' => $booking
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error setting price alert: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove price alert from a booking
     */
    public function removePriceAlert(Request $request, $bookingId)
    {
        try {
            $booking = HotelBooking::findOrFail($bookingId);

            // Deactivate price monitoring for this booking
            $booking->update([
                'price_alert_active' => false
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Price alert removed from this booking.',
                'booking' => $booking
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error removing price alert: ' . $e->getMessage()
            ], 500);
        }
    }
}
