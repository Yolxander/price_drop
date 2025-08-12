import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function SerpApiDemo({ auth }) {
    const [activeTab, setActiveTab] = useState('hotels');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState({});
    const [connectionStatus, setConnectionStatus] = useState(null);

    // Hotel search state
    const [hotelSearch, setHotelSearch] = useState({
        hotel_name: 'Fairmont Royal York',
        check_in: '2025-09-01',
        check_out: '2025-09-05',
        guests: 2,
        currency: 'CAD'
    });

    // Flight search state
    const [flightSearch, setFlightSearch] = useState({
        origin: 'JFK',
        destination: 'LAX',
        departure_date: '2025-09-01',
        return_date: '2025-09-08',
        adults: 1,
        currency: 'USD'
    });

    // Web search state
    const [webSearch, setWebSearch] = useState({
        query: 'Laravel development',
        num: 5,
        country: 'us'
    });

    // Currency conversion state
    const [currencyConversion, setCurrencyConversion] = useState({
        amount: 100,
        from_currency: 'USD',
        to_currency: 'EUR'
    });

    const testConnection = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/serp/test-connection');
            const data = await response.json();
            setConnectionStatus(data);
        } catch (error) {
            console.error('Connection test failed:', error);
            setConnectionStatus({ success: false, error: 'Connection failed' });
        }
        setLoading(false);
    };

    const searchFlights = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/serp/search-flights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(flightSearch)
            });
            const data = await response.json();
            setResults(prev => ({ ...prev, flights: data.flights }));
        } catch (error) {
            console.error('Flight search failed:', error);
        }
        setLoading(false);
    };

    const performWebSearch = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/serp/web-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(webSearch)
            });
            const data = await response.json();
            setResults(prev => ({ ...prev, webSearch: data.results }));
        } catch (error) {
            console.error('Web search failed:', error);
        }
        setLoading(false);
    };

    const convertCurrency = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/serp/convert-currency', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(currencyConversion)
            });
            const data = await response.json();
            setResults(prev => ({ ...prev, currency: data }));
        } catch (error) {
            console.error('Currency conversion failed:', error);
        }
        setLoading(false);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">SerpAPI Service Demo</h2>}
        >
            <Head title="SerpAPI Service Demo" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold mb-2">SerpAPI Service Features</h1>
                                <p className="text-gray-600">
                                    This demo showcases the enhanced SerpAPI service with multiple search engines and utilities.
                                </p>
                            </div>

                            {/* Connection Status */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>API Connection Status</CardTitle>
                                    <CardDescription>
                                        Test the SerpAPI connection and view usage statistics
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            onClick={testConnection}
                                            disabled={loading}
                                            variant="outline"
                                        >
                                            {loading ? 'Testing...' : 'Test Connection'}
                                        </Button>

                                        {connectionStatus && (
                                            <div className="flex items-center gap-2">
                                                <Badge variant={connectionStatus.success ? "default" : "destructive"}>
                                                    {connectionStatus.success ? 'Connected' : 'Failed'}
                                                </Badge>
                                                {connectionStatus.usage && (
                                                    <span className="text-sm text-gray-600">
                                                        {connectionStatus.usage.remaining_requests} requests remaining
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Main Features Tabs */}
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="hotels">Hotels</TabsTrigger>
                                    <TabsTrigger value="flights">Flights</TabsTrigger>
                                    <TabsTrigger value="web">Web Search</TabsTrigger>
                                    <TabsTrigger value="currency">Currency</TabsTrigger>
                                </TabsList>

                                <TabsContent value="hotels" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Hotel Price Checking</CardTitle>
                                            <CardDescription>
                                                Check hotel prices using SerpAPI's Google Hotels integration
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <Label htmlFor="hotel_name">Hotel Name</Label>
                                                    <Input
                                                        id="hotel_name"
                                                        value={hotelSearch.hotel_name}
                                                        onChange={(e) => setHotelSearch(prev => ({ ...prev, hotel_name: e.target.value }))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="guests">Guests</Label>
                                                    <Input
                                                        id="guests"
                                                        type="number"
                                                        value={hotelSearch.guests}
                                                        onChange={(e) => setHotelSearch(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="check_in">Check-in Date</Label>
                                                    <Input
                                                        id="check_in"
                                                        type="date"
                                                        value={hotelSearch.check_in}
                                                        onChange={(e) => setHotelSearch(prev => ({ ...prev, check_in: e.target.value }))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="check_out">Check-out Date</Label>
                                                    <Input
                                                        id="check_out"
                                                        type="date"
                                                        value={hotelSearch.check_out}
                                                        onChange={(e) => setHotelSearch(prev => ({ ...prev, check_out: e.target.value }))}
                                                    />
                                                </div>
                                            </div>
                                            <Button disabled={loading} className="w-full">
                                                Check Hotel Price (Integrated with existing booking system)
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="flights" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Flight Search</CardTitle>
                                            <CardDescription>
                                                Search for flights using SerpAPI's Google Flights integration
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <Label htmlFor="origin">Origin Airport</Label>
                                                    <Input
                                                        id="origin"
                                                        value={flightSearch.origin}
                                                        onChange={(e) => setFlightSearch(prev => ({ ...prev, origin: e.target.value }))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="destination">Destination Airport</Label>
                                                    <Input
                                                        id="destination"
                                                        value={flightSearch.destination}
                                                        onChange={(e) => setFlightSearch(prev => ({ ...prev, destination: e.target.value }))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="departure_date">Departure Date</Label>
                                                    <Input
                                                        id="departure_date"
                                                        type="date"
                                                        value={flightSearch.departure_date}
                                                        onChange={(e) => setFlightSearch(prev => ({ ...prev, departure_date: e.target.value }))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="return_date">Return Date</Label>
                                                    <Input
                                                        id="return_date"
                                                        type="date"
                                                        value={flightSearch.return_date}
                                                        onChange={(e) => setFlightSearch(prev => ({ ...prev, return_date: e.target.value }))}
                                                    />
                                                </div>
                                            </div>
                                            <Button onClick={searchFlights} disabled={loading} className="w-full">
                                                {loading ? 'Searching...' : 'Search Flights'}
                                            </Button>

                                            {results.flights && (
                                                <div className="mt-6">
                                                    <h3 className="font-semibold mb-3">Search Results:</h3>
                                                    <div className="space-y-3">
                                                        {results.flights.map((flight, index) => (
                                                            <Card key={index}>
                                                                <CardContent className="p-4">
                                                                    <div className="flex justify-between items-center">
                                                                        <div>
                                                                            <div className="font-medium">{flight.airline}</div>
                                                                            <div className="text-sm text-gray-600">
                                                                                {flight.departure_time} - {flight.arrival_time} ({flight.duration})
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <div className="font-bold">${flight.price}</div>
                                                                            <div className="text-sm text-gray-600">
                                                                                {flight.stops} stop{flight.stops !== 1 ? 's' : ''}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="web" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Web Search</CardTitle>
                                            <CardDescription>
                                                Perform web searches using SerpAPI's Google Search integration
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="col-span-2">
                                                    <Label htmlFor="query">Search Query</Label>
                                                    <Input
                                                        id="query"
                                                        value={webSearch.query}
                                                        onChange={(e) => setWebSearch(prev => ({ ...prev, query: e.target.value }))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="num">Number of Results</Label>
                                                    <Input
                                                        id="num"
                                                        type="number"
                                                        min="1"
                                                        max="20"
                                                        value={webSearch.num}
                                                        onChange={(e) => setWebSearch(prev => ({ ...prev, num: parseInt(e.target.value) }))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="country">Country</Label>
                                                    <Input
                                                        id="country"
                                                        value={webSearch.country}
                                                        onChange={(e) => setWebSearch(prev => ({ ...prev, country: e.target.value }))}
                                                    />
                                                </div>
                                            </div>
                                            <Button onClick={performWebSearch} disabled={loading} className="w-full">
                                                {loading ? 'Searching...' : 'Search Web'}
                                            </Button>

                                            {results.webSearch && (
                                                <div className="mt-6">
                                                    <h3 className="font-semibold mb-3">Search Results:</h3>
                                                    <div className="space-y-3">
                                                        {results.webSearch.map((result, index) => (
                                                            <Card key={index}>
                                                                <CardContent className="p-4">
                                                                    <div className="space-y-2">
                                                                        <div className="font-medium text-blue-600">
                                                                            <a href={result.link} target="_blank" rel="noopener noreferrer">
                                                                                {result.title}
                                                                            </a>
                                                                        </div>
                                                                        <div className="text-sm text-gray-600">{result.snippet}</div>
                                                                        <div className="text-xs text-gray-500">{result.link}</div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="currency" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Currency Conversion</CardTitle>
                                            <CardDescription>
                                                Convert between different currencies using exchange rates
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <Label htmlFor="amount">Amount</Label>
                                                    <Input
                                                        id="amount"
                                                        type="number"
                                                        value={currencyConversion.amount}
                                                        onChange={(e) => setCurrencyConversion(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="from_currency">From</Label>
                                                    <Input
                                                        id="from_currency"
                                                        value={currencyConversion.from_currency}
                                                        onChange={(e) => setCurrencyConversion(prev => ({ ...prev, from_currency: e.target.value }))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="to_currency">To</Label>
                                                    <Input
                                                        id="to_currency"
                                                        value={currencyConversion.to_currency}
                                                        onChange={(e) => setCurrencyConversion(prev => ({ ...prev, to_currency: e.target.value }))}
                                                    />
                                                </div>
                                            </div>
                                            <Button onClick={convertCurrency} disabled={loading} className="w-full">
                                                {loading ? 'Converting...' : 'Convert Currency'}
                                            </Button>

                                            {results.currency && (
                                                <div className="mt-6">
                                                    <Card>
                                                        <CardContent className="p-4">
                                                            <div className="text-center">
                                                                <div className="text-2xl font-bold">
                                                                    {results.currency.original_amount} {results.currency.original_currency}
                                                                </div>
                                                                <div className="text-gray-500">equals</div>
                                                                <div className="text-3xl font-bold text-green-600">
                                                                    {results.currency.converted_amount} {results.currency.target_currency}
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
