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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Head, Link, router } from '@inertiajs/react';
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
    ChevronLeft,
    ChevronRight,
    Star,
    Plus,
    X,
    Users,
    Bed,
    Clock,
    CreditCard,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

export default function Dashboard({ auth, stats, hotel_bookings, recent_checks }) {
    const [showAddBooking, setShowAddBooking] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showImageGallery, setShowImageGallery] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeNavTab, setActiveNavTab] = useState('most-popular');
    const [formData, setFormData] = useState({
        hotel_name: '',
        location: '',
        check_in_date: '',
        check_out_date: '',
        guests: '',
        rooms: '',
        room_type: '',
        original_price: '',
        currency: ''
    });
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

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Submitting form data:', formData);
        router.post('/bookings', formData, {
            onSuccess: () => {
                console.log('Booking created successfully');
                setShowAddBooking(false);
                setFormData({
                    hotel_name: '',
                    location: '',
                    check_in_date: '',
                    check_out_date: '',
                    guests: '',
                    rooms: '',
                    room_type: '',
                    original_price: '',
                    currency: ''
                });
            },
            onError: (errors) => {
                console.error('Error creating booking:', errors);
            }
        });
    };

    const handleAddBookingClick = () => {
        console.log('Add Booking button clicked');
        setShowAddBooking(true);
    };

    const handleBookingClick = (booking) => {
        console.log('Booking clicked:', booking);
        console.log('Enriched data:', booking.enriched_data);

        // Use the actual booking data with enriched information
        const bookingDetails = {
            id: booking.id,
            hotel_name: booking.hotel_name || 'Hotel Name Not Available',
            location: booking.location || 'Location Not Available',
            check_in_date: booking.check_in_date || '2024-01-15',
            check_out_date: booking.check_out_date || '2024-01-18',
            guests: booking.guests || 2,
            rooms: booking.rooms || 1,
            total_price: booking.total_price || (booking.price_per_night * booking.nights) || 150.00,
            price_per_night: booking.price_per_night || 50.00,
            nights: booking.nights || 3,
            currency: booking.currency || 'USD',
            status: booking.status || 'active',
            booking_confirmation: booking.booking_confirmation || 'CONF-123456789',
            // Price information from actual booking data
            original_price: booking.original_price || booking.total_price || 150.00,
            current_price: booking.current_price || booking.total_price || 150.00,
            price_drop_detected: booking.price_drop_detected || false,
            price_drop_amount: booking.price_drop_amount || 0,
            price_drop_percentage: booking.price_drop_percentage || 0,
            last_checked: booking.last_checked || null,
            // Use enriched data if available
            hotel_image: booking.enriched_data?.overview?.screenshots?.[0] || null,
            hotel_description: booking.enriched_data?.overview?.description || "A beautiful hotel with modern amenities and excellent service.",
            amenities: booking.enriched_data?.facilities?.amenities || ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Gym'],
            room_type: booking.enriched_data?.details?.room_type || 'Deluxe Room',
            cancellation_policy: booking.enriched_data?.details?.cancellation_policy || 'Free cancellation until 24 hours before check-in',
            contact_info: {
                phone: '+1-555-0123',
                email: 'reservations@hotel.com'
            },
            price_history: [
                { date: '2024-01-10', price: 180.00 },
                { date: '2024-01-12', price: 160.00 },
                { date: '2024-01-14', price: 150.00 }
            ],
            // Include enriched data for access to screenshots
            enriched_data: booking.enriched_data
        };

        setSelectedBooking(bookingDetails);
    };

    const handleCloseBookingPanel = () => {
        setSelectedBooking(null);
    };

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    };

    const handleOpenGallery = () => {
        setShowImageGallery(true);
    };

    const handleCloseGallery = () => {
        setShowImageGallery(false);
    };

    const handlePreviousImage = () => {
        if (selectedBooking?.enriched_data?.overview?.screenshots) {
            const totalImages = selectedBooking.enriched_data.overview.screenshots.length;
            setSelectedImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
        }
    };

    const handleNextImage = () => {
        if (selectedBooking?.enriched_data?.overview?.screenshots) {
            const totalImages = selectedBooking.enriched_data.overview.screenshots.length;
            setSelectedImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
        }
    };

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
                    <Link href="/calendar" className="block">
                        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Calendar</span>
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
                <Head title="Dashboard" />

                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search hotels..."
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Dialog open={showAddBooking} onOpenChange={setShowAddBooking}>
                                <DialogTrigger asChild>
                                <Button
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                                        onClick={handleAddBookingClick}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Booking
                                </Button>
                                </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Booking</DialogTitle>
                                    <DialogDescription>
                                        Enter your hotel booking details to start tracking price drops and save money.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="hotel-name">Hotel Name</Label>
                                            <Input
                                                id="hotel-name"
                                                placeholder="Enter hotel name"
                                                value={formData.hotel_name}
                                                onChange={(e) => handleInputChange('hotel_name', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                placeholder="City, Country"
                                                value={formData.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="check-in">Check-in Date</Label>
                                            <Input
                                                id="check-in"
                                                type="date"
                                                value={formData.check_in_date}
                                                onChange={(e) => handleInputChange('check_in_date', e.target.value)}
                                            />
                                            </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="check-out">Check-out Date</Label>
                                            <Input
                                                id="check-out"
                                                type="date"
                                                value={formData.check_out_date}
                                                onChange={(e) => handleInputChange('check_out_date', e.target.value)}
                                            />
                                                </div>
                                            </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="guests">Number of Guests</Label>
                                            <Input
                                                id="guests"
                                                type="number"
                                                placeholder="2"
                                                value={formData.guests}
                                                onChange={(e) => handleInputChange('guests', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="rooms">Number of Rooms</Label>
                                            <Input
                                                id="rooms"
                                                type="number"
                                                placeholder="1"
                                                value={formData.rooms}
                                                onChange={(e) => handleInputChange('rooms', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="room-type">Room Type</Label>
                                            <Input
                                                id="room-type"
                                                type="text"
                                                placeholder="e.g., Deluxe King Room"
                                                value={formData.room_type}
                                                onChange={(e) => handleInputChange('room_type', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="total-price">Total Price</Label>
                                            <Input
                                                id="total-price"
                                                type="number"
                                                placeholder="0.00"
                                                value={formData.original_price}
                                                onChange={(e) => handleInputChange('original_price', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="usd">USD ($)</SelectItem>
                                                <SelectItem value="eur">EUR (€)</SelectItem>
                                                <SelectItem value="gbp">GBP (£)</SelectItem>
                                                <SelectItem value="jpy">JPY (¥)</SelectItem>
                                                <SelectItem value="idr">IDR (Rp)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowAddBooking(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSubmit}>
                                        Add Booking
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                            </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Recent Bookings */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Recent bookings</h2>
                            <Link href="/bookings">
                                <Button variant="link" className="text-blue-600 p-0 h-auto">View All</Button>
                            </Link>
                        </div>
                        <div className="flex space-x-4 overflow-x-auto pb-4">
                            {hotel_bookings && hotel_bookings.length > 0 ? (
                                hotel_bookings.slice(0, 4).map((booking, index) => (
                                    <Card key={booking.id} className="min-w-[300px] cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleBookingClick(booking)}>
                                        <div className="relative">
                                            {booking.enriched_data?.overview?.screenshots && booking.enriched_data.overview.screenshots.length > 0 ? (
                                                <img
                                                    src={booking.enriched_data.overview.screenshots[0]}
                                                    alt={booking.hotel_name}
                                                    className="w-full h-48 object-cover rounded-t-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                                                    <span className="text-gray-500 text-sm">No image available</span>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1">{booking.hotel_name}</h3>
                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {booking.location}
                                            </div>
                                            <p className="text-lg font-bold text-gray-900">
                                                ${Number(booking.price_per_night).toFixed(2)} / night
                                            </p>
                                            <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                                                <span>{booking.nights} nights</span>
                                                <span>{booking.guests} guests</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="flex items-center justify-center w-full py-8">
                                    <div className="text-center">
                                        <p className="text-gray-500 mb-2">No bookings yet</p>
                                        <p className="text-sm text-gray-400">Add your first booking to get started</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setActiveNavTab('most-popular')}
                                        className={`font-semibold pb-1 transition-colors ${
                                            activeNavTab === 'most-popular'
                                                ? 'text-xl text-gray-900 border-b-2 border-blue-600'
                                                : 'text-lg text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Most Popular
                                    </button>
                                    <button
                                        onClick={() => setActiveNavTab('special-offers')}
                                        className={`font-semibold pb-1 transition-colors ${
                                            activeNavTab === 'special-offers'
                                                ? 'text-xl text-gray-900 border-b-2 border-blue-600'
                                                : 'text-lg text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Special Offers
                                    </button>
                                    <button
                                        onClick={() => setActiveNavTab('near-me')}
                                        className={`font-semibold pb-1 transition-colors ${
                                            activeNavTab === 'near-me'
                                                ? 'text-xl text-gray-900 border-b-2 border-blue-600'
                                                : 'text-lg text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Near Me
                                    </button>
                                </div>
                            </div>
                            <Button variant="link" className="text-blue-600 p-0 h-auto">View All</Button>
                        </div>
                        {/* Tab Content */}
                        {activeNavTab === 'most-popular' && (
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
                                            <p className="text-sm font-bold text-gray-900">${Number(hotel.price).toFixed(2)} / night</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {activeNavTab === 'special-offers' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {popularHotels.slice(0, 2).map((hotel, index) => (
                                    <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-orange-200">
                                        <div className="relative">
                                            <img
                                                src={hotel.image}
                                                alt={hotel.name}
                                                className="w-full h-24 object-cover rounded-t-lg"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <Badge className="bg-orange-500 text-white text-xs">Special Offer</Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-3">
                                            <h3 className="font-medium text-gray-900 text-sm mb-1">{hotel.name}</h3>
                                            <div className="flex items-center text-xs text-gray-600 mb-1">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {hotel.country}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm line-through text-gray-400">${Number(hotel.price + 10).toFixed(2)}</p>
                                                <p className="text-sm font-bold text-orange-600">${Number(hotel.price).toFixed(2)} / night</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {activeNavTab === 'near-me' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {popularHotels.slice(0, 3).map((hotel, index) => (
                                    <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-green-200">
                                        <div className="relative">
                                            <img
                                                src={hotel.image}
                                                alt={hotel.name}
                                                className="w-full h-24 object-cover rounded-t-lg"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <Badge className="bg-green-500 text-white text-xs">Nearby</Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-3">
                                            <h3 className="font-medium text-gray-900 text-sm mb-1">{hotel.name}</h3>
                                            <div className="flex items-center text-xs text-gray-600 mb-1">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {hotel.country}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-gray-900">${Number(hotel.price).toFixed(2)} / night</p>
                                                <p className="text-xs text-green-600">0.5 km away</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                </div>

            {/* Right Detail Panel - Booking Details */}
            {selectedBooking && (
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                    {/* Header with close button */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCloseBookingPanel}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Booking Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedBooking.hotel_name}</h2>

                            {/* Hotel Images */}
                            {selectedBooking.enriched_data?.overview?.screenshots && selectedBooking.enriched_data.overview.screenshots.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <img
                                        src={selectedBooking.enriched_data.overview.screenshots[selectedImageIndex]}
                                        alt="Main hotel"
                                        className="col-span-3 w-full h-48 object-cover rounded-lg cursor-pointer"
                                        onClick={handleOpenGallery}
                                        onError={(e) => {
                                            console.error('Failed to load image:', e.target.src);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    {selectedBooking.enriched_data.overview.screenshots.slice(0, 3).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Hotel ${index + 1}`}
                                            className={`w-full h-20 object-cover rounded-lg cursor-pointer transition-opacity ${
                                                index === selectedImageIndex ? 'opacity-100 ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                                            }`}
                                            onClick={() => handleImageClick(index)}
                                            onError={(e) => {
                                                console.error('Failed to load image:', e.target.src);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ))}
                                    {selectedBooking.enriched_data.overview.screenshots.length > 3 && (
                                        <div className="relative cursor-pointer" onClick={handleOpenGallery}>
                                            <img
                                                src={selectedBooking.enriched_data.overview.screenshots[3]}
                                                alt="Hotel"
                                                className="w-full h-20 object-cover rounded-lg"
                                                onError={(e) => {
                                                    console.error('Failed to load image:', e.target.src);
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">+{selectedBooking.enriched_data.overview.screenshots.length - 4}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                                    <span className="text-gray-500 text-sm">
                                        {selectedBooking.enriched_data ? 'No images available' : 'Loading images...'}
                                    </span>
                                </div>
                            )}

                            {/* Tabs */}
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                                    <TabsTrigger value="facilities" className="text-xs">Facilities</TabsTrigger>
                                    <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
                                    <TabsTrigger value="price-history" className="text-xs">History</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-4">
                                    {selectedBooking.enriched_data?.overview ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-medium">
                                                    {selectedBooking.enriched_data.overview.star_rating} / 5.0
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {selectedBooking.enriched_data?.details?.room_description || selectedBooking.hotel_description || "A beautiful hotel with modern amenities and excellent service."}
                                            </p>

                                            {/* Booking Summary */}
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-gray-900 text-sm">Booking Summary</h4>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-gray-600">Check-in:</span>
                                                        <p className="font-medium">{new Date(selectedBooking.check_in_date).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Check-out:</span>
                                                        <p className="font-medium">{new Date(selectedBooking.check_out_date).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Guests:</span>
                                                        <p className="font-medium">{selectedBooking.guests}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Nights:</span>
                                                        <p className="font-medium">{selectedBooking.nights}</p>
                                                    </div>
                                                </div>
                                                <div className="pt-2">
                                                    <span className="text-gray-600 text-sm">Total Price:</span>
                                                    <p className="text-lg font-bold text-gray-900">${Number(selectedBooking.total_price).toFixed(2)} {selectedBooking.currency}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500 text-sm">No enriched data available</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="facilities" className="mt-4">
                                    {selectedBooking.enriched_data?.facilities ? (
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-900 text-sm">Amenities</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {selectedBooking.enriched_data.facilities.amenities?.slice(0, 8).map((amenity, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-sm">{amenity}</span>
                                                    </div>
                                                ))}
                                                {selectedBooking.enriched_data.facilities.amenities?.length > 8 && (
                                                    <p className="text-sm text-gray-500">+{selectedBooking.enriched_data.facilities.amenities.length - 8} more amenities</p>
                                                )}
                                            </div>

                                            <Separator />

                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm mb-2">Facilities</h4>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {selectedBooking.enriched_data.facilities.facilities?.slice(0, 6).map((facility, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                            <span className="text-sm">{facility}</span>
                                                        </div>
                                                    ))}
                                                    {selectedBooking.enriched_data.facilities.facilities?.length > 6 && (
                                                        <p className="text-sm text-gray-500">+{selectedBooking.enriched_data.facilities.facilities.length - 6} more facilities</p>
                                                    )}
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="flex items-center gap-2">
                                                <Badge variant={selectedBooking.enriched_data.facilities.breakfast_included ? "default" : "secondary"} className="text-xs">
                                                    {selectedBooking.enriched_data.facilities.breakfast_included ? 'Breakfast Included' : 'Breakfast Not Included'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500 text-sm">No facilities data available</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="details" className="mt-4">
                                    {selectedBooking.enriched_data?.details ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Room Information</h4>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <span className="text-sm text-gray-600">Room Type:</span>
                                                            <p className="text-sm font-medium">
                                                                {selectedBooking.enriched_data.details.room_type || 'Standard Room'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm text-gray-600">Room Code:</span>
                                                            <p className="text-sm font-medium">
                                                                {selectedBooking.enriched_data.details.room_code || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Pricing Details</h4>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <span className="text-sm text-gray-600">Base Rate:</span>
                                                            <p className="text-sm font-medium">
                                                                {selectedBooking.enriched_data.details.base_rate
                                                                    ? `$${Number(selectedBooking.enriched_data.details.base_rate).toFixed(2)}`
                                                                    : `$${Number(selectedBooking.original_price).toFixed(2)}`
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm text-gray-600">Total Price:</span>
                                                            <p className="text-sm font-medium">
                                                                ${Number(selectedBooking.original_price).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm mb-2">Cancellation Policy</h4>
                                                <p className="text-sm text-gray-600">
                                                    {selectedBooking.enriched_data.details.cancellation_policy || 'Standard cancellation policy applies'}
                                                </p>
                                            </div>

                                            {selectedBooking.enriched_data.details.booking_link && (
                                                <>
                                                    <Separator />
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Booking Links</h4>
                                                        <a
                                                            href={selectedBooking.enriched_data.details.booking_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline text-sm"
                                                        >
                                                            View Booking Details
                                                        </a>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500 text-sm">No details data available</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="price-history" className="mt-4">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm mb-2">Price Information</h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="text-sm text-gray-600">Original Price:</span>
                                                        <p className="text-sm font-medium">
                                                            ${(Number(selectedBooking.original_price) || 0).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-600">Current Price:</span>
                                                        <p className="text-sm font-medium">
                                                            ${(Number(selectedBooking.current_price) || 0).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    {selectedBooking.price_drop_detected && (
                                                        <div>
                                                            <span className="text-sm text-gray-600">Price Drop:</span>
                                                            <p className="text-sm font-medium text-green-600">
                                                                -${(Number(selectedBooking.price_drop_amount) || 0).toFixed(2)} ({(Number(selectedBooking.price_drop_percentage) || 0).toFixed(1)}%)
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm mb-2">Tracking Status</h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="text-sm text-gray-600">Status:</span>
                                                        <Badge variant={selectedBooking.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                                            {selectedBooking.status}
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-600">Last Checked:</span>
                                                        <p className="text-sm font-medium">
                                                            {selectedBooking.last_checked ? new Date(selectedBooking.last_checked).toLocaleDateString() : 'Never'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm mb-2">Stay Details</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Check-in</p>
                                                        <p className="text-sm font-medium">{new Date(selectedBooking.check_in_date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Check-out</p>
                                                        <p className="text-sm font-medium">{new Date(selectedBooking.check_out_date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>



                            {/* View Full Details Button */}
                            <div className="mt-6">
                                <Link href={`/bookings/${selectedBooking.id}`}>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold">
                                        View Full Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Gallery Modal */}
            {showImageGallery && selectedBooking?.enriched_data?.overview?.screenshots && (
                <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                        <div className="relative">
                            {/* Close button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCloseGallery}
                                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            {/* Main image */}
                            <div className="relative">
                                <img
                                    src={selectedBooking.enriched_data.overview.screenshots[selectedImageIndex]}
                                    alt={`Hotel image ${selectedImageIndex + 1}`}
                                    className="w-full h-[70vh] object-cover"
                                    onError={(e) => {
                                        console.error('Failed to load image:', e.target.src);
                                        e.target.style.display = 'none';
                                    }}
                                />

                                {/* Navigation arrows */}
                                {selectedBooking.enriched_data.overview.screenshots.length > 1 && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handlePreviousImage}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleNextImage}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}

                                {/* Image counter */}
                                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                    {selectedImageIndex + 1} / {selectedBooking.enriched_data.overview.screenshots.length}
                                </div>
                            </div>

                            {/* Thumbnail strip */}
                            <div className="p-4 bg-gray-100">
                                <div className="flex gap-2 overflow-x-auto">
                                    {selectedBooking.enriched_data.overview.screenshots.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className={`h-16 w-24 object-cover rounded cursor-pointer transition-opacity ${
                                                index === selectedImageIndex ? 'opacity-100 ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                                            }`}
                                            onClick={() => setSelectedImageIndex(index)}
                                            onError={(e) => {
                                                console.error('Failed to load thumbnail:', e.target.src);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            </div>
        </div>
    );
}
