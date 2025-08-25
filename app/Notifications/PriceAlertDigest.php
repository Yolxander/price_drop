<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\PriceAlert;
use Illuminate\Support\Collection;

class PriceAlertDigest extends Notification implements ShouldQueue
{
    use Queueable;

    protected $alerts;

    /**
     * Create a new notification instance.
     */
    public function __construct(Collection $alerts)
    {
        $this->alerts = $alerts;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $totalSavings = $this->alerts->sum('delta_amount');
        $currency = $this->alerts->first()->currency ?? 'USD';
        $alertCount = $this->alerts->count();

        $mail = (new MailMessage)
            ->subject("📊 Daily Price Alert Digest: {$alertCount} new opportunities to save {$currency}{$totalSavings}!")
            ->greeting("Hello {$notifiable->name}!")
            ->line("Here's your daily summary of price drops we've detected on your hotel bookings.")
            ->line("**Total Alerts:** {$alertCount}")
            ->line("**Potential Savings:** {$currency}{$totalSavings}");

        // Add summary of each alert
        foreach ($this->alerts->take(5) as $alert) {
            $mail->line("• **{$alert->hotel_name}** - Save {$currency}{$alert->delta_amount} ({$alert->delta_percent}%)");
        }

        if ($this->alerts->count() > 5) {
            $mail->line("... and " . ($this->alerts->count() - 5) . " more alerts");
        }

        $mail->action('View All Alerts', url('/price-alerts'))
            ->line("Don't miss out on these savings! Check your alerts dashboard for full details.");

        return $mail;
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable): array
    {
        return [
            'type' => 'price_alert_digest',
            'title' => 'Daily Price Alert Digest',
            'message' => "{$this->alerts->count()} new price drop alerts",
            'alert_count' => $this->alerts->count(),
            'total_savings' => $this->alerts->sum('delta_amount'),
            'currency' => $this->alerts->first()->currency ?? 'USD',
            'alerts' => $this->alerts->map(function ($alert) {
                return [
                    'id' => $alert->id,
                    'hotel_name' => $alert->hotel_name,
                    'savings_amount' => $alert->delta_amount,
                    'savings_percent' => $alert->delta_percent,
                    'severity' => $alert->severity
                ];
            }),
            'action_url' => '/price-alerts',
        ];
    }
}
