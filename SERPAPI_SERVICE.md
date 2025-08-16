# SerpAPI Service Documentation

## Overview

The SerpAPI service has been enhanced to provide comprehensive integration with multiple SerpAPI search engines and utilities. This service is designed to work with both real API calls (when configured) and dummy data for demonstration purposes.

## Features

### 1. Hotel Price Checking
- **Method**: `checkHotelPrice($hotelName, $checkIn, $checkOut, $currency, $adults, $children = 0)`
- **Engine**: Google Hotels
- **Integration**: Already integrated with the existing hotel booking system
- **Features**:
  - Real-time price checking
  - Price pulse detection
  - Multiple currency support
  - Guest count handling

### 2. Flight Search
- **Method**: `searchFlights($origin, $destination, $departureDate, $returnDate = null, $adults = 1, $currency = 'USD')`
- **Engine**: Google Flights
- **Features**:
  - One-way and round-trip searches
  - Multiple airline results
  - Price comparison
  - Stop information

### 3. Web Search
- **Method**: `webSearch($query, $num = 10, $country = 'us')`
- **Engine**: Google Search
- **Features**:
  - Customizable result count
  - Country-specific searches
  - Structured result format

### 4. Currency Conversion
- **Method**: `convertCurrency($amount, $fromCurrency, $toCurrency)`
- **Features**:
  - Real-time exchange rates
  - Support for major currencies
  - Automatic currency detection

### 5. Exchange Rates
- **Method**: `getExchangeRates($baseCurrency = 'USD')`
- **Supported Currencies**: USD, EUR, GBP, CAD, JPY, AUD, CHF, CNY

### 6. API Management
- **Method**: `getApiUsage()`
- **Features**:
  - Request tracking
  - Rate limit monitoring
  - Usage statistics

## API Endpoints

### Connection Testing
```
GET /api/serp/test-connection
```
Tests the SerpAPI connection and returns usage statistics.

### Flight Search
```
POST /api/serp/search-flights
```
Search for flights with parameters:
- `origin`: Airport code (e.g., "JFK")
- `destination`: Airport code (e.g., "LAX")
- `departure_date`: Date in YYYY-MM-DD format
- `return_date`: Optional return date
- `adults`: Number of adult passengers
- `currency`: Currency code (e.g., "USD")

### Web Search
```
POST /api/serp/web-search
```
Perform web searches with parameters:
- `query`: Search query
- `num`: Number of results (1-20)
- `country`: Country code (e.g., "us")

### Currency Conversion
```
POST /api/serp/convert-currency
```
Convert between currencies with parameters:
- `amount`: Amount to convert
- `from_currency`: Source currency code
- `to_currency`: Target currency code

### Exchange Rates
```
GET /api/serp/exchange-rates?base_currency=USD
```
Get current exchange rates for all supported currencies.

### API Usage
```
GET /api/serp/usage
```
Get current API usage statistics.

## Demo Interface

Access the interactive demo at: `/serp-demo`

The demo interface includes:
- Connection status testing
- Flight search with results display
- Web search with formatted results
- Currency conversion calculator
- Real-time API usage monitoring

## Configuration

### Environment Variables
```env
SERPAPI_KEY=your_serpapi_key_here
```

### Service Provider Registration
The service is automatically registered in the Laravel service container and can be injected into controllers and other classes.

## Usage Examples

### In Controllers
```php
use App\Services\SerpApiService;

class MyController extends Controller
{
    public function __construct(SerpApiService $serpApi)
    {
        $this->serpApi = $serpApi;
    }

    public function searchHotels()
    {
        $prices = $this->serpApi->checkHotelPrice(
            'Fairmont Royal York',
            '2025-09-01',
            '2025-09-05',
            'CAD',
            2
        );
        
        return response()->json($prices);
    }
}
```

### In Jobs
```php
use App\Services\SerpApiService;

class CheckPricesJob implements ShouldQueue
{
    public function handle(SerpApiService $serpApi)
    {
        $flights = $serpApi->searchFlights(
            'JFK',
            'LAX',
            '2025-09-01',
            '2025-09-08',
            1,
            'USD'
        );
        
        // Process flight results
    }
}
```

## Rate Limiting

The service includes built-in rate limiting:
- Configurable delay between requests
- Hourly request limits
- Automatic throttling
- Error handling for exceeded limits

## Error Handling

All methods include comprehensive error handling:
- API connection failures
- Invalid responses
- Rate limit exceeded
- Network timeouts
- Detailed logging for debugging

## Dummy Data Mode

When no valid API key is configured, the service operates in dummy data mode:
- Realistic price variations
- Simulated API responses
- Demo-friendly data generation
- No external API calls

## Integration with Existing System

The enhanced SerpAPI service is fully integrated with:
- Hotel booking system
- Price monitoring jobs
- Background task processing
- User notification system
- Dashboard reporting

## Future Enhancements

Potential future features:
- Image search integration
- Shopping search
- News search
- Local search
- Advanced filtering options
- Caching layer
- Webhook support
