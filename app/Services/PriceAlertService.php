<?php

namespace App\Services;

use App\Models\HotelBooking;
use App\Models\PriceAlert;
use App\Models\AlertSetting;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PriceAlertService
{
    /**
     * Check prices for all active bookings and create alerts if needed
     */
    public function checkAllPrices()
    {
        $bookings = HotelBooking::where('status', 'active')->get();
        $alertsCreated = 0;

        foreach ($bookings as $booking) {
            try {
                if ($this->shouldCheckPrice($booking)) {
                    $currentPrice = $this->getCurrentPrice($booking);

                    if ($currentPrice && $currentPrice < $booking->current_price) {
                        $this->createPriceAlert($booking, $currentPrice);
                        $alertsCreated++;
                    }
                }
            } catch (\Exception $e) {
                Log::error("Error checking price for booking {$booking->id}: " . $e->getMessage());
            }
        }

        return $alertsCreated;
    }

    /**
     * Check if we should check the price for a specific booking
     */
    private function shouldCheckPrice(HotelBooking $booking)
    {
        // Don't check if we checked recently (within last hour)
        if ($booking->last_checked && $booking->last_checked->isAfter(now()->subHour())) {
            return false;
        }

        // Don't check if check-in is too close (within 24 hours)
        if ($booking->check_in_date && $booking->check_in_date->isBefore(now()->addDay())) {
            return false;
        }

        return true;
    }

    /**
     * Get current price for a booking (this would integrate with external APIs)
     */
    private function getCurrentPrice(HotelBooking $booking)
    {
        // This is a placeholder - in a real implementation, you would:
        // 1. Call the SerpAPI or other hotel price APIs
        // 2. Parse the response to get current prices
        // 3. Return the best available price

        // For demo purposes, we'll simulate price drops
        $randomFactor = rand(1, 100);

        if ($randomFactor <= 20) { // 20% chance of price drop
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
        if ($alertSettings->shouldNotify($deltaAmount, $deltaPercent)) {
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
                'triggered_at' => now(),
                'notes' => 'Automatic price check detected drop'
            ]);

            // Update the booking's last checked time
            $booking->update([
                'last_checked' => now(),
                'price_drop_detected' => true,
                'price_drop_amount' => $deltaAmount
            ]);

            // Send notifications based on user preferences
            $this->sendNotifications($alert, $alertSettings);

            return $alert;
        }

        return null;
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
    private function sendNotifications(PriceAlert $alert, AlertSetting $settings)
    {
        $notificationMethods = $settings->getNotificationMethods();

        foreach ($notificationMethods as $method) {
            switch ($method) {
                case 'email':
                    $this->sendEmailNotification($alert);
                    break;
                case 'push':
                    $this->sendPushNotification($alert);
                    break;
                case 'sms':
                    $this->sendSmsNotification($alert);
                    break;
            }
        }
    }

    /**
     * Send email notification
     */
    private function sendEmailNotification(PriceAlert $alert)
    {
        // In a real implementation, you would:
        // 1. Create a notification class
        // 2. Send via Laravel's notification system
        // 3. Use a mail service like Mailgun, SendGrid, etc.

        Log::info("Email notification sent for alert {$alert->id}");
    }

    /**
     * Send push notification
     */
    private function sendPushNotification(PriceAlert $alert)
    {
        // In a real implementation, you would:
        // 1. Integrate with push notification services
        // 2. Send to user's devices
        // 3. Handle different platforms (iOS, Android, Web)

        Log::info("Push notification sent for alert {$alert->id}");
    }

    /**
     * Send SMS notification
     */
    private function sendSmsNotification(PriceAlert $alert)
    {
        // In a real implementation, you would:
        // 1. Integrate with SMS services like Twilio
        // 2. Send to user's phone number
        // 3. Handle delivery confirmations

        Log::info("SMS notification sent for alert {$alert->id}");
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
}
