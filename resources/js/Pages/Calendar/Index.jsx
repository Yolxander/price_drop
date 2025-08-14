import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Clock,
    Target,
    Users,
    CheckCircle,
    AlertCircle,
    FileText,
    DollarSign,
    Eye,
    EyeOff,
    Building2,
    MapPin,
    Star,
    Home,
    Grid3X3,
    Bell,
    Heart,
    Settings,
    LogOut
} from 'lucide-react';

export default function Calendar({ auth, bookings, upcomingBookings }) {
    // Ensure bookings and upcomingBookings are arrays
    const safeBookings = Array.isArray(bookings) ? bookings : [];
    const safeUpcomingBookings = Array.isArray(upcomingBookings) ? upcomingBookings : [];
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    // Initialize showMonthSummary from localStorage, default to false (hidden)
    const [showMonthSummary, setShowMonthSummary] = useState(() => {
        try {
            const saved = localStorage.getItem('calendar-show-summary');
            return saved !== null ? JSON.parse(saved) : false;
        } catch (error) {
            // Fallback to false if localStorage is not available
            return false;
        }
    });

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        return { daysInMonth, startingDay };
    };

    const getBookingsForDate = (date) => {
        const dateString = date.toISOString().split('T')[0];
        return safeBookings.filter(booking => {
            const checkIn = new Date(booking.check_in_date).toISOString().split('T')[0];
            const checkOut = new Date(booking.check_out_date).toISOString().split('T')[0];
            return dateString >= checkIn && dateString <= checkOut;
        });
    };

    const getBookingIcon = (type) => {
        switch (type) {
            case 'hotel':
                return <Building2 className="w-3 h-3" />;
            case 'flight':
                return <Target className="w-3 h-3" />;
            case 'activity':
                return <Users className="w-3 h-3" />;
            default:
                return <Building2 className="w-3 h-3" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
            case 'confirmed':
                return <CheckCircle className="w-3 h-3 text-green-600" />;
            case 'pending':
            case 'processing':
                return <Clock className="w-3 h-3 text-blue-600" />;
            case 'cancelled':
                return <AlertCircle className="w-3 h-3 text-red-600" />;
            default:
                return <AlertCircle className="w-3 h-3 text-gray-600" />;
        }
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date) => {
        if (!date || !selectedDate) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    const handleToggleSummary = () => {
        const newState = !showMonthSummary;
        setShowMonthSummary(newState);
        try {
            localStorage.setItem('calendar-show-summary', JSON.stringify(newState));
        } catch (error) {
            // Silently fail if localStorage is not available
            console.warn('Could not save calendar preference to localStorage');
        }
    };

    const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        days.push(date);
    }

    const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

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
                    <Link href="/calendar" className="block">
                        <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                            <CalendarIcon className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-gray-900">Calendar</span>
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
                <Head title="Calendar" />

                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Calendar View 📅
                        </h1>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                onClick={handleToggleSummary}
                            >
                                {showMonthSummary ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                {showMonthSummary ? 'Hide' : 'Show'} Summary
                            </Button>
                            <Link href="/bookings/create">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Booking
                                </Button>
                            </Link>
                            <Button onClick={() => setCurrentDate(new Date())} variant="outline">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                Today
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="space-y-6">

                {/* Month Summary */}
                <div className={`transition-all duration-300 ease-in-out ${showMonthSummary ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                    <Card className="bg-white border border-gray-200">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-foreground">
                                        {safeBookings.filter(b => {
                                            const checkIn = new Date(b.check_in_date);
                                            return checkIn.getMonth() === currentDate.getMonth() && checkIn.getFullYear() === currentDate.getFullYear();
                                        }).length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Total Bookings</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {safeBookings.filter(b => {
                                            const checkIn = new Date(b.check_in_date);
                                            return checkIn.getMonth() === currentDate.getMonth() && checkIn.getFullYear() === currentDate.getFullYear() && b.status === 'active';
                                        }).length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Active</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {safeBookings.filter(b => {
                                            const checkIn = new Date(b.check_in_date);
                                            return checkIn.getMonth() === currentDate.getMonth() && checkIn.getFullYear() === currentDate.getFullYear() && b.status === 'pending';
                                        }).length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Pending</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {safeBookings.filter(b => b.price_drop_detected).length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Price Drops</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Calendar Navigation */}
                <Card className="bg-white border border-gray-200">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => navigateMonth('prev')}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {formatDate(currentDate)}
                                </h2>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => navigateMonth('next')}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* Legend */}
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <Building2 className="w-3 h-3" />
                                        <span>Hotels</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                        <span>Active</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3 text-blue-600" />
                                        <span>Pending</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Day headers */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {days.map((date, index) => (
                                <div
                                    key={index}
                                    className={`min-h-[100px] p-2 border border-gray-200 transition-colors ${
                                        date ? 'hover:bg-gray-50 cursor-pointer' : ''
                                    } ${
                                        isToday(date) ? 'bg-blue-50 border-blue-500' : ''
                                    } ${
                                        isSelected(date) ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                    onClick={() => date && setSelectedDate(date)}
                                >
                                    {date ? (
                                        <>
                                            <div className="text-sm font-medium text-gray-900 mb-1">
                                                {date.getDate()}
                                            </div>
                                            <div className="space-y-1">
                                                {getBookingsForDate(date).slice(0, 2).map(booking => (
                                                    <div
                                                        key={booking.id}
                                                        className="flex items-center space-x-1 p-1 rounded text-xs bg-gray-100"
                                                    >
                                                        <Building2 className="w-3 h-3" />
                                                        <span className="truncate">{booking.hotel_name}</span>
                                                    </div>
                                                ))}
                                                {getBookingsForDate(date).length > 2 && (
                                                    <div className="text-xs text-gray-500">
                                                        +{getBookingsForDate(date).length - 2} more
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-sm text-gray-300">
                                            {/* Empty cell */}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Selected Date Bookings */}
                {selectedDate && (
                    <Card className="bg-white border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-gray-900">
                                Bookings for {selectedDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                {selectedDateBookings.length} bookings scheduled
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {selectedDateBookings.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No bookings scheduled for this date
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedDateBookings.map(booking => (
                                        <Link key={booking.id} href={`/bookings/${booking.id}`}>
                                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                                <div className="flex items-center space-x-3">
                                                    <Building2 className="w-5 h-5 text-blue-600" />
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{booking.hotel_name}</h3>
                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                            <MapPin className="w-3 h-3" />
                                                            <span>{booking.location}</span>
                                                            {booking.star_rating && (
                                                                <>
                                                                    <Star className="w-3 h-3 text-yellow-500" />
                                                                    <span>{booking.star_rating}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge className={getStatusColor(booking.status)} size="sm">
                                                        {booking.status}
                                                    </Badge>
                                                    {getStatusIcon(booking.status)}
                                                    {booking.price_drop_detected && (
                                                        <Badge className="bg-green-100 text-green-800" size="sm">
                                                            Price Drop
                                                        </Badge>
                                                    )}
                                                    <Button variant="outline" size="sm">
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Upcoming Bookings */}
                <Card className="bg-white border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Upcoming Bookings</CardTitle>
                        <CardDescription className="text-gray-600">
                            Next 7 days
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {safeUpcomingBookings.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No upcoming bookings in the next 7 days
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {safeUpcomingBookings.map(booking => (
                                    <Link key={booking.id} href={`/bookings/${booking.id}`}>
                                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="flex items-center space-x-3">
                                                <Building2 className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{booking.hotel_name}</h3>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{booking.location}</span>
                                                        {booking.star_rating && (
                                                            <>
                                                                <Star className="w-3 h-3 text-yellow-500" />
                                                                <span>{booking.star_rating}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge className={getStatusColor(booking.status)} size="sm">
                                                    {booking.status}
                                                </Badge>
                                                {getStatusIcon(booking.status)}
                                                {booking.price_drop_detected && (
                                                    <Badge className="bg-green-100 text-green-800" size="sm">
                                                        Price Drop
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
