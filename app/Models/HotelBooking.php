<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_name',
        'location',
        'check_in_date',
        'check_out_date',
        'guests',
        'currency',
        'original_price',
        'current_price',
        'last_checked',
        'status',
        'price_drop_detected',
        'price_drop_amount',
        'booking_reference',
        'user_id'
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'last_checked' => 'datetime',
        'original_price' => 'decimal:2',
        'current_price' => 'decimal:2',
        'price_drop_amount' => 'decimal:2',
        'price_drop_detected' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
