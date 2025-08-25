<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\PriceAlert;
use App\Notifications\PriceAlertDigest;
use Illuminate\Support\Facades\Log;

class SendPriceAlertDigest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 300; // 5 minutes timeout
    public $tries = 3; // Retry up to 3 times

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info('Starting to send price alert digests');

            // Get users who prefer daily notifications
            $users = User::whereHas('alertSettings', function ($query) {
                $query->where('notification_frequency', 'daily');
            })->get();

            $digestsSent = 0;

            foreach ($users as $user) {
                try {
                    // Get new alerts from the last 24 hours
                    $recentAlerts = PriceAlert::where('user_id', $user->id)
                        ->where('status', 'new')
                        ->where('created_at', '>=', now()->subDay())
                        ->with('hotelBooking')
                        ->get();

                    if ($recentAlerts->count() > 0) {
                        // Send digest notification
                        $user->notify(new PriceAlertDigest($recentAlerts));
                        $digestsSent++;

                        Log::info("Daily digest sent to user {$user->id} with {$recentAlerts->count()} alerts");
                    }
                } catch (\Exception $e) {
                    Log::error("Error sending digest to user {$user->id}: " . $e->getMessage());
                }
            }

            Log::info("Daily digest job completed. Sent {$digestsSent} digests.");

        } catch (\Exception $e) {
            Log::error('Error in SendPriceAlertDigest job: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('SendPriceAlertDigest job failed permanently', [
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts()
        ]);
    }
}
