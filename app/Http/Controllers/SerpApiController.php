<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SerpApiService;
use Illuminate\Support\Facades\Log;

class SerpApiController extends Controller
{
    protected $serpApiService;

    public function __construct(SerpApiService $serpApiService)
    {
        $this->serpApiService = $serpApiService;
    }

    /**
     * Test the SerpAPI service connection
     */
    public function testConnection()
    {
        try {
            $isConnected = $this->serpApiService->testConnection();
            $usage = $this->serpApiService->getApiUsage();

            return response()->json([
                'success' => true,
                'connected' => $isConnected,
                'usage' => $usage
            ]);
        } catch (\Exception $e) {
            Log::error('SerpAPI connection test failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search for flights
     */
    public function searchFlights(Request $request)
    {
        $validated = $request->validate([
            'origin' => 'required|string|max:10',
            'destination' => 'required|string|max:10',
            'departure_date' => 'required|date|after:today',
            'return_date' => 'nullable|date|after:departure_date',
            'adults' => 'integer|min:1|max:10',
            'currency' => 'string|max:3'
        ]);

        try {
            $flights = $this->serpApiService->searchFlights(
                $validated['origin'],
                $validated['destination'],
                $validated['departure_date'],
                $validated['return_date'] ?? null,
                $validated['adults'] ?? 1,
                $validated['currency'] ?? 'USD'
            );

            return response()->json([
                'success' => true,
                'flights' => $flights
            ]);
        } catch (\Exception $e) {
            Log::error('Flight search failed', [
                'request' => $validated,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Perform web search
     */
    public function webSearch(Request $request)
    {
        $validated = $request->validate([
            'query' => 'required|string|max:255',
            'num' => 'integer|min:1|max:20',
            'country' => 'string|max:2'
        ]);

        try {
            $results = $this->serpApiService->webSearch(
                $validated['query'],
                $validated['num'] ?? 10,
                $validated['country'] ?? 'us'
            );

            return response()->json([
                'success' => true,
                'results' => $results
            ]);
        } catch (\Exception $e) {
            Log::error('Web search failed', [
                'query' => $validated['query'],
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Convert currency
     */
    public function convertCurrency(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'from_currency' => 'required|string|max:3',
            'to_currency' => 'required|string|max:3'
        ]);

        try {
            $convertedAmount = $this->serpApiService->convertCurrency(
                $validated['amount'],
                strtoupper($validated['from_currency']),
                strtoupper($validated['to_currency'])
            );

            return response()->json([
                'success' => true,
                'original_amount' => $validated['amount'],
                'original_currency' => strtoupper($validated['from_currency']),
                'converted_amount' => round($convertedAmount, 2),
                'target_currency' => strtoupper($validated['to_currency'])
            ]);
        } catch (\Exception $e) {
            Log::error('Currency conversion failed', [
                'request' => $validated,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get exchange rates
     */
    public function getExchangeRates(Request $request)
    {
        $baseCurrency = $request->get('base_currency', 'USD');

        try {
            $rates = $this->serpApiService->getExchangeRates(strtoupper($baseCurrency));

            return response()->json([
                'success' => true,
                'base_currency' => strtoupper($baseCurrency),
                'rates' => $rates,
                'last_updated' => now()->toISOString()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get exchange rates', [
                'base_currency' => $baseCurrency,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get API usage statistics
     */
    public function getApiUsage()
    {
        try {
            $usage = $this->serpApiService->getApiUsage();

            return response()->json([
                'success' => true,
                'usage' => $usage
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get API usage', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
