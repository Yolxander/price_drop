import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';
import Sidebar from '@/components/ui/sidebar';
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
    Search,
    Menu,
    X,
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showMobileActions, setShowMobileActions] = useState(false);
    const [isVisible, setIsVisible] = useState({
        header: false,
        searchBar: false,
        monthSummary: false,
        calendarNavigation: false,
        selectedDateBookings: false,
        upcomingBookings: false
    });

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
            icon: CalendarIcon,
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

    // Intersection Observer for scroll-triggered animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const section = entry.target.getAttribute('data-section');
                        if (section && isVisible.hasOwnProperty(section)) {
                            setIsVisible(prev => ({
                                ...prev,
                                [section]: true
                            }));
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observe all sections with data-section attributes
        const sections = document.querySelectorAll('[data-section]');
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    // Handle clicking outside mobile actions dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMobileActions && !event.target.closest('.mobile-actions-container')) {
                setShowMobileActions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showMobileActions]);

    // Handle clicking outside mobile menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
                setIsMobileMenuOpen(false);
                setShowMobileActions(false); // Reset action buttons when closing mobile menu
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

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
                return <Clock className="w-3 h-3 text-yellow-600" />;
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

        // Show toast notification for month navigation
        const monthName = newDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        toast.success(`Navigated to ${monthName}`, {
            icon: <CalendarIcon className="h-4 w-4" />,
            duration: 2000,
        });
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

        // Show toast notification for summary toggle
        toast.success(
            newState ? 'Month summary shown' : 'Month summary hidden',
            {
                icon: newState ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />,
                duration: 2000,
            }
        );

        try {
            localStorage.setItem('calendar-show-summary', JSON.stringify(newState));
        } catch (error) {
            // Silently fail if localStorage is not available
            console.warn('Could not save calendar preference to localStorage');
        }
    };

    const handleGoToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());

        // Show toast notification for going to today
        toast.success('Returned to today', {
            icon: <CalendarIcon className="h-4 w-4" />,
            duration: 2000,
        });
    };

    const handleDateSelection = (date) => {
        if (date) {
            setSelectedDate(date);
            const bookings = getBookingsForDate(date);

            // Show toast notification for date selection
            if (bookings.length > 0) {
                toast.success(`${bookings.length} booking${bookings.length > 1 ? 's' : ''} found for ${date.toLocaleDateString()}`, {
                    icon: <Building2 className="h-4 w-4" />,
                    duration: 3000,
                });
            } else {
                toast.info(`No bookings for ${date.toLocaleDateString()}`, {
                    icon: <CalendarIcon className="h-4 w-4" />,
                    duration: 2000,
                });
            }
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
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
                        setIsMobileMenuOpen(false);
                        setShowMobileActions(false); // Reset action buttons when closing mobile menu
                    }} />
                    <div className="mobile-menu-container fixed inset-y-0 left-0 flex w-80 flex-col bg-white border-r border-gray-200 animate-in slide-in-from-left duration-300">
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
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setShowMobileActions(false); // Reset action buttons to hidden state
                                }}
                                className="h-8 w-8"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Mobile Navigation */}
                        <nav className="flex-1 p-4 space-y-2">
                            {mobileNavigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.page === 'calendar';

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
                                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-lg">
                                        {auth?.user?.name?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{auth?.user?.name || 'User'}</p>
                                    <p className="text-sm text-gray-600">{auth?.user?.email || 'user@example.com'}</p>
                                </div>
                            </div>
                            <Link href="/" className="block mt-3">
                                <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 active:bg-gray-100 rounded-xl cursor-pointer transition-all duration-200 active:scale-95">
                                    <LogOut className="h-5 w-5 text-gray-600" />
                                    <span className="text-gray-700 font-medium">Log Out</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
                <Sidebar activePage="calendar" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Head title="Calendar" />

                {/* Mobile Header */}
                <div className="lg:hidden bg-white border-b border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setIsMobileMenuOpen(true);
                                setShowMobileActions(false); // Reset action buttons to hidden state
                            }}
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
                            <span className="text-xl font-bold text-yellow-600">Calendar</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowMobileActions(!showMobileActions)}
                            className={`h-10 w-10 active:scale-95 transition-all duration-200 relative ${
                                showMobileActions
                                    ? 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                                    : 'hover:bg-gray-50'
                            }`}
                            title={showMobileActions ? "Hide Actions" : "Show Actions"}
                        >
                            <Plus className={`h-6 w-6 transition-transform duration-200 ${
                                showMobileActions ? 'rotate-45' : 'rotate-0'
                            }`} />
                        </Button>
                    </div>

                    {/* Mobile Actions Dropdown */}
                    {showMobileActions && (
                        <div className="mobile-actions-container mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                            <div className="space-y-3">
                                <Button
                                    variant="outline"
                                    onClick={handleToggleSummary}
                                    className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 w-full h-10"
                                >
                                    {showMonthSummary ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                    {showMonthSummary ? 'Hide' : 'Show'} Summary
                                </Button>
                                <Link href="/bookings/create" className="w-full">
                                    <Button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-6 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 w-full h-10">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Booking
                                    </Button>
                                </Link>
                                <Button
                                    onClick={handleGoToToday}
                                    variant="outline"
                                    className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 w-full h-10"
                                >
                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                    Today
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Header */}
                <div
                    data-section="header"
                    className={`bg-white border-b border-gray-200 p-4 lg:p-6 transition-all duration-1000 ease-out ${
                        isVisible.header
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="w-full lg:max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search calendar..."
                                    className="pl-10 form-input-focus transition-all duration-300 w-full h-12 text-base"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                            <Button
                                variant="outline"
                                onClick={handleToggleSummary}
                                className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 w-full sm:w-auto h-10 hidden lg:flex"
                            >
                                {showMonthSummary ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                {showMonthSummary ? 'Hide' : 'Show'} Summary
                            </Button>
                            <Link href="/bookings/create" className="w-full sm:w-auto hidden lg:block">
                                <Button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-6 lg:px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 w-full h-10">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Booking
                                </Button>
                            </Link>
                            <Button
                                onClick={handleGoToToday}
                                variant="outline"
                                className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 w-full sm:w-auto h-10 hidden lg:flex"
                            >
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                Today
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 lg:p-6 pb-20 lg:pb-6">
                    <div className="space-y-4 lg:space-y-6">

                {/* Month Summary */}
                <div
                    data-section="monthSummary"
                    className={`transition-all duration-1000 ease-out ${
                        showMonthSummary ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
                    } ${
                        isVisible.monthSummary && showMonthSummary
                            ? 'translate-y-0'
                            : 'translate-y-8'
                    }`}
                >
                    <Card className="bg-white border border-gray-200 transition-all duration-500 ease-out hover-lift">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                                <div className="transition-all duration-500 ease-out hover:scale-105" style={{ transitionDelay: '0ms' }}>
                                    <div className="text-xl lg:text-2xl font-bold text-foreground animate-pulse">
                                        {safeBookings.filter(b => {
                                            const checkIn = new Date(b.check_in_date);
                                            return checkIn.getMonth() === currentDate.getMonth() && checkIn.getFullYear() === currentDate.getFullYear();
                                        }).length}
                                    </div>
                                    <div className="text-xs lg:text-sm text-muted-foreground">Total Bookings</div>
                                </div>
                                <div className="transition-all duration-500 ease-out hover:scale-105" style={{ transitionDelay: '100ms' }}>
                                    <div className="text-xl lg:text-2xl font-bold text-yellow-600 animate-pulse">
                                        {safeBookings.filter(b => {
                                            const checkIn = new Date(b.check_in_date);
                                            return checkIn.getMonth() === currentDate.getMonth() && checkIn.getFullYear() === currentDate.getFullYear() && b.status === 'active';
                                        }).length}
                                    </div>
                                    <div className="text-xs lg:text-sm text-muted-foreground">Active</div>
                                </div>
                                <div className="transition-all duration-500 ease-out hover:scale-105" style={{ transitionDelay: '200ms' }}>
                                    <div className="text-xl lg:text-2xl font-bold text-orange-600 animate-pulse">
                                        {safeBookings.filter(b => {
                                            const checkIn = new Date(b.check_in_date);
                                            return checkIn.getMonth() === currentDate.getMonth() && checkIn.getFullYear() === currentDate.getFullYear() && b.status === 'pending';
                                        }).length}
                                    </div>
                                    <div className="text-xs lg:text-sm text-muted-foreground">Pending</div>
                                </div>
                                <div className="transition-all duration-500 ease-out hover:scale-105" style={{ transitionDelay: '300ms' }}>
                                    <div className="text-xl lg:text-2xl font-bold text-green-600 animate-pulse">
                                        {safeBookings.filter(b => b.price_drop_detected).length}
                                    </div>
                                    <div className="text-xs lg:text-sm text-muted-foreground">Price Pulses</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Calendar Navigation */}
                <Card
                    data-section="calendarNavigation"
                    className={`bg-white border border-gray-200 transition-all duration-1000 ease-out hover-lift ${
                        isVisible.calendarNavigation
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}
                >
                    <CardHeader className="p-4 lg:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            <div className="flex items-center justify-center lg:justify-start space-x-2 lg:space-x-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => navigateMonth('prev')}
                                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 h-8 w-8 lg:h-10 lg:w-10"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 text-center lg:text-left">
                                    {formatDate(currentDate)}
                                </h2>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => navigateMonth('next')}
                                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 h-8 w-8 lg:h-10 lg:w-10"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-center lg:justify-end space-x-2 lg:space-x-4">
                                {/* Legend */}
                                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs lg:text-sm text-gray-600">
                                    <div className="flex items-center space-x-1 transition-all duration-300 hover:scale-105">
                                        <Building2 className="w-3 h-3" />
                                        <span>Hotels</span>
                                    </div>
                                    <div className="flex items-center space-x-1 transition-all duration-300 hover:scale-105">
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                        <span>Active</span>
                                    </div>
                                    <div className="flex items-center space-x-1 transition-all duration-300 hover:scale-105">
                                        <Clock className="w-3 h-3 text-yellow-600" />
                                        <span>Pending</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 lg:p-6">
                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Day headers */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="p-1 lg:p-2 text-center text-xs lg:text-sm font-medium text-gray-600">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {days.map((date, index) => (
                                <div
                                    key={index}
                                    className={`min-h-[80px] lg:min-h-[100px] p-1 lg:p-2 border border-gray-200 transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
                                        date ? 'hover:bg-gray-50 cursor-pointer hover:shadow-md touch-manipulation' : ''
                                    } ${
                                        isToday(date) ? 'bg-yellow-50 border-yellow-500 animate-pulse' : ''
                                    } ${
                                        isSelected(date) ? 'ring-2 ring-yellow-500 shadow-lg' : ''
                                    }`}
                                    onClick={() => date && handleDateSelection(date)}
                                >
                                    {date ? (
                                        <>
                                            <div className="text-xs lg:text-sm font-medium text-gray-900 mb-1">
                                                {date.getDate()}
                                            </div>
                                            <div className="space-y-1">
                                                {getBookingsForDate(date).slice(0, 2).map(booking => (
                                                    <div
                                                        key={booking.id}
                                                        className="flex items-center space-x-1 p-1 rounded text-xs bg-gray-100 transition-all duration-300 hover:scale-105 hover:bg-gray-200"
                                                    >
                                                        <Building2 className="w-3 h-3" />
                                                        <span className="truncate text-xs">{booking.hotel_name}</span>
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
                                        <div className="text-xs lg:text-sm text-gray-300">
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
                    <Card
                        data-section="selectedDateBookings"
                        className={`bg-white border border-gray-200 transition-all duration-1000 ease-out hover-lift ${
                            isVisible.selectedDateBookings
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                        }`}
                    >
                        <CardHeader className="p-4 lg:p-6">
                            <CardTitle className="text-gray-900 text-lg lg:text-xl">
                                Bookings for {selectedDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </CardTitle>
                            <CardDescription className="text-gray-600 text-sm lg:text-base">
                                {selectedDateBookings.length} bookings scheduled
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 lg:p-6">
                            {selectedDateBookings.length === 0 ? (
                                <div className="text-center py-6 lg:py-8 text-gray-500">
                                    <CalendarIcon className="h-10 w-10 lg:h-12 lg:w-12 text-gray-300 mx-auto mb-4 animate-float" />
                                    <p className="text-sm lg:text-base">No bookings scheduled for this date</p>
                                </div>
                            ) : (
                                <div className="space-y-3 lg:space-y-4">
                                    {selectedDateBookings.map((booking, index) => (
                                        <Link key={booking.id} href={`/bookings/${booking.id}`}>
                                            <div
                                                className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 ease-out hover-lift cursor-pointer space-y-3 lg:space-y-0"
                                                style={{ transitionDelay: `${index * 100}ms` }}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <Building2 className="w-5 h-5 text-yellow-600 transition-all duration-300 hover:scale-110" />
                                                    <div>
                                                        <h3 className="font-medium text-gray-900 text-sm lg:text-base">{booking.hotel_name}</h3>
                                                        <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-600">
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
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Badge className={`${getStatusColor(booking.status)} transition-all duration-300 hover:scale-105`} size="sm">
                                                            {booking.status}
                                                        </Badge>
                                                        {getStatusIcon(booking.status)}
                                                        {booking.price_drop_detected && (
                                                            <Badge className="bg-green-100 text-green-800 animate-pulse transition-all duration-300 hover:scale-105" size="sm">
                                                                Price Pulse
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 w-full sm:w-auto h-8 lg:h-9">
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
                <Card
                    data-section="upcomingBookings"
                    className={`bg-white border border-gray-200 transition-all duration-1000 ease-out hover-lift ${
                        isVisible.upcomingBookings
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}
                >
                    <CardHeader className="p-4 lg:p-6">
                        <CardTitle className="text-gray-900 text-lg lg:text-xl">Upcoming Bookings</CardTitle>
                        <CardDescription className="text-gray-600 text-sm lg:text-base">
                            Next 7 days
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 lg:p-6">
                        {safeUpcomingBookings.length === 0 ? (
                            <div className="text-center py-6 lg:py-8 text-gray-500">
                                <Clock className="h-10 w-10 lg:h-12 lg:w-12 text-gray-300 mx-auto mb-4 animate-float" />
                                <p className="text-sm lg:text-base">No upcoming bookings in the next 7 days</p>
                            </div>
                        ) : (
                            <div className="space-y-3 lg:space-y-4">
                                {safeUpcomingBookings.map((booking, index) => (
                                    <Link key={booking.id} href={`/bookings/${booking.id}`}>
                                        <div
                                            className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 ease-out hover-lift cursor-pointer space-y-3 lg:space-y-0"
                                            style={{ transitionDelay: `${index * 100}ms` }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Building2 className="w-5 h-5 text-yellow-600 transition-all duration-300 hover:scale-110" />
                                                <div>
                                                    <h3 className="font-medium text-gray-900 text-sm lg:text-base">{booking.hotel_name}</h3>
                                                    <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-600">
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
                                                <Badge className={`${getStatusColor(booking.status)} transition-all duration-300 hover:scale-105`} size="sm">
                                                    {booking.status}
                                                </Badge>
                                                {getStatusIcon(booking.status)}
                                                {booking.price_drop_detected && (
                                                    <Badge className="bg-green-100 text-green-800 animate-pulse transition-all duration-300 hover:scale-105" size="sm">
                                                        Price Pulse
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

            {/* Toast Notifications */}
            <Toaster />

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
                <div className="flex items-center justify-around py-3">
                    {mobileNavigationItems.slice(0, 4).map((item) => {
                        const Icon = item.icon;
                        const isActive = item.page === 'calendar';

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
