<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\PriceAlert;
use App\Models\HotelBooking;

class PriceDropDetected extends Notification implements ShouldQueue
{
    use Queueable;

    protected $priceAlert;
    protected $hotelBooking;

    /**
     * Create a new notification instance.
     */
    public function __construct(PriceAlert $priceAlert, HotelBooking $hotelBooking = null)
    {
        $this->priceAlert = $priceAlert;
        $this->hotelBooking = $hotelBooking ?? $priceAlert->hotelBooking;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        // Get user's preferred notification methods from alert settings
        $alertSettings = $notifiable->alertSettings;

        if (!$alertSettings) {
            return ['mail']; // Default to email if no settings
        }

        $channels = [];

        if ($alertSettings->email_notifications) {
            $channels[] = 'mail';
        }

        if ($alertSettings->push_notifications) {
            $channels[] = 'database'; // For in-app notifications
        }

        if ($alertSettings->sms_notifications) {
            $channels[] = 'nexmo'; // For SMS (requires Nexmo package)
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $savings = $this->priceAlert->delta_amount;
        $currency = $this->priceAlert->currency;
        $hotelName = $this->priceAlert->hotel_name;
        $location = $this->priceAlert->location;

        return (new MailMessage)
            ->subject("💰 Price Drop Alert: Save {$currency}{$savings} on your {$hotelName} booking!")
            ->greeting("Hello {$notifiable->name}!")
            ->line("Great news! We've detected a price drop on your hotel booking.")
            ->line("**Hotel:** {$hotelName}")
            ->line("**Location:** {$location}")
            ->line("**Your Price:** {$currency}{$this->priceAlert->booked_price}")
            ->line("**Current Price:** {$currency}{$this->priceAlert->current_price}")
            ->line("**You'll Save:** {$currency}{$savings} ({$this->priceAlert->delta_percent}%)")
            ->action('View Booking Details', url('/bookings/' . $this->hotelBooking->id))
            ->line("This price drop was detected at {$this->priceAlert->triggered_at->format('M j, Y \a\t g:i A')}.")
            ->line("Don't miss out on these savings!");
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable): array
    {
        return [
            'id' => $this->priceAlert->id,
            'type' => 'price_drop',
            'title' => 'Price Drop Detected!',
            'message' => "Save {$this->priceAlert->currency}{$this->priceAlert->delta_amount} on {$this->priceAlert->hotel_name}",
            'hotel_booking_id' => $this->priceAlert->hotel_booking_id,
            'hotel_name' => $this->priceAlert->hotel_name,
            'location' => $this->priceAlert->location,
            'savings_amount' => $this->priceAlert->delta_amount,
            'savings_percent' => $this->priceAlert->delta_percent,
            'currency' => $this->priceAlert->currency,
            'severity' => $this->priceAlert->severity,
            'triggered_at' => $this->priceAlert->triggered_at,
            'action_url' => '/bookings/' . $this->hotelBooking->id,
        ];
    }

    /**
     * Get the Nexmo / SMS representation of the notification.
     */
    public function toNexmo($notifiable)
    {
        $savings = $this->priceAlert->delta_amount;
        $currency = $this->priceAlert->currency;
        $hotelName = $this->priceAlert->hotel_name;

        return [
            'text' => "Price Drop Alert! Save {$currency}{$savings} on {$hotelName}. View details at: " . url('/bookings/' . $this->hotelBooking->id)
        ];
    }
}
