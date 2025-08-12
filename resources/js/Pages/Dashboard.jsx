import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import {
    Home,
    Grid3X3,
    Bell,
    Heart,
    Settings,
    LogOut,
    Search,
    Calendar,
    MapPin,
    ChevronDown,
    Star,
    Plus
} from 'lucide-react';

export default function Dashboard({ auth, stats, hotel_bookings, recent_checks }) {
    const [selectedHotel, setSelectedHotel] = useState({
        name: "Shikara Hotel",
        location: "Jl. Aston No. 72 Yogyakarta",
        price: 42.72,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
        description: "Shikara Hotel is committed to making your dreams come true. We believe that travel should be easy and accessible to everyone. Our hotel provides the perfect blend of comfort and luxury.",
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&h=150&fit=crop",
            "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&h=150&fit=crop"
        ]
    });

    const lodgingHotels = [
        {
            name: "Shikara Hotel",
            location: "Jl. Aston No. 72 Yogyakarta",
            price: 42.72,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
        },
        {
            name: "Visala Hotel",
            location: "Jl. Malioboro No. 123 Yogyakarta",
            price: 38.42,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop"
        },
        {
            name: "Shikara Hotel",
            location: "Jl. Sudirman No. 45 Yogyakarta",
            price: 40.14,
            image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop"
        }
    ];

    const popularHotels = [
        { name: "Shikara Hotel", country: "Indonesia", price: 42, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=100&fit=crop" },
        { name: "Hogi Hotel", country: "Thailand", price: 44, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=150&h=100&fit=crop" },
        { name: "Laganu Hotel", country: "Japan", price: 38, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=150&h=100&fit=crop" },
        { name: "Ibis Hotel", country: "Indonesia", price: 45, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=150&h=100&fit=crop" }
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
                        <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                            <Home className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-gray-900">Dashboard</span>
                        </div>
                    </Link>
                    <Link href="/bookings" className="block">
                        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <Grid3X3 className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">All Bookings</span>
                        </div>
                    </Link>
                    <Link href="/price-alerts" className="block">
                        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <div className="relative">
                                <Bell className="h-5 w-5 text-gray-600" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">2</span>
                                </div>
                            </div>
                            <span className="text-gray-700">Price Drops</span>
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Find hotel to stay 🏨
                    </h1>

                    {/* Search Section */}
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Date"
                                    value="Jul 12 - Jul 14"
                                    className="pl-10 pr-10"
                                />
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Where to"
                                    value="Yogyakarta, Ind..."
                                    className="pl-10 pr-10"
                                />
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Lodging Available */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Lodging available</h2>
                            <Button variant="link" className="text-blue-600 p-0 h-auto">View All</Button>
                        </div>
                        <div className="flex space-x-4 overflow-x-auto pb-4">
                            {lodgingHotels.map((hotel, index) => (
                                <Card key={index} className="min-w-[300px] cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedHotel(hotel)}>
                                    <div className="relative">
                                        <img
                                            src={hotel.image}
                                            alt={hotel.name}
                                            className="w-full h-48 object-cover rounded-t-lg"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1">{hotel.name}</h3>
                                        <div className="flex items-center text-sm text-gray-600 mb-2">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {hotel.location}
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">${hotel.price} / night</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Most Popular */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-6">
                                <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-blue-600 pb-1">Most Popular</h2>
                                <div className="flex space-x-4">
                                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Special Offers</Button>
                                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Near Me</Button>
                                </div>
                            </div>
                            <Button variant="link" className="text-blue-600 p-0 h-auto">View All</Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {popularHotels.map((hotel, index) => (
                                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                                    <div className="relative">
                                        <img
                                            src={hotel.image}
                                            alt={hotel.name}
                                            className="w-full h-24 object-cover rounded-t-lg"
                                        />
                                    </div>
                                    <CardContent className="p-3">
                                        <h3 className="font-medium text-gray-900 text-sm mb-1">{hotel.name}</h3>
                                        <div className="flex items-center text-xs text-gray-600 mb-1">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {hotel.country}
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">${hotel.price} / night</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Detail Panel */}
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                {/* User Profile */}
                <div className="p-6 border-b border-gray-200">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={auth?.user?.avatar} />
                                    <AvatarFallback>{auth?.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{auth?.user?.name || 'User'}</p>
                                    <p className="text-sm text-gray-600">Traveler Enthusiast</p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{auth?.user?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {auth?.user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <LogOut className="mr-2 h-4 w-4" />
                                <Link href="/logout" method="post" as="button" className="w-full text-left">
                                    Log out
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Hotel Details */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedHotel.name}</h2>

                        {/* Hotel Images */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <img
                                src={selectedHotel.images[0]}
                                alt="Main hotel"
                                className="col-span-3 w-full h-48 object-cover rounded-lg"
                            />
                            <img
                                src={selectedHotel.images[1]}
                                alt="Hotel room"
                                className="w-full h-20 object-cover rounded-lg"
                            />
                            <div className="relative">
                                <img
                                    src={selectedHotel.images[2]}
                                    alt="Hotel bathroom"
                                    className="w-full h-20 object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">+8</span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                                <TabsTrigger value="facilities" className="text-xs">Facilities</TabsTrigger>
                                <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
                                <TabsTrigger value="reviews" className="text-xs">Reviews</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="mt-4">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {selectedHotel.description}
                                </p>
                                <Button variant="link" className="text-blue-600 p-0 h-auto text-sm mt-2">Read more</Button>
                            </TabsContent>
                        </Tabs>

                        {/* Map Placeholder */}
                        <div className="mt-6">
                            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center relative">
                                <MapPin className="h-6 w-6 text-blue-600 absolute" />
                                <div className="absolute inset-0 bg-gray-300 rounded-lg opacity-20"></div>
                            </div>
                        </div>

                        {/* Booking Button */}
                        <div className="mt-6">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold">
                                ${selectedHotel.price} / night
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
