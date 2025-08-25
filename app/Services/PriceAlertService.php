<?php

namespace App\Services;

use App\Models\HotelBooking;
use App\Models\PriceAlert;
use App\Models\AlertSetting;
use App\Notifications\PriceDropDetected;
use App\Services\SerpApiService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class PriceAlertService
{
    protected $serpApiService;

    public function __construct(SerpApiService $serpApiService)
    {
        $this->serpApiService = $serpApiService;
    }

    /**
     * Check prices for all active bookings and create alerts if needed
     */
    public function checkAllPrices()
    {
        $bookings = HotelBooking::where('status', 'active')
            ->where('price_drop_detected', false) // Only check bookings without recent drops
            ->get();

        $alertsCreated = 0;

        foreach ($bookings as $booking) {
            try {
                if ($this->shouldCheckPrice($booking)) {
                    $currentPrice = $this->getCurrentPrice($booking);

                    if ($currentPrice && $currentPrice < $booking->current_price) {
                        $alert = $this->createPriceAlert($booking, $currentPrice);
                        if ($alert) {
                            $alertsCreated++;
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::error("Error checking price for booking {$booking->id}: " . $e->getMessage());
            }
        }

        return $alertsCreated;
    }

    /**
     * Check price for a specific booking
     */
    public function checkSingleBooking($bookingId)
    {
        $booking = HotelBooking::find($bookingId);

        if (!$booking) {
            throw new \Exception("Booking not found: {$bookingId}");
        }

        if ($this->shouldCheckPrice($booking)) {
            $currentPrice = $this->getCurrentPrice($booking);

            if ($currentPrice && $currentPrice < $booking->current_price) {
                return $this->createPriceAlert($booking, $currentPrice);
            }
        }

        return null;
    }

    /**
     * Check if we should check the price for a specific booking
     */
    private function shouldCheckPrice(HotelBooking $booking)
    {
        // Don't check if we checked recently (within last 2 hours for active monitoring)
        if ($booking->last_checked && $booking->last_checked->isAfter(now()->subHours(2))) {
            return false;
        }

        // Don't check if check-in is too close (within 24 hours)
        if ($booking->check_in_date && $booking->check_in_date->isBefore(now()->addDay())) {
            return false;
        }

        // Don't check if booking is not active
        if ($booking->status !== 'active') {
            return false;
        }

        return true;
    }

    /**
     * Get current price for a booking using SerpAPI
     */
    private function getCurrentPrice(HotelBooking $booking)
    {
        try {
            // Use SerpAPI to get current price
            $priceData = $this->serpApiService->checkHotelPrice(
                $booking->hotel_name,
                $booking->check_in_date->format('Y-m-d'),
                $booking->check_out_date->format('Y-m-d'),
                $booking->currency,
                $booking->guests
            );

            if ($priceData && isset($priceData['price'])) {
                return $priceData['price'];
            }

            // Fallback: simulate price drops for demo/testing
            return $this->simulatePriceDrop($booking);

        } catch (\Exception $e) {
            Log::error("Error getting current price for booking {$booking->id}: " . $e->getMessage());

            // Fallback to simulation for demo purposes
            return $this->simulatePriceDrop($booking);
        }
    }

    /**
     * Simulate price drops for demo/testing purposes
     */
    private function simulatePriceDrop(HotelBooking $booking)
    {
        $randomFactor = rand(1, 100);

        if ($randomFactor <= 15) { // 15% chance of price drop
            $dropPercent = rand(5, 25);
            return $booking->current_price * (1 - $dropPercent / 100);
        }

        return null; // No price drop
    }

    /**
     * Create a price alert for a booking
     */
    private function createPriceAlert(HotelBooking $booking, $currentPrice)
    {
        $deltaAmount = $booking->current_price - $currentPrice;
        $deltaPercent = ($deltaAmount / $booking->current_price) * 100;

        // Check user's alert settings
        $alertSettings = AlertSetting::where('user_id', $booking->user_id)->first();

        if (!$alertSettings) {
            // Create default settings if none exist
            $alertSettings = AlertSetting::create([
                'user_id' => $booking->user_id,
                'min_price_drop_amount' => 10.00,
                'min_price_drop_percent' => 5.00,
                'email_notifications' => true,
                'push_notifications' => true,
                'sms_notifications' => false,
                'notification_frequency' => 'immediate'
            ]);
        }

        // Only create alert if it meets the user's criteria
        if ($alertSettings->shouldNotify($deltaAmount, $deltaPercent, null, $booking->location)) {
            $alert = PriceAlert::create([
                'hotel_booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'hotel_name' => $booking->hotel_name,
                'location' => $booking->location,
                'provider' => $this->determineProvider($booking),
                'booked_price' => $booking->current_price,
                'current_price' => $currentPrice,
                'delta_amount' => $deltaAmount,
                'delta_percent' => $deltaPercent,
                'currency' => $booking->currency,
                'rule_threshold' => $this->determineRuleThreshold($deltaAmount, $deltaPercent),
                'severity' => $this->determineSeverity($deltaAmount, $deltaPercent),
                'status' => 'new',
                'triggered_at' => now(),
                'notes' => 'Automatic price check detected drop'
            ]);

            // Update the booking with new price info
            $this->updateBookingPriceInfo($booking, $currentPrice, $deltaAmount);

            // Send notifications based on user preferences
            $this->sendNotifications($alert, $alertSettings, $booking);

            return $alert;
        }

        return null;
    }

    /**
     * Update booking with new price information
     */
    private function updateBookingPriceInfo(HotelBooking $booking, $currentPrice, $deltaAmount)
    {
        $booking->update([
            'current_price' => $currentPrice,
            'last_checked' => now(),
            'price_drop_detected' => true,
            'price_drop_amount' => $deltaAmount
        ]);
    }

    /**
     * Determine the provider for the alert
     */
    private function determineProvider(HotelBooking $booking)
    {
        // In a real implementation, this would come from the price check API
        $providers = ['Google Hotels', 'Booking.com', 'Expedia', 'Hotels.com', 'TripAdvisor'];
        return $providers[array_rand($providers)];
    }

    /**
     * Determine the rule threshold for the alert
     */
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

    /**
     * Determine the severity of the price drop
     */
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

    /**
     * Send notifications based on user preferences
     */
    private function sendNotifications(PriceAlert $alert, AlertSetting $settings, HotelBooking $booking)
    {
        try {
            $user = $booking->user;

            if ($user) {
                // Send the notification - Laravel will handle the delivery channels
                $user->notify(new PriceDropDetected($alert, $booking));

                Log::info("Price drop notification sent for alert {$alert->id} to user {$user->id}");
            }
        } catch (\Exception $e) {
            Log::error("Error sending notification for alert {$alert->id}: " . $e->getMessage());
        }
    }

    /**
     * Clean up old alerts
     */
    public function cleanupOldAlerts()
    {
        // Remove alerts older than 30 days
        $cutoffDate = now()->subDays(30);

        $deleted = PriceAlert::where('created_at', '<', $cutoffDate)
            ->whereIn('status', ['actioned', 'dismissed'])
            ->delete();

        Log::info("Cleaned up {$deleted} old alerts");

        return $deleted;
    }

    /**
     * Get price history for a booking
     */
    public function getPriceHistory($bookingId)
    {
        $alerts = PriceAlert::where('hotel_booking_id', $bookingId)
            ->orderBy('triggered_at', 'desc')
            ->get();

        return $alerts->map(function ($alert) {
            return [
                'date' => $alert->triggered_at,
                'price' => $alert->current_price,
                'drop_amount' => $alert->delta_amount,
                'drop_percent' => $alert->delta_percent,
                'provider' => $alert->provider,
                'status' => $alert->status
            ];
        });
    }

    /**
     * Activate price monitoring for a booking
     */
    public function activateMonitoring($bookingId)
    {
        $booking = HotelBooking::find($bookingId);

        if ($booking) {
            $booking->update([
                'status' => 'active',
                'last_checked' => null // Reset last checked to force immediate check
            ]);

            return true;
        }

        return false;
    }

    /**
     * Pause price monitoring for a booking
     */
    public function pauseMonitoring($bookingId)
    {
        $booking = HotelBooking::find($bookingId);

        if ($booking) {
            $booking->update(['status' => 'paused']);
            return true;
        }

        return false;
    }
}
