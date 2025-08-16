<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PriceAlertService;

class CheckHotelPrices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hotels:check-prices {--force : Force check all prices regardless of timing}';

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
        $this->info('Starting hotel price check...');

        $service = new PriceAlertService();

        try {
            $alertsCreated = $service->checkAllPrices();

            if ($alertsCreated > 0) {
                $this->info("✅ Created {$alertsCreated} price drop alerts");
            } else {
                $this->info('✅ No new price drops detected');
            }

            // Clean up old alerts
            $deleted = $service->cleanupOldAlerts();
            if ($deleted > 0) {
                $this->info("🧹 Cleaned up {$deleted} old alerts");
            }

        } catch (\Exception $e) {
            $this->error('❌ Error checking hotel prices: ' . $e->getMessage());
            return 1;
        }

        $this->info('Hotel price check completed successfully!');
        return 0;
    }
}
