<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Check hotel prices every 2 hours during business hours
        $schedule->command('hotels:check-prices')
            ->everyTwoHours()
            ->between('8:00', '22:00')
            ->withoutOverlapping()
            ->runInBackground()
            ->onSuccess(function () {
                \Log::info('Scheduled price check completed successfully');
            })
            ->onFailure(function () {
                \Log::error('Scheduled price check failed');
            });

        // Check prices more frequently during peak travel times (weekends)
        $schedule->command('hotels:check-prices')
            ->hourly()
            ->fridays()
            ->saturdays()
            ->sundays()
            ->between('9:00', '21:00')
            ->withoutOverlapping()
            ->runInBackground();

        // Clean up old alerts daily at 2 AM
        $schedule->command('hotels:check-prices --cleanup-only')
            ->dailyAt('02:00')
            ->runInBackground();

        // Send daily digest of price alerts (if user prefers daily notifications)
        $schedule->job(new \App\Jobs\SendPriceAlertDigest())
            ->dailyAt('09:00')
            ->runInBackground();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
