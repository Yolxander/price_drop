<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SerpApiService
{
    protected $apiKey;
    protected $baseUrl = 'https://serpapi.com/search.json';

    public function __construct()
    {
        $this->apiKey = env('SERPAPI_KEY', 'dummy_key_for_demo');
    }

    /**
     * Check hotel prices using SerpAPI's Google Hotels API
     */
    public function checkHotelPrice($hotelName, $checkIn, $checkOut, $currency, $adults, $children = 0)
    {
        try {
            // For demo purposes, return dummy data
            // In production, this would make an actual API call
            return $this->getDummyHotelPrice($hotelName, $checkIn, $checkOut, $currency, $adults);
            
            // Real API call would look like this:
            /*
            $response = Http::get($this->baseUrl, [
                'engine' => 'google_hotels',
                'q' => $hotelName,
                'check_in_date' => $checkIn,
                'check_out_date' => $checkOut,
                'currency' => $currency,
                'adults' => $adults,
                'children' => $children,
                'hl' => 'en',
                'api_key' => $this->apiKey
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $this->parseHotelResponse($data);
            }

            Log::error('SerpAPI request failed', [
                'hotel' => $hotelName,
                'response' => $response->body()
            ]);

            return null;
            */
        } catch (\Exception $e) {
            Log::error('Error checking hotel price', [
                'hotel' => $hotelName,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Parse the SerpAPI response
     */
    protected function parseHotelResponse($data)
    {
        if (!isset($data['properties']) || empty($data['properties'])) {
            return null;
        }

        $property = $data['properties'][0];
        
        return [
            'hotel_name' => $property['name'] ?? '',
            'price' => $this->extractPrice($property['price'] ?? ''),
            'total_price' => $this->extractPrice($property['total_price'] ?? ''),
            'rating' => $property['rating'] ?? null,
            'reviews' => $property['reviews'] ?? null,
            'link' => $property['link'] ?? '',
            'currency' => $this->extractCurrency($property['price'] ?? ''),
            'available' => true
        ];
    }

    /**
     * Extract numeric price from string
     */
    protected function extractPrice($priceString)
    {
        if (empty($priceString)) return null;
        
        // Remove currency symbols and extract number
        $price = preg_replace('/[^\d.,]/', '', $priceString);
        $price = str_replace(',', '', $price);
        
        return (float) $price;
    }

    /**
     * Extract currency from price string
     */
    protected function extractCurrency($priceString)
    {
        if (empty($priceString)) return 'USD';
        
        // Simple currency detection
        if (str_contains($priceString, '$')) return 'USD';
        if (str_contains($priceString, '€')) return 'EUR';
        if (str_contains($priceString, '£')) return 'GBP';
        if (str_contains($priceString, '¥')) return 'JPY';
        if (str_contains($priceString, 'C$')) return 'CAD';
        
        return 'USD';
    }

    /**
     * Get dummy hotel price data for demo purposes
     */
    protected function getDummyHotelPrice($hotelName, $checkIn, $checkOut, $currency, $adults)
    {
        // Simulate some price variation based on hotel name and dates
        $basePrice = $this->getBasePrice($hotelName);
        $dateMultiplier = $this->getDateMultiplier($checkIn);
        $randomVariation = rand(-20, 20) / 100; // ±20% random variation
        
        $currentPrice = $basePrice * $dateMultiplier * (1 + $randomVariation);
        
        return [
            'hotel_name' => $hotelName,
            'price' => round($currentPrice, 2),
            'total_price' => round($currentPrice * $adults, 2),
            'rating' => rand(35, 50) / 10, // 3.5 to 5.0
            'reviews' => rand(100, 10000),
            'link' => 'https://www.google.com/travel/hotels/entity/dummy',
            'currency' => $currency,
            'available' => true,
            'last_checked' => now()->toISOString()
        ];
    }

    /**
     * Get base price for different hotels
     */
    protected function getBasePrice($hotelName)
    {
        $hotelName = strtolower($hotelName);
        
        if (str_contains($hotelName, 'ritz')) return 400;
        if (str_contains($hotelName, 'fairmont')) return 300;
        if (str_contains($hotelName, 'hyatt')) return 350;
        if (str_contains($hotelName, 'arts')) return 200;
        if (str_contains($hotelName, 'marriott')) return 250;
        if (str_contains($hotelName, 'hilton')) return 220;
        
        return 250; // Default price
    }

    /**
     * Get price multiplier based on check-in date
     */
    protected function getDateMultiplier($checkIn)
    {
        $checkInDate = \Carbon\Carbon::parse($checkIn);
        $daysUntilCheckIn = now()->diffInDays($checkInDate);
        
        // Prices are higher for closer dates, lower for distant dates
        if ($daysUntilCheckIn < 7) return 1.5; // Last minute
        if ($daysUntilCheckIn < 30) return 1.2; // Near term
        if ($daysUntilCheckIn < 90) return 1.0; // Normal
        if ($daysUntilCheckIn < 180) return 0.9; // Advance booking
        return 0.8; // Far advance
    }

    /**
     * Check if API is working
     */
    public function testConnection()
    {
        // For demo, always return true
        return true;
        
        // Real implementation would test the API
        /*
        try {
            $response = Http::timeout(10)->get($this->baseUrl, [
                'engine' => 'google_hotels',
                'q' => 'test',
                'api_key' => $this->apiKey
            ]);
            
            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
        */
    }
}
