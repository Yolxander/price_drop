<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_name',
        'canonical_hotel_id',
        'canonical_hotel_name',
        'star_rating',
        'address',
        'latitude',
        'longitude',
        'location',
        'check_in_date',
        'check_out_date',
        'guests',
        'currency',
        'original_price',
        'current_price',
        'base_rate',
        'taxes_fees',
        'cancellation_policy',
        'breakfast_included',
        'amenities',
        'facilities',
        'room_type',
        'room_code',
        'room_description',
        'booking_link',
        'hotel_website',
        'screenshots',
        'last_checked',
        'status',
        'price_drop_detected',
        'price_drop_amount',
        'booking_reference',
        'enriched_at',
        'enrichment_successful',
        'enrichment_error',
        'user_id'
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'last_checked' => 'datetime',
        'enriched_at' => 'datetime',
        'original_price' => 'decimal:2',
        'current_price' => 'decimal:2',
        'price_drop_amount' => 'decimal:2',
        'star_rating' => 'decimal:1',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'base_rate' => 'decimal:2',
        'taxes_fees' => 'decimal:2',
        'price_drop_detected' => 'boolean',
        'breakfast_included' => 'boolean',
        'enrichment_successful' => 'boolean',
        'amenities' => 'array',
        'facilities' => 'array',
        'screenshots' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get enriched hotel data for display
     */
    public function getEnrichedData()
    {
        return [
            'overview' => [
                'canonical_name' => $this->canonical_hotel_name ?? $this->hotel_name,
                'star_rating' => $this->star_rating,
                'address' => $this->address,
                'location' => $this->location,
                'coordinates' => $this->latitude && $this->longitude ? [
                    'lat' => $this->latitude,
                    'lng' => $this->longitude
                ] : null,
                'hotel_website' => $this->hotel_website,
                'screenshots' => $this->screenshots ?? [],
            ],
            'facilities' => [
                'amenities' => $this->amenities ?? [],
                'facilities' => $this->facilities ?? [],
                'breakfast_included' => $this->breakfast_included,
            ],
            'details' => [
                'room_type' => $this->room_type,
                'room_code' => $this->room_code,
                'room_description' => $this->room_description,
                'base_rate' => $this->base_rate,
                'taxes_fees' => $this->taxes_fees,
                'cancellation_policy' => $this->cancellation_policy,
                'booking_link' => $this->booking_link,
            ],
            'history' => [
                'original_price' => $this->original_price,
                'current_price' => $this->current_price,
                'price_drop_detected' => $this->price_drop_detected,
                'price_drop_amount' => $this->price_drop_amount,
                'last_checked' => $this->last_checked,
                'enriched_at' => $this->enriched_at,
                'enrichment_successful' => $this->enrichment_successful,
            ]
        ];
    }
}
