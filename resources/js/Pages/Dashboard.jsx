import React, { useState, useEffect } from 'react';
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
import Sidebar from '@/components/ui/sidebar';
import { toast, Toaster } from 'sonner';
import {
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
    AlertCircle,
    Building,
    Menu,
    Home,
    Grid3X3,
    Bell,
    Heart,
    Settings,
    LogOut
} from 'lucide-react';

export default function Dashboard({ auth, stats, hotel_bookings, recent_checks }) {
    const [showAddBooking, setShowAddBooking] = useState(false);
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showImageGallery, setShowImageGallery] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeNavTab, setActiveNavTab] = useState('most-popular');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState({
        header: false,
        recentBookings: false,
        navigationTabs: false,
        hotelCards: false
    });
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

    // Mobile navigation items
    const mobileNavigationItems = [
        {
            href: '/dashboard',
            icon: Home,
            label: 'Dashboard',
            page: 'dashboard'
        },
        {
            href: '/bookings',
            icon: Grid3X3,
            label: 'All Bookings',
            page: 'bookings'
        },
        {
            href: '/calendar',
            icon: Calendar,
            label: 'Calendar',
            page: 'calendar'
        },
        {
            href: '/price-alerts',
            icon: Bell,
            label: 'Price Pulses',
            page: 'alerts',
            hasNotification: true,
            notificationCount: 2
        },
        {
            href: '/favorites',
            icon: Heart,
            label: 'Favorites',
            page: 'favorites'
        },
        {
            href: '/settings',
            icon: Settings,
            label: 'Settings',
            page: 'settings'
        }
    ];

    const popularHotels = [
        { name: "Shikara Hotel", country: "Indonesia", price: 42, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=100&fit=crop" },
        { name: "Hogi Hotel", country: "Thailand", price: 44, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=150&h=100&fit=crop" },
        { name: "Laganu Hotel", country: "Japan", price: 38, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=150&h=100&fit=crop" },
        { name: "Ibis Hotel", country: "Indonesia", price: 45, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=150&h=100&fit=crop" }
    ];

    // Intersection Observer for animations
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const section = entry.target.dataset.section;
                    if (section) {
                        setIsVisible(prev => ({ ...prev, [section]: true }));
                    }
                }
            });
        }, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('[data-section]');
        sections.forEach(section => observer.observe(section));

        // Trigger header animation immediately
        setIsVisible(prev => ({ ...prev, header: true }));

        return () => observer.disconnect();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (isFormSubmitting) return;

        setIsFormSubmitting(true);
        setShowAddBooking(false);

        const loadingToast = toast.loading('Adding booking and enriching data...', {
            duration: Infinity,
            position: 'top-right',
            style: {
                background: '#fbbf24',
                color: '#1f2937',
                border: '1px solid #f59e0b',
            },
        });

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            await router.post('/bookings', formData, {
                onSuccess: () => {
                    toast.dismiss(loadingToast);
                    toast.success('Booking added successfully!', {
                        position: 'top-right',
                        duration: 4000,
                        style: {
                            background: '#10b981',
                            color: 'white',
                            border: '1px solid #059669',
                        },
                        icon: <CheckCircle className="h-4 w-4" />,
                    });

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
                    toast.dismiss(loadingToast);
                    toast.error('Failed to add booking. Please try again.', {
                        position: 'top-right',
                        duration: 4000,
                        style: {
                            background: '#ef4444',
                            color: 'white',
                            border: '1px solid #dc2626',
                        },
                        icon: <AlertCircle className="h-4 w-4" />,
                    });
                }
            });
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('An unexpected error occurred.', {
                position: 'top-right',
                duration: 4000,
                style: {
                    background: '#ef4444',
                    color: 'white',
                    border: '1px solid #dc2626',
                },
                icon: <AlertCircle className="h-4 w-4" />,
            });
        } finally {
            setIsFormSubmitting(false);
        }
    };

    const handleAddBookingClick = () => {
        setShowAddBooking(true);
    };

    const handleCloseForm = () => {
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
    };

    const handleBookingClick = (booking) => {
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
            original_price: booking.original_price || booking.total_price || 150.00,
            current_price: booking.current_price || booking.total_price || 150.00,
            price_drop_detected: booking.price_drop_detected || false,
            price_drop_amount: booking.price_drop_amount || 0,
            price_drop_percentage: booking.price_drop_percentage || 0,
            last_checked: booking.last_checked || null,
            enriched_data: booking.enriched_data
        };

        setSelectedBooking(bookingDetails);
    };

    const handleCloseBookingPanel = () => {
        setSelectedBooking(null);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="fixed inset-y-0 left-0 flex w-80 flex-col bg-white border-r border-gray-200 animate-in slide-in-from-left duration-300">
                        {/* Mobile Menu Header */}
                        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <img
                                    src="/logo/price-pulse-logo.png"
                                    alt="Price Pulse"
                                    className="w-8 h-8"
                                />
                                <span className="text-xl font-bold text-yellow-600">Price Pulse</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="h-8 w-8"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Mobile Navigation */}
                        <nav className="flex-1 p-4 space-y-2">
                            {mobileNavigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.page === 'dashboard';

                                return (
                                    <Link key={item.href} href={item.href} className="block">
                                        <div className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-200 active:scale-95 ${
                                            isActive
                                                ? 'bg-yellow-50 border border-yellow-200'
                                                : 'hover:bg-gray-50 active:bg-gray-100'
                                        }`}>
                                            {item.hasNotification ? (
                                                <div className="relative">
                                                    <Icon className={`h-6 w-6 ${
                                                        isActive ? 'text-yellow-600' : 'text-gray-600'
                                                    }`} />
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                        <span className="text-xs text-white font-medium">{item.notificationCount}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Icon className={`h-6 w-6 ${
                                                    isActive ? 'text-yellow-600' : 'text-gray-600'
                                                }`} />
                                            )}
                                            <span className={`text-lg ${
                                                isActive
                                                    ? 'font-semibold text-gray-900'
                                                    : 'text-gray-700'
                                            }`}>
                                                {item.label}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Mobile User Profile */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-yellow-500 text-white font-semibold">
                                        {auth?.user?.name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{auth?.user?.name || 'User'}</p>
                                    <p className="text-sm text-gray-600">{auth?.user?.email || 'user@example.com'}</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.post('/logout', {}, {
                                        onSuccess: () => {
                                            router.visit('/');
                                        }
                                    });
                                }}
                                className="block mt-3 w-full"
                            >
                                <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 active:bg-gray-100 rounded-xl cursor-pointer transition-all duration-200 active:scale-95">
                                    <LogOut className="h-5 w-5 text-gray-600" />
                                    <span className="text-gray-700 font-medium">Log Out</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
                <Sidebar activePage="dashboard" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
            <Head title="Dashboard" />

                {/* Mobile Header */}
                <div className="lg:hidden bg-white border-b border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="h-10 w-10 active:scale-95 transition-transform"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        <div className="flex items-center space-x-3">
                            <img
                                src="/logo/price-pulse-logo.png"
                                alt="Price Pulse"
                                className="w-8 h-8"
                            />
                            <span className="text-xl font-bold text-yellow-600">Price Pulse</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleAddBookingClick}
                            className="h-8 px-3 py-1 text-sm font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 active:scale-95 transition-all duration-200"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                        </Button>
                    </div>
                </div>

                {/* Header */}
                <div
                    data-section="header"
                    className={`bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4 lg:p-8 shadow-sm transition-all duration-1000 ease-out ${
                        isVisible.header
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className={`w-full lg:max-w-md transition-all duration-1000 delay-200 ${
                            isVisible.header
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-8'
                        }`}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search hotels..."
                                    className="pl-10 bg-white/90 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md w-full h-12 text-base"
                                />
                            </div>
                        </div>
                        <div className={`flex items-center justify-center lg:justify-end transition-all duration-1000 delay-400 ${
                            isVisible.header
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-8'
                        }`}>
                            <div className="hidden lg:block">
                                <Dialog open={showAddBooking} onOpenChange={setShowAddBooking}>
                                    <DialogTrigger asChild>
                                        <Button
                                            className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-6 lg:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 btn-hover-effect w-full lg:w-auto h-12"
                                            onClick={handleAddBookingClick}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Booking
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl lg:text-2xl font-bold text-gray-900">Add New Booking</DialogTitle>
                                            <DialogDescription className="text-gray-600 text-base lg:text-lg">
                                                Enter your hotel booking details to start tracking price pulses and save money.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="hotel-name" className="text-gray-700 font-semibold">Hotel Name</Label>
                                                    <Input
                                                        id="hotel-name"
                                                        placeholder="Enter hotel name"
                                                        value={formData.hotel_name}
                                                        onChange={(e) => handleInputChange('hotel_name', e.target.value)}
                                                        className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg transition-all duration-300 form-input-focus h-12 text-base"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="location" className="text-gray-700 font-semibold">Location</Label>
                                                    <Input
                                                        id="location"
                                                        placeholder="City, Country"
                                                        value={formData.location}
                                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                                        className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg transition-all duration-300 form-input-focus h-12 text-base"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="check-in" className="text-gray-700 font-semibold">Check-in Date</Label>
                                                    <Input
                                                        id="check-in"
                                                        type="date"
                                                        value={formData.check_in_date}
                                                        onChange={(e) => handleInputChange('check_in_date', e.target.value)}
                                                        className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg transition-all duration-300 form-input-focus h-12 text-base"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="check-out" className="text-gray-700 font-semibold">Check-out Date</Label>
                                                    <Input
                                                        id="check-out"
                                                        type="date"
                                                        value={formData.check_out_date}
                                                        onChange={(e) => handleInputChange('check_out_date', e.target.value)}
                                                        className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg transition-all duration-300 form-input-focus h-12 text-base"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="guests" className="text-gray-700 font-semibold">Number of Guests</Label>
                                                    <Input
                                                        id="guests"
                                                        type="number"
                                                        placeholder="2"
                                                        value={formData.guests}
                                                        onChange={(e) => handleInputChange('guests', e.target.value)}
                                                        className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg transition-all duration-300 form-input-focus h-12 text-base"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="rooms" className="text-gray-700 font-semibold">Number of Rooms</Label>
                                                    <Input
                                                        id="rooms"
                                                        type="number"
                                                        placeholder="1"
                                                        value={formData.rooms}
                                                        onChange={(e) => handleInputChange('rooms', e.target.value)}
                                                        className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg transition-all duration-300 form-input-focus h-12 text-base"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="room-type" className="text-gray-700 font-semibold">Room Type</Label>
                                                    <Input
                                                        id="room-type"
                                                        type="text"
                                                        placeholder="e.g., Deluxe King Room"
                                                        value={formData.room_type}
                                                        onChange={(e) => handleInputChange('room_type', e.target.value)}
                                                        className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg transition-all duration-300 form-input-focus h-12 text-base"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="total-price" className="text-gray-700 font-semibold">Total Price</Label>
                                                    <Input
                                                        id="total-price"
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={formData.original_price}
                                                        onChange={(e) => handleInputChange('original_price', e.target.value)}
                                                        className="border-gray-500 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg transition-all duration-300 form-input-focus h-12 text-base"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="currency" className="text-gray-700 font-semibold">Currency</Label>
                                                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                                                    <SelectTrigger className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg transition-all duration-300 form-input-focus h-12 text-base">
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
                                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                            <Button variant="outline" onClick={handleCloseForm} className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto h-12 text-base">
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSubmit}
                                                className={`bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 btn-hover-effect w-full sm:w-auto h-12 text-base ${isFormSubmitting ? 'btn-loading' : ''}`}
                                                disabled={isFormSubmitting}
                                            >
                                                {isFormSubmitting ? 'Adding...' : 'Add Booking'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content with Right Panel */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8 space-y-6 lg:space-y-10">
                {/* Recent Bookings */}
                        <div
                            data-section="recentBookings"
                            className={`transition-all duration-1000 ease-out ${
                                isVisible.recentBookings
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                            }`}
                        >
                            <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6 space-y-3 lg:space-y-0 transition-all duration-1000 delay-200 ${
                                isVisible.recentBookings
                                    ? 'opacity-100 translate-x-0'
                                    : 'opacity-0 -translate-x-8'
                            }`}>
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Recent Bookings</h2>
                                <Link href="/bookings">
                                    <Button variant="link" className="text-yellow-600 hover:text-yellow-700 p-0 h-auto font-semibold text-base lg:text-lg transition-all duration-300 hover:scale-105">View All →</Button>
                                </Link>
                            </div>
                            <div className="flex space-x-4 lg:space-x-6 overflow-x-auto pb-4 lg:pb-6 scrollbar-hide">
                                {hotel_bookings && hotel_bookings.length > 0 ? (
                                    hotel_bookings.slice(0, 4).map((booking, index) => (
                                        <Card
                                            key={booking.id}
                                            className={`min-w-[280px] lg:min-w-[320px] cursor-pointer hover:shadow-xl transition-all duration-500 transform hover:scale-105 active:scale-95 border-0 bg-white/90 backdrop-blur-sm hover-lift touch-manipulation ${
                                                isVisible.recentBookings
                                                    ? 'opacity-100 translate-y-0'
                                                    : 'opacity-0 translate-y-8'
                                            }`}
                                            style={{
                                                transitionDelay: `${index * 100}ms`,
                                                animationDelay: `${index * 100}ms`
                                            }}
                                            onClick={() => handleBookingClick(booking)}
                                        >
                                            <div className="relative image-hover">
                                                {booking.enriched_data?.overview?.screenshots && booking.enriched_data.overview.screenshots.length > 0 ? (
                                                    <img
                                                        src={booking.enriched_data.overview.screenshots[0]}
                                                        alt={booking.hotel_name}
                                                        className="w-full h-40 lg:h-48 object-cover rounded-t-lg transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-40 lg:h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                                                        <span className="text-gray-500 text-sm">No image available</span>
                                                    </div>
                                                )}
                                            </div>
                                            <CardContent className="p-4 lg:p-6">
                                                <h3 className="font-bold text-gray-900 mb-2 text-base lg:text-lg">{booking.hotel_name}</h3>
                                                <div className="flex items-center text-sm text-gray-700 mb-3">
                                                    <MapPin className="h-4 w-4 mr-2 text-yellow-600" />
                                                    {booking.location}
                                                </div>
                                                <p className="text-lg lg:text-xl font-bold text-yellow-600 mb-3">
                                                    ${Number(booking.price_per_night).toFixed(2)} <span className="text-sm text-gray-600 font-normal">/ night</span>
                                                </p>
                                                <div className="flex items-center justify-between text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                                                    <span className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-1 text-yellow-500" />
                                                        {booking.nights} nights
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Users className="h-4 w-4 mr-1 text-yellow-500" />
                                                        {booking.guests} guests
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className={`flex items-center justify-center w-full py-12 lg:py-16 transition-all duration-1000 delay-300 ${
                                        isVisible.recentBookings
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-8'
                                    }`}>
                                        <div className="text-center bg-white/60 rounded-2xl border-2 border-dashed border-gray-300 p-6 lg:p-12 max-w-sm lg:max-w-md hover-lift transition-all duration-500 mx-4">
                                            <div className="mx-auto w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mb-4 lg:mb-6 animate-float">
                                                <Building className="w-10 h-10 lg:w-12 lg:h-12 text-yellow-600" />
                                            </div>
                                            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3">No Bookings Yet</h3>
                                            <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base px-2">Start tracking your hotel bookings to monitor price pulses and save money on every trip.</p>
                                            <Button onClick={handleAddBookingClick} className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-6 lg:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 btn-hover-effect w-full touch-manipulation">
                                                <Plus className="w-5 h-5 mr-2" />
                                                Add Your First Booking
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div
                            data-section="navigationTabs"
                            className={`transition-all duration-1000 ease-out ${
                                isVisible.navigationTabs
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                            }`}
                        >
                            <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6 space-y-4 lg:space-y-0 transition-all duration-1000 delay-200 ${
                                isVisible.navigationTabs
                                    ? 'opacity-100 translate-x-0'
                                    : 'opacity-0 -translate-x-8'
                            }`}>
                                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
                                    <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-6">
                                        <button
                                            onClick={() => setActiveNavTab('most-popular')}
                                            className={`font-bold pb-2 transition-all duration-300 hover:scale-105 text-center lg:text-left ${
                                                activeNavTab === 'most-popular'
                                                    ? 'text-xl lg:text-2xl text-gray-900 border-b-2 border-yellow-500'
                                                    : 'text-base lg:text-lg text-gray-600 hover:text-gray-900 hover:text-lg lg:hover:text-xl'
                                            }`}
                                        >
                                            Most Popular
                                        </button>
                                        <button
                                            onClick={() => setActiveNavTab('special-offers')}
                                            className={`font-bold pb-2 transition-all duration-300 hover:scale-105 text-center lg:text-left ${
                                                activeNavTab === 'special-offers'
                                                    ? 'text-xl lg:text-2xl text-gray-900 border-b-2 border-yellow-500'
                                                    : 'text-base lg:text-lg text-gray-600 hover:text-gray-900 hover:text-lg lg:hover:text-xl'
                                            }`}
                                        >
                                            Special Offers
                                        </button>
                                        <button
                                            onClick={() => setActiveNavTab('near-me')}
                                            className={`font-bold pb-2 transition-all duration-300 hover:scale-105 text-center lg:text-left ${
                                                activeNavTab === 'near-me'
                                                    ? 'text-xl lg:text-2xl text-gray-900 border-b-2 border-yellow-500'
                                                    : 'text-base lg:text-lg text-gray-600 hover:text-gray-900 hover:text-lg lg:hover:text-xl'
                                            }`}
                                        >
                                            Near Me
                                        </button>
                                    </div>
                                </div>
                                <Button variant="link" className="text-yellow-600 hover:text-yellow-700 p-0 h-auto font-semibold text-base lg:text-lg transition-all duration-300 hover:scale-105 text-center lg:text-left">View All →</Button>
                            </div>
                            {/* Tab Content */}
                            {activeNavTab === 'most-popular' && (
                                <div
                                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
                                    data-section="hotelCards"
                                >
                                    {popularHotels.map((hotel, index) => (
                                        <Card
                                            key={index}
                                            className={`cursor-pointer hover:shadow-xl transition-all duration-500 transform hover:scale-105 active:scale-95 border-0 bg-white/90 backdrop-blur-sm hover-lift touch-manipulation ${
                                                isVisible.hotelCards
                                                    ? 'opacity-100 translate-y-0'
                                                    : 'opacity-0 translate-y-8'
                                            }`}
                                            style={{
                                                transitionDelay: `${index * 100}ms`,
                                                animationDelay: `${index * 100}ms`
                                            }}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={hotel.image}
                                                    alt={hotel.name}
                                                    className="w-full h-20 lg:h-24 object-cover rounded-t-lg"
                                                />
                                            </div>
                                            <CardContent className="p-3 lg:p-4">
                                                <h3 className="font-semibold text-gray-900 text-xs lg:text-sm mb-2">{hotel.name}</h3>
                                                <div className="flex items-center text-xs text-gray-700 mb-2">
                                                    <MapPin className="h-3 w-3 mr-1 text-yellow-500" />
                                                    {hotel.country}
                                                </div>
                                                <p className="text-xs lg:text-sm font-bold text-yellow-600">${Number(hotel.price).toFixed(2)} <span className="text-xs text-gray-500 font-normal">/ night</span></p>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                        )}

                            {activeNavTab === 'special-offers' && (
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                                    {popularHotels.slice(0, 2).map((hotel, index) => (
                                        <Card
                                            key={index}
                                            className={`cursor-pointer hover:shadow-xl transition-all duration-500 transform hover:scale-105 active:scale-95 border-2 border-orange-200 bg-white/90 backdrop-blur-sm hover-lift touch-manipulation ${
                                                isVisible.hotelCards
                                                    ? 'opacity-100 translate-y-0'
                                                    : 'opacity-0 translate-y-8'
                                            }`}
                                            style={{
                                                transitionDelay: `${index * 100}ms`,
                                                animationDelay: `${index * 100}ms`
                                            }}
                                        >
                                            <div className="relative image-hover">
                                                <img
                                                    src={hotel.image}
                                                    alt={hotel.name}
                                                    className="w-full h-20 lg:h-24 object-cover rounded-t-lg transition-transform duration-500"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <Badge className="bg-orange-500 text-white text-xs animate-pulse">Special Offer</Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-3 lg:p-4">
                                                <h3 className="font-semibold text-gray-900 text-xs lg:text-sm mb-2">{hotel.name}</h3>
                                                <div className="flex items-center text-xs text-gray-700 mb-2">
                                                    <MapPin className="h-3 w-3 mr-1 text-orange-500" />
                                                    {hotel.country}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-xs lg:text-sm line-through text-gray-400">${Number(hotel.price + 10).toFixed(2)}</p>
                                                    <p className="text-xs lg:text-sm font-bold text-orange-600">${Number(hotel.price).toFixed(2)} <span className="text-xs text-gray-500 font-normal">/ night</span></p>
                                                </div>
                    </CardContent>
                </Card>
                                    ))}
                                </div>
                            )}

                            {activeNavTab === 'near-me' && (
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                                    {popularHotels.slice(0, 3).map((hotel, index) => (
                                        <Card
                                            key={index}
                                            className={`cursor-pointer hover:shadow-xl transition-all duration-500 transform hover:scale-105 active:scale-95 border-2 border-green-200 bg-white/90 backdrop-blur-sm hover-lift touch-manipulation ${
                                                isVisible.hotelCards
                                                    ? 'opacity-100 translate-y-0'
                                                    : 'opacity-0 translate-y-8'
                                            }`}
                                            style={{
                                                transitionDelay: `${index * 100}ms`,
                                                animationDelay: `${index * 100}ms`
                                            }}
                                        >
                                            <div className="relative image-hover">
                                                <img
                                                    src={hotel.image}
                                                    alt={hotel.name}
                                                    className="w-full h-20 lg:h-24 object-cover rounded-t-lg transition-transform duration-500"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <Badge className="bg-green-500 text-white text-xs animate-pulse">Nearby</Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-3 lg:p-4">
                                                <h3 className="font-semibold text-gray-900 text-xs lg:text-sm mb-2">{hotel.name}</h3>
                                                <div className="flex items-center text-xs text-gray-700 mb-2">
                                                    <MapPin className="h-3 w-3 mr-1 text-green-500" />
                                                    {hotel.country}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs lg:text-sm font-bold text-green-600">${Number(hotel.price).toFixed(2)} <span className="text-xs text-gray-500 font-normal">/ night</span></p>
                                                    <p className="text-xs text-green-600 font-medium">0.5 km away</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                            )}
                                        </div>
                    </div>
                                        </div>
                                    </div>

            {/* Toaster for notifications */}
            <Toaster />

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
                <div className="flex items-center justify-around py-3">
                    {mobileNavigationItems.slice(0, 4).map((item) => {
                        const Icon = item.icon;
                        const isActive = item.page === 'dashboard';

                        return (
                            <Link key={item.href} href={item.href} className="flex flex-col items-center p-2 active:scale-95 transition-transform">
                                <div className="relative">
                                    {item.hasNotification ? (
                                        <div className="relative">
                                            <Icon className={`h-6 w-6 ${
                                                isActive ? 'text-yellow-600' : 'text-gray-600'
                                            }`} />
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-xs text-white font-medium">{item.notificationCount}</span>
                                        </div>
                                        </div>
                                    ) : (
                                        <Icon className={`h-6 w-6 ${
                                            isActive ? 'text-yellow-600' : 'text-gray-600'
                                        }`} />
                                    )}
                                </div>
                                <span className={`text-xs mt-1 ${
                                    isActive ? 'font-semibold text-yellow-600' : 'text-gray-600'
                                }`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                        </div>
            </div>
        </div>
    );
}
