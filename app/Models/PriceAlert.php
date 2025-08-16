<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class PriceAlert extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_booking_id',
        'user_id',
        'hotel_name',
        'location',
        'provider',
        'booked_price',
        'current_price',
        'delta_amount',
        'delta_percent',
        'currency',
        'rule_threshold',
        'status',
        'severity',
        'triggered_at',
        'actioned_at',
        'notes'
    ];

    protected $casts = [
        'booked_price' => 'decimal:2',
        'current_price' => 'decimal:2',
        'delta_amount' => 'decimal:2',
        'delta_percent' => 'decimal:2',
        'triggered_at' => 'datetime',
        'actioned_at' => 'datetime',
    ];

    public function hotelBooking()
    {
        return $this->belongsTo(HotelBooking::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    public function scopeActioned($query)
    {
        return $query->where('status', 'actioned');
    }

    public function scopeDismissed($query)
    {
        return $query->where('status', 'dismissed');
    }

    public function scopeBySeverity($query, $severity)
    {
        return $query->where('severity', $severity);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function markAsActioned()
    {
        $this->update([
            'status' => 'actioned',
            'actioned_at' => now()
        ]);
    }

    public function dismiss()
    {
        $this->update([
            'status' => 'dismissed',
            'actioned_at' => now()
        ]);
    }

    public function getFormattedDeltaAmountAttribute()
    {
        return number_format(abs($this->delta_amount), 2);
    }

    public function getFormattedDeltaPercentAttribute()
    {
        return number_format(abs($this->delta_percent), 1);
    }

    public function getTimeAgoAttribute()
    {
        return $this->triggered_at->diffForHumans();
    }

    public function getSeverityColorAttribute()
    {
        return match($this->severity) {
            'high' => 'text-red-600',
            'medium' => 'text-yellow-600',
            'low' => 'text-green-600',
            default => 'text-gray-600'
        };
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'new' => 'text-yellow-600',
            'actioned' => 'text-green-600',
            'dismissed' => 'text-gray-600',
            default => 'text-gray-600'
        };
    }
}
