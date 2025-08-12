import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@inertiajs/react';
import {
    Home,
    Grid3X3,
    Bell,
    Heart,
    Settings,
    LogOut,
    Search,
    Filter,
    MoreHorizontal,
    MapPin,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Star,
    TrendingDown,
    DollarSign,
    X,
    ArrowRight
} from 'lucide-react';

export default function AlertsIndex({ auth, alerts, stats }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('hotel');
    const [favorites, setFavorites] = useState(new Set([1])); // Opula Haven Hotel is favorited

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD'
        }).format(amount);
    };

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours === 1) return '1 hour ago';
        if (diffInHours < 24) return `${diffInHours} hours ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    };

    const toggleFavorite = (hotelId) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(hotelId)) {
            newFavorites.delete(hotelId);
        } else {
            newFavorites.add(hotelId);
        }
        setFavorites(newFavorites);
    };

    // Sample price drop data
    const priceDrops = [
        {
            id: 1,
            name: "Opula Haven Hotel",
            location: "Bantul, Yogyakarta",
            price: 450,
            originalPrice: 580,
            savings: 130,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
            rating: 4.5,
            timeAgo: "2 hours ago"
        },
        {
            id: 2,
            name: "Green Hottel",
            location: "Sleman, Yogyakarta",
            price: 450,
            originalPrice: 520,
            savings: 70,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
            rating: 4.5,
            timeAgo: "4 hours ago"
        },
        {
            id: 3,
            name: "Garden Hottel",
            location: "Gunungkidul, Yogyakarta",
            price: 450,
            originalPrice: 600,
            savings: 150,
            image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
            rating: 4.5,
            timeAgo: "6 hours ago"
        }
    ];

    const recentSearches = [
        {
            id: 1,
            name: "Singgah Hottel",
            location: "Bantul, Yogyakarta",
            image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=150&h=100&fit=crop"
        },
        {
            id: 2,
            name: "Mint Hotel",
            location: "Magelang",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=100&fit=crop"
        },
        {
            id: 3,
            name: "Skyview Hotel",
            location: "Sleman, Yogyakarta",
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=150&h=100&fit=crop"
        }
    ];

    const categories = [
        { id: 'hotel', name: 'Hotel' },
        { id: 'motel', name: 'Motel' },
        { id: 'resort', name: 'Resort' },
        { id: 'villa', name: 'Villa' },
        { id: 'apartment', name: 'Apartment' },
        { id: 'guesthouse', name: 'Guesthouse' }
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">T</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">Tamago</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/dashboard" className="block">
                        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <Home className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Dashboard</span>
                        </div>
                    </Link>
                    <Link href="/bookings" className="block">
                        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <Grid3X3 className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">All Bookings</span>
                        </div>
                    </Link>
                    <Link href="/price-alerts" className="block">
                        <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                            <div className="relative">
                                <Bell className="h-5 w-5 text-blue-600" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">2</span>
                                </div>
                            </div>
                            <span className="font-medium text-gray-900">Price Drops</span>
                        </div>
                    </Link>
                    <Link href="/favorites" className="block">
                        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <Heart className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Favorite</span>
                        </div>
                    </Link>
                    <Link href="/settings" className="block">
                        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <Settings className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Settings</span>
                        </div>
                    </Link>
                </nav>

                {/* Promotional Card */}
                <div className="p-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardContent className="p-4">
                            <h3 className="font-bold text-blue-900 mb-2">Get 45% Off.</h3>
                            <p className="text-sm text-blue-700 mb-3">Special Price for you, hotel discount up to 45%</p>
                            <div className="w-full h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg"></div>
                        </CardContent>
                    </Card>
                </div>

                {/* Logout */}
                <div className="p-4 border-t border-gray-200">
                    <Link href="/logout" method="post" as="button" className="w-full">
                        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <LogOut className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Log Out</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                            <p className="text-lg text-gray-600">{auth?.user?.name || 'Brooklyn Simmons'}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                                <MapPin className="h-4 w-4 text-gray-600" />
                                <span className="text-gray-700">Yogyakarta</span>
                                <ChevronDown className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                                <Calendar className="h-4 w-4 text-gray-600" />
                                <span className="text-gray-700">March 17 - March 20, 2024</span>
                                <ChevronDown className="h-4 w-4 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Promotional Banner */}
                    <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white mb-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 opacity-20"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="inline-block bg-gray-200/20 text-gray-200 px-3 py-1 rounded-full text-sm mb-4">
                                        Have a nice stay.
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">Only here book</h2>
                                    <p className="text-xl text-blue-100">Staycation like your own home.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Tabs */}
                    <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.id ? 'default' : 'outline'}
                                className={`whitespace-nowrap ${selectedCategory === category.id ? 'bg-green-500 hover:bg-green-600' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {category.name}
                            </Button>
                        ))}
                        <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Price Drops Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Price Drops for you</h3>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {priceDrops.map((hotel) => (
                                <Card key={hotel.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                                    <div className="relative">
                                        <img
                                            src={hotel.image}
                                            alt={hotel.name}
                                            className="w-full h-48 object-cover rounded-t-lg"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 hover:bg-white"
                                            onClick={() => toggleFavorite(hotel.id)}
                                        >
                                            <Heart className={`h-4 w-4 ${favorites.has(hotel.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                        </Button>
                                        <div className="absolute top-2 left-2">
                                            <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                                                Save ${hotel.savings}
                                            </span>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1">{hotel.name}</h3>
                                        <div className="flex items-center text-sm text-gray-600 mb-2">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {hotel.location}
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <span className="text-lg font-bold text-gray-900">${hotel.price}</span>
                                                <span className="text-sm text-gray-500 ml-1">/24 hours</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                <span className="text-sm text-gray-600 ml-1">{hotel.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 line-through">${hotel.originalPrice}</span>
                                            <span className="text-green-600 font-medium">{hotel.timeAgo}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                {/* Recent Search Section */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Search</h3>
                        <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {recentSearches.map((search) => (
                            <div key={search.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <img
                                    src={search.image}
                                    alt={search.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 text-sm">{search.name}</h4>
                                    <p className="text-xs text-gray-600">{search.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                        See More
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>

                {/* Map View */}
                <div className="flex-1 p-6">
                    <div className="relative">
                        <div className="w-full h-64 bg-gray-200 rounded-lg relative">
                            {/* Placeholder for map */}
                            <div className="absolute inset-0 bg-gray-300 rounded-lg opacity-20"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-gray-500">Map View</span>
                            </div>
                        </div>
                        <Card className="absolute bottom-4 left-4 right-4">
                            <CardContent className="p-3">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={recentSearches[2].image}
                                        alt={recentSearches[2].name}
                                        className="w-12 h-12 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 text-sm">{recentSearches[2].name}</h4>
                                        <p className="text-xs text-gray-600">{recentSearches[2].location}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
