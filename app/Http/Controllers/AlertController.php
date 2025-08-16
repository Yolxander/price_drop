<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PriceAlert;
use App\Models\AlertSetting;
use App\Models\HotelBooking;
use Carbon\Carbon;

class AlertController extends Controller
{
    public function index()
    {
        // Get real alerts from database (for demo, we'll use dummy data if none exist)
        $alerts = PriceAlert::with(['hotelBooking', 'user'])
            ->orderBy('triggered_at', 'desc')
            ->get()
            ->map(function ($alert) {
                return [
                    'id' => $alert->id,
                    'booking_id' => $alert->hotel_booking_id,
                    'hotel_name' => $alert->hotel_name,
                    'location' => $alert->location,
                    'triggered_at' => $alert->triggered_at->toISOString(),
                    'created_at' => $alert->created_at->toISOString(),
                    'provider' => $alert->provider,
                    'current_price' => $alert->current_price,
                    'booked_price' => $alert->booked_price,
                    'delta_amount' => $alert->delta_amount,
                    'delta_percent' => $alert->delta_percent,
                    'rule_threshold' => $alert->rule_threshold,
                    'status' => $alert->status,
                    'severity' => $alert->severity,
                    'currency' => $alert->currency,
                    'check_in_date' => $alert->hotelBooking?->check_in_date?->toISOString() ?? Carbon::now()->addDays(30)->toISOString(),
                    'notes' => $alert->notes
                ];
            });

        // If no alerts exist, create some dummy data for demonstration
        if ($alerts->isEmpty()) {
            $alerts = collect([
                [
                    'id' => 1,
                    'booking_id' => 1,
                    'hotel_name' => 'Fairmont Royal York',
                    'location' => 'Toronto, ON',
                    'triggered_at' => Carbon::now()->subHours(2)->toISOString(),
                    'created_at' => Carbon::now()->subHours(2)->toISOString(),
                    'provider' => 'Google Hotels',
                    'current_price' => 1184.00,
                    'booked_price' => 1316.00,
                    'delta_amount' => -132.00,
                    'delta_percent' => -10.0,
                    'rule_threshold' => '>$50 drop',
                    'status' => 'new',
                    'severity' => 'high',
                    'currency' => 'USD',
                    'check_in_date' => Carbon::now()->addDays(30)->toISOString(),
                    'notes' => 'Price dropped significantly below threshold'
                ],
                [
                    'id' => 2,
                    'booking_id' => 3,
                    'hotel_name' => 'Hotel Arts Barcelona',
                    'location' => 'Barcelona, Spain',
                    'triggered_at' => Carbon::now()->subHours(1)->toISOString(),
                    'created_at' => Carbon::now()->subHours(1)->toISOString(),
                    'provider' => 'Booking.com',
                    'current_price' => 765.00,
                    'booked_price' => 850.00,
                    'delta_amount' => -85.00,
                    'delta_percent' => -10.0,
                    'rule_threshold' => '>5% drop',
                    'status' => 'actioned',
                    'severity' => 'medium',
                    'currency' => 'USD',
                    'check_in_date' => Carbon::now()->addDays(45)->toISOString(),
                    'notes' => 'Customer rebooked at lower price'
                ],
                [
                    'id' => 3,
                    'booking_id' => 4,
                    'hotel_name' => 'Park Hyatt Tokyo',
                    'location' => 'Tokyo, Japan',
                    'triggered_at' => Carbon::now()->subHours(4)->toISOString(),
                    'created_at' => Carbon::now()->subHours(4)->toISOString(),
                    'provider' => 'Expedia',
                    'current_price' => 135000.00,
                    'booked_price' => 150000.00,
                    'delta_amount' => -15000.00,
                    'delta_percent' => -10.0,
                    'rule_threshold' => '>$1000 drop',
                    'status' => 'dismissed',
                    'severity' => 'high',
                    'currency' => 'JPY',
                    'check_in_date' => Carbon::now()->addDays(60)->toISOString(),
                    'notes' => 'Customer decided to keep original booking'
                ]
            ]);
        }

        $stats = [
            'total_alerts' => $alerts->count(),
            'new_alerts' => $alerts->where('status', 'new')->count(),
            'actioned_alerts' => $alerts->where('status', 'actioned')->count(),
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

    public function getAlertSettings()
    {
        $settings = AlertSetting::where('user_id', 3)->first(); // For demo, using dummy user ID 3

        if (!$settings) {
            $settings = AlertSetting::create([
                'user_id' => 3,
                'min_price_drop_amount' => 10.00,
                'min_price_drop_percent' => 5.00,
                'email_notifications' => true,
                'push_notifications' => true,
                'sms_notifications' => false,
                'notification_frequency' => 'immediate',
                'quiet_hours_start' => null,
                'quiet_hours_end' => null,
                'excluded_providers' => [],
                'included_locations' => []
            ]);
        }

        return response()->json($settings);
    }

    public function updateAlertSettings(Request $request)
    {
        $request->validate([
            'min_price_drop_amount' => 'required|numeric|min:0',
            'min_price_drop_percent' => 'required|numeric|min:0|max:100',
            'email_notifications' => 'boolean',
            'push_notifications' => 'boolean',
            'sms_notifications' => 'boolean',
            'notification_frequency' => 'required|in:immediate,daily,weekly',
            'quiet_hours_start' => 'nullable|date_format:H:i',
            'quiet_hours_end' => 'nullable|date_format:H:i',
            'excluded_providers' => 'array',
            'included_locations' => 'array'
        ]);

        $settings = AlertSetting::updateOrCreate(
            ['user_id' => 3], // For demo, using dummy user ID 3
            $request->all()
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
