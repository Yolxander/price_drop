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
import { Link, router } from '@inertiajs/react';
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
    const [formData, setFormData] = useState({
        hotel_name: '',
        location: '',
        check_in_date: '',
        check_out_date: '',
        guests: '',
        rooms: '',
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
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Find hotel to stay 🏨
                        </h1>
                        <Dialog>
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
                                hotel_bookings.slice(0, 3).map((booking, index) => (
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
                                                ${booking.price_per_night} / night
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
                                        src={selectedBooking.enriched_data.overview.screenshots[0]}
                                        alt="Main hotel"
                                        className="col-span-3 w-full h-48 object-cover rounded-lg"
                                        onError={(e) => {
                                            console.error('Failed to load image:', e.target.src);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    {selectedBooking.enriched_data.overview.screenshots.slice(1, 3).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Hotel ${index + 2}`}
                                            className="w-full h-20 object-cover rounded-lg"
                                            onError={(e) => {
                                                console.error('Failed to load image:', e.target.src);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ))}
                                    {selectedBooking.enriched_data.overview.screenshots.length > 3 && (
                                        <div className="relative">
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
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        {selectedBooking.enriched_data?.details?.room_description || selectedBooking.hotel_description || "A beautiful hotel with modern amenities and excellent service."}
                                    </p>
                                    <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">Read more</Button>

                                    {/* Booking Summary */}
                                    <div className="mt-6 space-y-3">
                                        <h4 className="font-semibold text-gray-900">Booking Summary</h4>
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
                                                <span className="text-gray-600">Rooms:</span>
                                                <p className="font-medium">{selectedBooking.rooms}</p>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <span className="text-gray-600 text-sm">Total Price:</span>
                                            <p className="text-lg font-bold text-gray-900">${selectedBooking.total_price} {selectedBooking.currency}</p>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="facilities" className="mt-4">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900">Hotel Amenities</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedBooking.enriched_data?.facilities?.amenities && selectedBooking.enriched_data.facilities.amenities.length > 0 ? (
                                                selectedBooking.enriched_data.facilities.amenities.slice(0, 20).map((amenity, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {amenity}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-sm">No amenities information available</p>
                                            )}
                                            {selectedBooking.enriched_data?.facilities?.amenities && selectedBooking.enriched_data.facilities.amenities.length > 20 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{selectedBooking.enriched_data.facilities.amenities.length - 20} more
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <h5 className="font-medium text-gray-900">Room Features</h5>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center">
                                                    <Bed className="h-4 w-4 mr-2 text-gray-600" />
                                                    <span>King-size bed</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-2 text-gray-600" />
                                                    <span>Sleeps {selectedBooking.guests} guests</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-2 text-gray-600" />
                                                    <span>24/7 room service</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="details" className="mt-4">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900">Hotel Details</h4>

                                        <div className="space-y-3">
                                            {selectedBooking.enriched_data?.overview?.canonical_name && (
                                                <div>
                                                    <span className="text-sm text-gray-600">Hotel Name:</span>
                                                    <p className="text-sm font-medium">{selectedBooking.enriched_data.overview.canonical_name}</p>
                                                </div>
                                            )}
                                            {selectedBooking.enriched_data?.overview?.star_rating && (
                                                <div>
                                                    <span className="text-sm text-gray-600">Star Rating:</span>
                                                    <p className="text-sm font-medium">{selectedBooking.enriched_data.overview.star_rating} ★</p>
                                                </div>
                                            )}
                                            {selectedBooking.enriched_data?.overview?.address && (
                                                <div>
                                                    <span className="text-sm text-gray-600">Address:</span>
                                                    <p className="text-sm font-medium">{selectedBooking.enriched_data.overview.address}</p>
                                                </div>
                                            )}
                                            {selectedBooking.enriched_data?.details?.room_type && (
                                                <div>
                                                    <span className="text-sm text-gray-600">Room Type:</span>
                                                    <p className="text-sm font-medium">{selectedBooking.enriched_data.details.room_type}</p>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-sm text-gray-600">Duration:</span>
                                                <p className="text-sm font-medium">{selectedBooking.nights} nights</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Price per Night:</span>
                                                <p className="text-sm font-medium">${selectedBooking.price_per_night}</p>
                                            </div>
                                        </div>

                                        <Separator />

                                        {selectedBooking.enriched_data?.details?.booking_link && (
                                            <div className="space-y-3">
                                                <h5 className="font-medium text-gray-900">Booking Link</h5>
                                                <a
                                                    href={selectedBooking.enriched_data.details.booking_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-sm"
                                                >
                                                    View on Hotel Website
                                                </a>
                                            </div>
                                        )}

                                        <Separator />

                                        {selectedBooking.enriched_data?.details?.cancellation_policy && (
                                            <div className="space-y-3">
                                                <h5 className="font-medium text-gray-900">Cancellation Policy</h5>
                                                <p className="text-sm text-gray-600">{selectedBooking.enriched_data.details.cancellation_policy}</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="price-history" className="mt-4">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900">Price History</h4>
                                        <div className="space-y-3">
                                            {selectedBooking.price_history.map((entry, index) => (
                                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                                                        <p className="text-xs text-gray-600">Price check</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold">${entry.price}</p>
                                                        {index > 0 && (
                                                            <p className={`text-xs ${entry.price < selectedBooking.price_history[index - 1].price ? 'text-green-600' : 'text-red-600'}`}>
                                                                {entry.price < selectedBooking.price_history[index - 1].price ? '↓' : '↑'} ${Math.abs(entry.price - selectedBooking.price_history[index - 1].price)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4">
                                            <Button variant="outline" className="w-full text-sm">
                                                View Full Price History
                                            </Button>
                                        </div>
                                    </div>
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
                                    ${selectedBooking.price_per_night} / night
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
