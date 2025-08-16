<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlertSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'min_price_drop_amount',
        'min_price_drop_percent',
        'email_notifications',
        'push_notifications',
        'sms_notifications',
        'notification_frequency',
        'quiet_hours_start',
        'quiet_hours_end',
        'excluded_providers',
        'included_locations'
    ];

    protected $casts = [
        'min_price_drop_amount' => 'decimal:2',
        'min_price_drop_percent' => 'decimal:2',
        'email_notifications' => 'boolean',
        'push_notifications' => 'boolean',
        'sms_notifications' => 'boolean',
        'quiet_hours_start' => 'datetime:H:i',
        'quiet_hours_end' => 'datetime:H:i',
        'excluded_providers' => 'array',
        'included_locations' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shouldNotify($priceDropAmount, $priceDropPercent, $provider = null, $location = null)
    {
        // Check if price drop meets minimum thresholds
        if ($priceDropAmount < $this->min_price_drop_amount && $priceDropPercent < $this->min_price_drop_percent) {
            return false;
        }

        // Check if provider is excluded
        if ($provider && $this->excluded_providers && in_array($provider, $this->excluded_providers)) {
            return false;
        }

        // Check if location is included (if specified)
        if ($location && $this->included_locations && !in_array($location, $this->included_locations)) {
            return false;
        }

        // Check quiet hours
        if ($this->isInQuietHours()) {
            return false;
        }

        return true;
    }

    public function isInQuietHours()
    {
        if (!$this->quiet_hours_start || !$this->quiet_hours_end) {
            return false;
        }

        $now = now();
        $start = $this->quiet_hours_start;
        $end = $this->quiet_hours_end;

        // Handle overnight quiet hours
        if ($start > $end) {
            return $now->format('H:i') >= $start->format('H:i') || $now->format('H:i') <= $end->format('H:i');
        }

        return $now->format('H:i') >= $start->format('H:i') && $now->format('H:i') <= $end->format('H:i');
    }

    public function getNotificationMethods()
    {
        $methods = [];
        
        if ($this->email_notifications) {
            $methods[] = 'email';
        }
        
        if ($this->push_notifications) {
            $methods[] = 'push';
        }
        
        if ($this->sms_notifications) {
            $methods[] = 'sms';
        }
        
        return $methods;
    }
}
