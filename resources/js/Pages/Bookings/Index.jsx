import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Head, Link, router } from '@inertiajs/react';
import Sidebar from '@/components/ui/sidebar';
import { toast, Toaster } from 'sonner';
import {
    Search,
    Filter,
    MoreHorizontal,
    MapPin,
    Bed,
    Bath,
    Square,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    List,
    Calendar,
    Eye,
    Trash2,
    Menu,
    Settings,
    CheckCircle,
    AlertCircle,
    X,
    Home,
    Grid3X3,
    Bell,
    Heart,
    LogOut,
    CalendarIcon,
    Plus
} from 'lucide-react';

export default function BookingsIndex({ auth, bookings, filters, stats }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [displayedBookings, setDisplayedBookings] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAddBooking, setShowAddBooking] = useState(false);
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
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
    const [isVisible, setIsVisible] = useState({
        header: false,
        searchBar: false,
        bookingsGrid: false,
        pagination: false
    });
    const itemsPerPage = 12;

    // Mobile navigation items
    const mobileNavigationItems = [
        {
            href: '/dashboard',
            icon: Home,
            label: 'My Trips',
            page: 'dashboard'
        },
        {
            href: '/bookings',
            icon: Grid3X3,
            label: 'All My Bookings',
            page: 'bookings'
        },
        {
            href: '/calendar',
            icon: CalendarIcon,
            label: 'Trip Calendar',
            page: 'calendar'
        },
        {
            href: '/price-alerts',
            icon: Bell,
            label: 'Price Drops',
            page: 'alerts',
            hasNotification: true,
            notificationCount: 2
        },
        {
            href: '/favorites',
            icon: Heart,
            label: 'My Wishlist',
            page: 'favorites'
        },
        {
            href: '/settings',
            icon: Settings,
            label: 'My Preferences',
            page: 'settings'
        }
    ];

    // Initialize displayed bookings
    useEffect(() => {
        // Convert bookings data to properties format for display
        const properties = bookings ? bookings.map(booking => {
            // Get the first screenshot from enriched data, or use placeholder
            const screenshots = booking.enriched_data?.overview?.screenshots || [];
            const image = screenshots.length > 0 ? screenshots[0] : null;

            return {
                id: booking.id,
                name: booking.hotel_name,
                location: booking.location,
                price: booking.total_price,
                image: image,
                beds: booking.rooms || 1,
                baths: 2, // Default value since we don't have this in booking data
                sqft: 1500, // Default value since we don't have this in booking data
                checkIn: booking.check_in_date,
                checkOut: booking.check_out_date,
                guests: booking.guests,
                nights: booking.nights,
                status: booking.status,
                price_alert_active: booking.price_alert_active // Add this line
            };
        }) : [];

        const filtered = properties.filter(property => {
            const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
            const matchesSearch = !searchQuery ||
                property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.location.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });

        setDisplayedBookings(filtered.slice(0, itemsPerPage));
        setCurrentPage(1);
        setHasMore(filtered.length > itemsPerPage);
    }, [bookings, statusFilter, searchQuery]);

    // Load more bookings function
    const loadMoreBookings = () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            // Convert bookings data to properties format for display
            const properties = bookings ? bookings.map(booking => {
                // Get the first screenshot from enriched data, or use placeholder
                const screenshots = booking.enriched_data?.overview?.screenshots || [];
                const image = screenshots.length > 0 ? screenshots[0] : null;

                return {
                    id: booking.id,
                    name: booking.hotel_name,
                    location: booking.location,
                    price: booking.total_price,
                    image: image,
                    beds: booking.rooms || 1,
                    baths: 2, // Default value since we don't have this in booking data
                    sqft: 1500, // Default value since we don't have this in booking data
                    checkIn: booking.check_in_date,
                    checkOut: booking.check_out_date,
                    guests: booking.guests,
                    nights: booking.nights,
                    status: booking.status,
                    price_alert_active: booking.price_alert_active // Add this line
                };
            }) : [];

            const filtered = properties.filter(property => {
                const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
                const matchesSearch = !searchQuery ||
                    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    property.location.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesStatus && matchesSearch;
            });

            const nextPage = currentPage + 1;
            const startIndex = (nextPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const newBookings = filtered.slice(startIndex, endIndex);

            setDisplayedBookings(prev => [...prev, ...newBookings]);
            setCurrentPage(nextPage);
            setHasMore(endIndex < filtered.length);
            setIsLoading(false);
        }, 500);
    };

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMoreBookings();
                }
            },
            { threshold: 0.1 }
        );

        const sentinel = document.getElementById('scroll-sentinel');
        if (sentinel) {
            observer.observe(sentinel);
        }

        return () => observer.disconnect();
    }, [hasMore, isLoading, currentPage, statusFilter, searchQuery]);

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        if (!bookingToDelete) return;

        setIsDeleting(true);
        router.delete(`/bookings/${bookingToDelete.id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setBookingToDelete(null);
                setIsDeleting(false);
                toast.success('Booking deleted successfully');
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Failed to delete booking');
            }
        });
    };

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
                        console.log('Section visible:', section);
                        setIsVisible(prev => ({ ...prev, [section]: true }));
                    }
                }
            });
        }, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('[data-section]');
        console.log('Found sections:', sections.length);
        sections.forEach(section => {
            console.log('Observing section:', section.dataset.section);
            observer.observe(section);
        });

        // Trigger header animation immediately
        setIsVisible(prev => ({ ...prev, header: true }));

        return () => observer.disconnect();
    }, []);

    // Debug log for state changes
    useEffect(() => {
        console.log('Animation state:', isVisible);
    }, [isVisible]);

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleDeleteClick = (booking) => {
        setBookingToDelete(booking);
        setDeleteDialogOpen(true);
    };

    // Modal functions
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

        const loadingToast = toast.loading('Adding your trip and getting the details...', {
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
                    toast.success('Your trip has been added! We\'ll start watching for price drops.', {
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
                    toast.error('Oops! We couldn\'t add your trip. Please try again.', {
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
            toast.error('Something went wrong. Please try again in a moment.', {
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

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'active':
                return 'default';
            case 'completed':
                return 'secondary';
            case 'paused':
                return 'outline';
            default:
                return 'outline';
        }
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
                                const isActive = item.page === 'bookings';

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
                <Sidebar activePage="bookings" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Head title="Bookings" />

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
                            <span className="text-xl font-bold text-yellow-600">Bookings</span>
                        </div>
                        <div className="w-10" /> {/* Spacer for centering */}
                    </div>
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
                        <div className={`w-full lg:max-w-md transition-all duration-1000 delay-200 ${
                            isVisible.header
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-8'
                        }`}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search bookings..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 transition-all duration-300 hover:shadow-md focus:shadow-lg form-input-focus w-full h-12 text-base"
                                />
                            </div>
                        </div>
                        <div className={`flex items-center justify-center lg:justify-end space-x-2 lg:space-x-4 transition-all duration-1000 delay-400 ${
                            isVisible.header
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-8'
                        }`}>
                            <Button
                                onClick={handleAddBookingClick}
                                className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-4 lg:px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 h-10 flex items-center space-x-2"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Add Booking</span>
                            </Button>
                            <Button variant="outline" className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 active:scale-95 h-10">
                                <Filter className="h-4 w-4" />
                                <span className="hidden sm:inline">Filter</span>
                            </Button>
                            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="h-8 w-8 p-0 transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="h-8 w-8 p-0 transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6">
                    {/* Properties Grid - Scrollable Content */}
                    <div
                        className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6"
                        data-section="bookingsGrid"
                    >
                        {displayedBookings.length > 0 ? (
                            <div className={`grid gap-4 lg:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2' : 'grid-cols-1'}`}>
                                {displayedBookings.map((property, index) => (
                                <div
                                    key={property.id}
                                    className={`relative transition-all duration-1000 ease-out ${
                                        isVisible.bookingsGrid
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-8'
                                    }`}
                                    style={{
                                        transitionDelay: `${index * 100}ms`,
                                        animationDelay: `${index * 100}ms`
                                    }}
                                >
                                    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer hover:scale-[1.02] active:scale-95 hover-lift touch-manipulation">
                                        <div className="relative image-hover">
                                            {property.image ? (
                                                <img
                                                    src={property.image}
                                                    alt={property.name}
                                                    className="w-full h-40 lg:h-48 object-cover transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-40 lg:h-48 bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">No image available</span>
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <Badge variant="default" className="bg-primary text-primary-foreground font-medium animate-pulse text-xs lg:text-sm">
                                                    ${property.price}
                                                </Badge>
                                            </div>
                                            {property.status && (
                                                <div className="absolute top-3 left-20">
                                                    <Badge variant={getStatusBadgeVariant(property.status)} className="text-xs">
                                                        {property.status}
                                                    </Badge>
                                                </div>
                                            )}

                                            {/* Price Alert Indicator */}
                                            {property.price_alert_active && (
                                                <div className="absolute top-3 right-3">
                                                    <Badge className="bg-yellow-500 text-white text-xs animate-pulse border-2 border-white shadow-lg">
                                                        <Bell className="w-3 h-3 mr-1" />
                                                        Price Alert
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-4 lg:p-6">
                                            <Link href={`/bookings/${property.id}`} className="block">
                                                <div className="space-y-3">
                                                    <div>
                                                        <h3 className="font-semibold text-foreground text-base lg:text-lg leading-tight mb-1 group-hover:text-yellow-600 transition-colors duration-300">
                                                            {property.name}
                                                        </h3>
                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                                            <span className="truncate">{property.location}</span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-2 lg:gap-3 text-xs lg:text-sm">
                                                        <div className="flex items-center text-muted-foreground">
                                                            <Bed className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 flex-shrink-0" />
                                                            <span className="hidden sm:inline">{property.beds} room{property.beds > 1 ? 's' : ''}</span>
                                                            <span className="sm:hidden">{property.beds}</span>
                                                        </div>
                                                        <div className="flex items-center text-muted-foreground">
                                                            <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 flex-shrink-0" />
                                                            <span className="hidden sm:inline">{property.nights} night{property.nights > 1 ? 's' : ''}</span>
                                                            <span className="sm:hidden">{property.nights}</span>
                                                        </div>
                                                        <div className="flex items-center text-muted-foreground">
                                                            <MapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 flex-shrink-0" />
                                                            <span className="hidden sm:inline">{property.guests} guest{property.guests > 1 ? 's' : ''}</span>
                                                            <span className="sm:hidden">{property.guests}</span>
                                                        </div>
                                                    </div>

                                                    {property.checkIn && (
                                                        <div className="pt-2 border-t border-border">
                                                            <div className="text-xs text-muted-foreground">
                                                                Check-in: {formatDate(property.checkIn)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        </CardContent>
                                    </Card>

                                    {/* Dropdown button positioned outside the card */}
                                    <div className="absolute top-3 right-3 z-50">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-8 w-8 lg:h-10 lg:w-10 p-0 bg-white hover:bg-gray-50 shadow-lg border border-gray-300 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        console.log('Dropdown button clicked!');
                                                    }}
                                                >
                                                    <MoreHorizontal className="h-4 w-4 lg:h-5 lg:w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-48 z-[100] animate-in slide-in-from-top-2 duration-200"
                                                sideOffset={5}
                                                forceMount
                                            >
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/bookings/${property.id}`} className="flex items-center transition-all duration-200 hover:scale-105">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/bookings/${property.id}/edit`} className="flex items-center transition-all duration-200 hover:scale-105">
                                                        <Settings className="h-4 w-4 mr-2" />
                                                        Edit Booking
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600 flex items-center transition-all duration-200 hover:scale-105"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDeleteClick(property);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Booking
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                            </div>
                        ) : (
                            <div className={`flex items-center justify-center w-full py-12 lg:py-16 transition-all duration-1000 delay-300 ${
                                isVisible.bookingsGrid
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                            }`}>
                                <div className="text-center bg-white/60 rounded-2xl border-2 border-dashed border-gray-300 p-6 lg:p-12 max-w-sm lg:max-w-md hover-lift transition-all duration-500 mx-4">
                                    <div className="mx-auto w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mb-4 lg:mb-6 animate-float">
                                        <Grid3X3 className="w-10 h-10 lg:w-12 lg:h-12 text-yellow-600" />
                                    </div>
                                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3">Your suitcase is empty!</h3>
                                    <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base px-2">Add your first trip to start tracking prices and saving money on your next adventure.</p>
                                    <Button
                                        onClick={handleAddBookingClick}
                                        className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-6 lg:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 btn-hover-effect w-full touch-manipulation"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Plan My First Trip
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Infinite Scroll Sentinel */}
                    {hasMore && (
                        <div id="scroll-sentinel" className="flex justify-center py-8">
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-gray-600">Loading more bookings...</span>
                                </div>
                            ) : (
                                <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full"></div>
                            )}
                        </div>
                    )}

                    {/* No more results message */}
                    {!hasMore && displayedBookings.length > 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">You've reached the end of your bookings</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="animate-in slide-in-from-bottom-4 duration-300 max-w-[95vw] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg lg:text-xl">Remove This Trip</DialogTitle>
                        <DialogDescription className="text-sm lg:text-base">
                            Are you sure you want to remove "{bookingToDelete?.name}" from your trips? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto h-12 text-base"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            className={`bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto h-12 text-base ${isDeleting ? 'btn-loading' : ''}`}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Removing...' : 'Remove Trip'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Booking Modal */}
            <Dialog open={showAddBooking} onOpenChange={setShowAddBooking}>
                <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl lg:text-2xl font-bold text-gray-900">Add My Next Adventure</DialogTitle>
                        <DialogDescription className="text-gray-600 text-base lg:text-lg">
                            Tell us about your hotel stay and we'll keep an eye on the prices for you.
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

            {/* Toaster for notifications */}
            <Toaster />

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
                <div className="flex items-center justify-around py-3">
                    {mobileNavigationItems.slice(0, 4).map((item) => {
                        const Icon = item.icon;
                        const isActive = item.page === 'bookings';

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

