<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\PriceAlertService;
use App\Models\HotelBooking;
use Illuminate\Support\Facades\Log;

class CheckHotelPrices implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $bookingId;
    public $timeout = 300; // 5 minutes timeout
    public $tries = 3; // Retry up to 3 times

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
    public function handle(PriceAlertService $priceAlertService): void
    {
        try {
            if ($this->bookingId) {
                // Check specific booking
                $this->checkSingleBooking($this->bookingId, $priceAlertService);
            } else {
                // Check all active bookings
                $this->checkAllBookings($priceAlertService);
            }
        } catch (\Exception $e) {
            Log::error('Error in CheckHotelPrices job', [
                'error' => $e->getMessage(),
                'booking_id' => $this->bookingId,
                'trace' => $e->getTraceAsString()
            ]);

            // Re-throw to trigger retry mechanism
            throw $e;
        }
    }

    /**
     * Check price for a single booking
     */
    protected function checkSingleBooking($bookingId, PriceAlertService $priceAlertService): void
    {
        try {
            Log::info("Starting price check for booking {$bookingId}");

            $alert = $priceAlertService->checkSingleBooking($bookingId);

            if ($alert) {
                Log::info("Price drop alert created for booking {$bookingId}", [
                    'alert_id' => $alert->id,
                    'savings' => $alert->delta_amount,
                    'currency' => $alert->currency
                ]);
            } else {
                Log::info("No price drop detected for booking {$bookingId}");
            }

        } catch (\Exception $e) {
            Log::error("Error checking price for single booking {$bookingId}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Check prices for all active bookings
     */
    protected function checkAllBookings(PriceAlertService $priceAlertService): void
    {
        try {
            Log::info("Starting price check for all active bookings");

            $alertsCreated = $priceAlertService->checkAllPrices();

            Log::info("Price check completed", [
                'alerts_created' => $alertsCreated,
                'total_bookings_checked' => HotelBooking::where('status', 'active')->count()
            ]);

        } catch (\Exception $e) {
            Log::error("Error checking prices for all bookings: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('CheckHotelPrices job failed permanently', [
            'booking_id' => $this->bookingId,
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts()
        ]);
    }
}
