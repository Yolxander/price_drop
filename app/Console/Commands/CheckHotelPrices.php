<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PriceAlertService;
use App\Models\HotelBooking;
use App\Jobs\CheckHotelPrices as CheckHotelPricesJob;
use Illuminate\Support\Facades\Log;

class CheckHotelPrices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hotels:check-prices
                            {--force : Force check all prices regardless of timing}
                            {--booking-id= : Check specific booking ID}
                            {--dispatch-job : Dispatch as background job instead of running synchronously}
                            {--cleanup-only : Only clean up old alerts without checking prices}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check hotel prices and create price drop alerts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🏨 Starting hotel price check...');

        if ($this->option('cleanup-only')) {
            return $this->cleanupOnly();
        }

        if ($this->option('dispatch-job')) {
            return $this->dispatchJob();
        }

        return $this->runSynchronously();
    }

    /**
     * Only perform cleanup without checking prices
     */
    private function cleanupOnly()
    {
        try {
            $service = app(PriceAlertService::class);

            $this->info("🧹 Cleaning up old alerts...");
            $deleted = $service->cleanupOldAlerts();

            if ($deleted > 0) {
                $this->info("🗑️  Cleaned up {$deleted} old alerts");
            } else {
                $this->info("✅ No old alerts to clean up");
            }

            return 0;
        } catch (\Exception $e) {
            $this->error('❌ Error during cleanup: ' . $e->getMessage());
            return 1;
        }
    }

    /**
     * Dispatch the price check as a background job
     */
    private function dispatchJob()
    {
        $bookingId = $this->option('booking-id');

        if ($bookingId) {
            CheckHotelPricesJob::dispatch($bookingId);
            $this->info("✅ Price check job dispatched for booking {$bookingId}");
        } else {
            CheckHotelPricesJob::dispatch();
            $this->info('✅ Price check job dispatched for all active bookings');
        }

        return 0;
    }

    /**
     * Run the price check synchronously
     */
    private function runSynchronously()
    {
        try {
            $service = app(PriceAlertService::class);
            $bookingId = $this->option('booking-id');

            if ($bookingId) {
                // Check specific booking
                $this->info("🔍 Checking price for booking {$bookingId}...");

                $booking = HotelBooking::find($bookingId);
                if (!$booking) {
                    $this->error("❌ Booking {$bookingId} not found");
                    return 1;
                }

                $alert = $service->checkSingleBooking($bookingId);

                if ($alert) {
                    $this->info("💰 Price drop detected! Alert created:");
                    $this->table(
                        ['Field', 'Value'],
                        [
                            ['Alert ID', $alert->id],
                            ['Hotel', $alert->hotel_name],
                            ['Savings', $alert->currency . $alert->delta_amount],
                            ['Percentage', $alert->delta_percent . '%'],
                            ['Severity', ucfirst($alert->severity)]
                        ]
                    );
                } else {
                    $this->info("✅ No price drop detected for booking {$bookingId}");
                }
            } else {
                // Check all active bookings
                $this->info("🔍 Checking prices for all active bookings...");

                $activeBookingsCount = HotelBooking::where('status', 'active')->count();
                $this->info("Found {$activeBookingsCount} active bookings to check");

                $alertsCreated = $service->checkAllPrices();

                if ($alertsCreated > 0) {
                    $this->info("💰 Created {$alertsCreated} price drop alerts");
                } else {
                    $this->info('✅ No new price drops detected');
                }
            }

            // Clean up old alerts
            $this->info("🧹 Cleaning up old alerts...");
            $deleted = $service->cleanupOldAlerts();
            if ($deleted > 0) {
                $this->info("🗑️  Cleaned up {$deleted} old alerts");
            }

        } catch (\Exception $e) {
            $this->error('❌ Error checking hotel prices: ' . $e->getMessage());
            Log::error('Console command error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return 1;
        }

        $this->info('🎉 Hotel price check completed successfully!');
        return 0;
    }
}
