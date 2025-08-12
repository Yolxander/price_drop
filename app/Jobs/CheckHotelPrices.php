<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\SerpApiService;
use App\Models\HotelBooking;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use App\Notifications\PriceDropDetected;

class CheckHotelPrices implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $bookingId;

    /**
     * Create a new job instance.
     */
    public function __construct($bookingId = null)
    {
        $this->bookingId = $bookingId;
    }

    /**
     * Execute the job.
     */
    public function handle(SerpApiService $serpApi): void
    {
        try {
            if ($this->bookingId) {
                // Check specific booking
                $booking = HotelBooking::find($this->bookingId);
                if ($booking) {
                    $this->checkSingleBooking($booking, $serpApi);
                }
            } else {
                // Check all active bookings
                $activeBookings = HotelBooking::where('status', 'active')->get();
                
                foreach ($activeBookings as $booking) {
                    $this->checkSingleBooking($booking, $serpApi);
                }
            }
        } catch (\Exception $e) {
            Log::error('Error in CheckHotelPrices job', [
                'error' => $e->getMessage(),
                'booking_id' => $this->bookingId
            ]);
        }
    }

    /**
     * Check price for a single booking
     */
    protected function checkSingleBooking(HotelBooking $booking, SerpApiService $serpApi): void
    {
        try {
            // Get current price from SerpAPI
            $currentPriceData = $serpApi->checkHotelPrice(
                $booking->hotel_name,
                $booking->check_in_date->format('Y-m-d'),
                $booking->check_out_date->format('Y-m-d'),
                $booking->currency,
                $booking->guests
            );

            if (!$currentPriceData) {
                Log::warning('No price data returned for booking', [
                    'booking_id' => $booking->id,
                    'hotel_name' => $booking->hotel_name
                ]);
                return;
            }

            $currentPrice = $currentPriceData['price'] ?? $currentPriceData['total_price'];
            
            if (!$currentPrice) {
                Log::warning('No valid price found in response', [
                    'booking_id' => $booking->id,
                    'response' => $currentPriceData
                ]);
                return;
            }

            // Update booking with current price
            $booking->current_price = $currentPrice;
            $booking->last_checked = now();

            // Check for price drop
            $priceDrop = $booking->original_price - $currentPrice;
            
            if ($priceDrop > 0) {
                // Price drop detected!
                $booking->price_drop_detected = true;
                $booking->price_drop_amount = $priceDrop;
                
                // Send notification (dummy for now)
                $this->sendPriceDropNotification($booking, $priceDrop);
                
                Log::info('Price drop detected', [
                    'booking_id' => $booking->id,
                    'hotel_name' => $booking->hotel_name,
                    'original_price' => $booking->original_price,
                    'current_price' => $currentPrice,
                    'savings' => $priceDrop
                ]);
            } else {
                // No price drop
                $booking->price_drop_detected = false;
                $booking->price_drop_amount = null;
            }

            $booking->save();

        } catch (\Exception $e) {
            Log::error('Error checking price for booking', [
                'booking_id' => $booking->id,
                'hotel_name' => $booking->hotel_name,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Send price drop notification
     */
    protected function sendPriceDropNotification(HotelBooking $booking, float $priceDrop): void
    {
        // For demo purposes, just log the notification
        // In production, you would send email/SMS/push notification
        
        Log::info('Price drop notification would be sent', [
            'booking_id' => $booking->id,
            'hotel_name' => $booking->hotel_name,
            'user_email' => $booking->user->email ?? 'demo@example.com',
            'savings' => $priceDrop,
            'currency' => $booking->currency
        ]);

        // Real notification would look like:
        /*
        if ($booking->user) {
            $booking->user->notify(new PriceDropDetected($booking, $priceDrop));
        }
        */
    }
}
