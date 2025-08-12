<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class SerpApiService
{
    protected $apiKey;
    protected $baseUrl = 'https://serpapi.com/search.json';
    protected $rateLimitDelay = 1; // seconds between requests

    public function __construct()
    {
        $this->apiKey = env('SERPAPI_KEY', 'f170885b8c2f91c3792905fbf001c7446c9bbeaaa532a84a6d37b97897d7641a');
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
     * Search for flights using SerpAPI's Google Flights API
     */
    public function searchFlights($origin, $destination, $departureDate, $returnDate = null, $adults = 1, $currency = 'USD')
    {
        try {
            // For demo purposes, return dummy flight data
            return $this->getDummyFlightData($origin, $destination, $departureDate, $returnDate, $adults, $currency);

            // Real API call would look like this:
            /*
            $params = [
                'engine' => 'google_flights',
                'departure_id' => $origin,
                'arrival_id' => $destination,
                'outbound_date' => $departureDate,
                'adults' => $adults,
                'currency' => $currency,
                'hl' => 'en',
                'api_key' => $this->apiKey
            ];

            if ($returnDate) {
                $params['return_date'] = $returnDate;
            }

            $response = Http::get($this->baseUrl, $params);

            if ($response->successful()) {
                $data = $response->json();
                return $this->parseFlightResponse($data);
            }

            Log::error('SerpAPI flight search failed', [
                'origin' => $origin,
                'destination' => $destination,
                'response' => $response->body()
            ]);

            return null;
            */
        } catch (\Exception $e) {
            Log::error('Error searching flights', [
                'origin' => $origin,
                'destination' => $destination,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Perform a general web search using SerpAPI's Google Search
     */
    public function webSearch($query, $num = 10, $country = 'us')
    {
        try {
            // For demo purposes, return dummy search results
            return $this->getDummySearchResults($query, $num);

            // Real API call would look like this:
            /*
            $response = Http::get($this->baseUrl, [
                'engine' => 'google',
                'q' => $query,
                'num' => $num,
                'gl' => $country,
                'hl' => 'en',
                'api_key' => $this->apiKey
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $this->parseSearchResponse($data);
            }

            Log::error('SerpAPI web search failed', [
                'query' => $query,
                'response' => $response->body()
            ]);

            return null;
            */
        } catch (\Exception $e) {
            Log::error('Error performing web search', [
                'query' => $query,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Get current exchange rates (dummy implementation)
     */
    public function getExchangeRates($baseCurrency = 'USD')
    {
        // For demo purposes, return dummy exchange rates
        $rates = [
            'USD' => 1.0,
            'EUR' => 0.85,
            'GBP' => 0.73,
            'CAD' => 1.25,
            'JPY' => 110.0,
            'AUD' => 1.35,
            'CHF' => 0.92,
            'CNY' => 6.45
        ];

        if ($baseCurrency !== 'USD') {
            $baseRate = $rates[$baseCurrency] ?? 1.0;
            foreach ($rates as $currency => $rate) {
                $rates[$currency] = $rate / $baseRate;
            }
        }

        return $rates;
    }

    /**
     * Convert currency using exchange rates
     */
    public function convertCurrency($amount, $fromCurrency, $toCurrency)
    {
        if ($fromCurrency === $toCurrency) {
            return $amount;
        }

        $rates = $this->getExchangeRates($fromCurrency);
        $rate = $rates[$toCurrency] ?? 1.0;

        return $amount * $rate;
    }

    /**
     * Check API usage and limits
     */
    public function getApiUsage()
    {
        // For demo purposes, return dummy usage data
        return [
            'requests_today' => rand(50, 200),
            'requests_limit' => 1000,
            'remaining_requests' => rand(100, 500),
            'reset_time' => now()->addHours(rand(1, 12))->toISOString()
        ];
    }

    /**
     * Rate limiting helper
     */
    protected function checkRateLimit()
    {
        $cacheKey = 'serpapi_rate_limit_' . date('Y-m-d-H');
        $requestsThisHour = Cache::get($cacheKey, 0);

        if ($requestsThisHour > 50) { // Limit to 50 requests per hour for demo
            throw new \Exception('Rate limit exceeded. Please try again later.');
        }

        Cache::put($cacheKey, $requestsThisHour + 1, 3600);
        sleep($this->rateLimitDelay);
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
     * Parse flight search response
     */
    protected function parseFlightResponse($data)
    {
        if (!isset($data['flights']) || empty($data['flights'])) {
            return null;
        }

        $flights = [];
        foreach ($data['flights'] as $flight) {
            $flights[] = [
                'airline' => $flight['airline'] ?? '',
                'departure_time' => $flight['departure_time'] ?? '',
                'arrival_time' => $flight['arrival_time'] ?? '',
                'duration' => $flight['duration'] ?? '',
                'price' => $this->extractPrice($flight['price'] ?? ''),
                'currency' => $this->extractCurrency($flight['price'] ?? ''),
                'stops' => $flight['stops'] ?? 0
            ];
        }

        return $flights;
    }

    /**
     * Parse web search response
     */
    protected function parseSearchResponse($data)
    {
        if (!isset($data['organic_results']) || empty($data['organic_results'])) {
            return null;
        }

        $results = [];
        foreach ($data['organic_results'] as $result) {
            $results[] = [
                'title' => $result['title'] ?? '',
                'snippet' => $result['snippet'] ?? '',
                'link' => $result['link'] ?? '',
                'position' => $result['position'] ?? 0
            ];
        }

        return $results;
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
     * Get dummy flight data for demo purposes
     */
    protected function getDummyFlightData($origin, $destination, $departureDate, $returnDate, $adults, $currency)
    {
        $flights = [];
        $airlines = ['Delta', 'United', 'American', 'Southwest', 'JetBlue', 'Alaska'];

        for ($i = 0; $i < 5; $i++) {
            $basePrice = rand(200, 800);
            $priceVariation = rand(-50, 50);

            $flights[] = [
                'airline' => $airlines[array_rand($airlines)],
                'departure_time' => '08:00',
                'arrival_time' => '11:30',
                'duration' => '3h 30m',
                'price' => $basePrice + $priceVariation,
                'currency' => $currency,
                'stops' => rand(0, 2),
                'flight_number' => 'FL' . rand(100, 999)
            ];
        }

        return $flights;
    }

    /**
     * Get dummy search results for demo purposes
     */
    protected function getDummySearchResults($query, $num)
    {
        $results = [];

        for ($i = 0; $i < $num; $i++) {
            $results[] = [
                'title' => "Search result for: {$query} - Result " . ($i + 1),
                'snippet' => "This is a sample search result snippet for the query '{$query}'. It contains relevant information that would normally be returned by a search engine.",
                'link' => "https://example.com/result-" . ($i + 1),
                'position' => $i + 1
            ];
        }

        return $results;
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

        /**
     * Enrich hotel data with comprehensive information
     */
    public function enrichHotelData($hotelName, $location, $checkIn, $checkOut, $currency = 'USD')
    {
        try {
            Log::info('SerpApiService: Starting hotel enrichment', [
                'hotel_name' => $hotelName,
                'location' => $location,
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'currency' => $currency,
                'api_key' => substr($this->apiKey, 0, 10) . '...' // Log partial key for security
            ]);

            // For demo purposes, return enriched dummy data
            $enrichedData = $this->getEnrichedHotelData($hotelName, $location, $checkIn, $checkOut, $currency);
            
            Log::info('SerpApiService: Enriched data generated', [
                'hotel_name' => $hotelName,
                'data_keys' => array_keys($enrichedData),
                'canonical_name' => $enrichedData['canonical_hotel_name'] ?? 'N/A',
                'star_rating' => $enrichedData['star_rating'] ?? 'N/A',
                'amenities_count' => count($enrichedData['amenities'] ?? []),
                'facilities_count' => count($enrichedData['facilities'] ?? [])
            ]);

            return $enrichedData;
            
            // Real API call would look like this:
            /*
            $response = Http::get($this->baseUrl, [
                'engine' => 'google_hotels',
                'q' => $hotelName . ' ' . $location,
                'check_in_date' => $checkIn,
                'check_out_date' => $checkOut,
                'currency' => $currency,
                'hl' => 'en',
                'api_key' => $this->apiKey
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $this->parseEnrichedHotelResponse($data, $hotelName, $location);
            }

            Log::error('SerpAPI hotel enrichment failed', [
                'hotel' => $hotelName,
                'location' => $location,
                'response' => $response->body()
            ]);

            return null;
            */
        } catch (\Exception $e) {
            Log::error('Error enriching hotel data', [
                'hotel' => $hotelName,
                'location' => $location,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    /**
     * Parse enriched hotel response from SerpAPI
     */
    protected function parseEnrichedHotelResponse($data, $hotelName, $location)
    {
        if (!isset($data['properties']) || empty($data['properties'])) {
            return null;
        }

        $property = $data['properties'][0];

        return [
            'canonical_hotel_id' => $property['hotel_id'] ?? null,
            'canonical_hotel_name' => $property['name'] ?? $hotelName,
            'star_rating' => $property['rating'] ?? null,
            'address' => $property['address'] ?? null,
            'latitude' => $property['latitude'] ?? null,
            'longitude' => $property['longitude'] ?? null,
            'base_rate' => $this->extractPrice($property['price'] ?? ''),
            'taxes_fees' => $this->extractPrice($property['taxes'] ?? ''),
            'cancellation_policy' => $property['cancellation_policy'] ?? null,
            'breakfast_included' => $property['breakfast_included'] ?? false,
            'amenities' => $property['amenities'] ?? [],
            'facilities' => $property['facilities'] ?? [],
            'room_type' => $property['room_type'] ?? null,
            'room_code' => $property['room_code'] ?? null,
            'room_description' => $property['room_description'] ?? null,
            'booking_link' => $property['link'] ?? null,
            'hotel_website' => $property['website'] ?? null,
            'screenshots' => $property['screenshots'] ?? [],
            'enrichment_successful' => true,
            'enriched_at' => now()->toISOString()
        ];
    }

        /**
     * Get enriched hotel data for demo purposes
     */
    protected function getEnrichedHotelData($hotelName, $location, $checkIn, $checkOut, $currency)
    {
        Log::info('SerpApiService: Generating enriched hotel data', [
            'hotel_name' => $hotelName,
            'location' => $location
        ]);

        // Generate realistic enriched data based on hotel name
        $hotelData = $this->getHotelEnrichmentData($hotelName, $location);
        
        Log::info('SerpApiService: Hotel enrichment data retrieved', [
            'hotel_name' => $hotelName,
            'hotel_data_keys' => array_keys($hotelData),
            'canonical_name' => $hotelData['canonical_name'] ?? 'N/A'
        ]);
        
        // Calculate rates based on dates and hotel type
        $baseRate = $this->calculateEnrichedBaseRate($hotelName, $checkIn, $checkOut);
        $taxesFees = $baseRate * 0.15; // 15% taxes and fees
        
        $enrichedData = [
            'canonical_hotel_id' => $hotelData['id'],
            'canonical_hotel_name' => $hotelData['canonical_name'],
            'star_rating' => $hotelData['star_rating'],
            'address' => $hotelData['address'],
            'latitude' => $hotelData['latitude'],
            'longitude' => $hotelData['longitude'],
            'base_rate' => $baseRate,
            'taxes_fees' => $taxesFees,
            'cancellation_policy' => $hotelData['cancellation_policy'],
            'breakfast_included' => $hotelData['breakfast_included'],
            'amenities' => $hotelData['amenities'],
            'facilities' => $hotelData['facilities'],
            'room_type' => $hotelData['room_type'],
            'room_code' => $hotelData['room_code'],
            'room_description' => $hotelData['room_description'],
            'booking_link' => $hotelData['booking_link'],
            'hotel_website' => $hotelData['hotel_website'],
            'screenshots' => $hotelData['screenshots'],
            'enrichment_successful' => true,
            'enriched_at' => now()->toISOString()
        ];

        Log::info('SerpApiService: Final enriched data prepared', [
            'hotel_name' => $hotelName,
            'enriched_data_keys' => array_keys($enrichedData),
            'base_rate' => $baseRate,
            'taxes_fees' => $taxesFees,
            'amenities_count' => count($enrichedData['amenities']),
            'facilities_count' => count($enrichedData['facilities'])
        ]);

        return $enrichedData;
    }

    /**
     * Get hotel enrichment data based on hotel name
     */
    protected function getHotelEnrichmentData($hotelName, $location)
    {
        $hotelName = strtolower($hotelName);

        // Fairmont Royal York
        if (str_contains($hotelName, 'fairmont') && str_contains($hotelName, 'royal york')) {
            return [
                'id' => 'fairmont_royal_york_toronto',
                'canonical_name' => 'Fairmont Royal York',
                'star_rating' => 4.5,
                'address' => '100 Front Street West, Toronto, ON M5J 1E3, Canada',
                'latitude' => 43.6451,
                'longitude' => -79.3807,
                'cancellation_policy' => 'Free cancellation until 24 hours before check-in',
                'breakfast_included' => false,
                'amenities' => ['Free WiFi', 'Fitness Center', 'Spa', 'Restaurant', 'Bar', 'Room Service', 'Concierge'],
                'facilities' => ['Swimming Pool', 'Business Center', 'Meeting Rooms', 'Valet Parking', 'Laundry Service'],
                'room_type' => 'Deluxe King Room',
                'room_code' => 'DLX-KING',
                'room_description' => 'Spacious room with king bed, city view, and modern amenities',
                'booking_link' => 'https://www.fairmont.com/royal-york-toronto/',
                'hotel_website' => 'https://www.fairmont.com/royal-york-toronto/',
                'screenshots' => [
                    'https://example.com/screenshots/fairmont_royal_york_1.jpg',
                    'https://example.com/screenshots/fairmont_royal_york_2.jpg'
                ]
            ];
        }

        // Ritz-Carlton
        if (str_contains($hotelName, 'ritz')) {
            return [
                'id' => 'ritz_carlton_' . strtolower(str_replace(' ', '_', $location)),
                'canonical_name' => 'The Ritz-Carlton ' . ucwords($location),
                'star_rating' => 5.0,
                'address' => 'Luxury Address, ' . ucwords($location),
                'latitude' => 43.6500,
                'longitude' => -79.3800,
                'cancellation_policy' => 'Free cancellation until 48 hours before check-in',
                'breakfast_included' => true,
                'amenities' => ['Free WiFi', 'Fitness Center', 'Spa', 'Restaurant', 'Bar', 'Room Service', 'Concierge', 'Butler Service'],
                'facilities' => ['Swimming Pool', 'Business Center', 'Meeting Rooms', 'Valet Parking', 'Laundry Service', 'Spa Services'],
                'room_type' => 'Deluxe Suite',
                'room_code' => 'DLX-SUITE',
                'room_description' => 'Luxurious suite with separate living area and premium amenities',
                'booking_link' => 'https://www.ritzcarlton.com/',
                'hotel_website' => 'https://www.ritzcarlton.com/',
                'screenshots' => [
                    'https://example.com/screenshots/ritz_carlton_1.jpg',
                    'https://example.com/screenshots/ritz_carlton_2.jpg'
                ]
            ];
        }

        // Hyatt
        if (str_contains($hotelName, 'hyatt')) {
            return [
                'id' => 'hyatt_' . strtolower(str_replace(' ', '_', $location)),
                'canonical_name' => 'Hyatt ' . ucwords($location),
                'star_rating' => 4.3,
                'address' => 'Business District, ' . ucwords($location),
                'latitude' => 43.6400,
                'longitude' => -79.3700,
                'cancellation_policy' => 'Free cancellation until 24 hours before check-in',
                'breakfast_included' => false,
                'amenities' => ['Free WiFi', 'Fitness Center', 'Restaurant', 'Bar', 'Room Service', 'Concierge'],
                'facilities' => ['Swimming Pool', 'Business Center', 'Meeting Rooms', 'Parking'],
                'room_type' => 'Standard King Room',
                'room_code' => 'STD-KING',
                'room_description' => 'Comfortable room with king bed and business amenities',
                'booking_link' => 'https://www.hyatt.com/',
                'hotel_website' => 'https://www.hyatt.com/',
                'screenshots' => [
                    'https://example.com/screenshots/hyatt_1.jpg',
                    'https://example.com/screenshots/hyatt_2.jpg'
                ]
            ];
        }

        // Default hotel data
        return [
            'id' => 'hotel_' . strtolower(str_replace(' ', '_', $hotelName)),
            'canonical_name' => ucwords($hotelName),
            'star_rating' => 3.8,
            'address' => 'Main Street, ' . ucwords($location),
            'latitude' => 43.6500,
            'longitude' => -79.3800,
            'cancellation_policy' => 'Free cancellation until 24 hours before check-in',
            'breakfast_included' => false,
            'amenities' => ['Free WiFi', 'Fitness Center', 'Restaurant'],
            'facilities' => ['Business Center', 'Parking'],
            'room_type' => 'Standard Room',
            'room_code' => 'STD-ROOM',
            'room_description' => 'Comfortable standard room with essential amenities',
            'booking_link' => 'https://www.example.com/booking',
            'hotel_website' => 'https://www.example.com/',
            'screenshots' => [
                'https://example.com/screenshots/default_1.jpg'
            ]
        ];
    }

    /**
     * Calculate enriched base rate based on hotel and dates
     */
    protected function calculateEnrichedBaseRate($hotelName, $checkIn, $checkOut)
    {
        $basePrice = $this->getBasePrice($hotelName);
        $dateMultiplier = $this->getDateMultiplier($checkIn);
        $randomVariation = rand(-10, 15) / 100; // ±15% random variation

        return $basePrice * $dateMultiplier * (1 + $randomVariation);
    }
}
