import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast, Toaster } from 'sonner';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Sidebar from '@/components/ui/sidebar';
import {
    Search,
    Filter,
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
    Star,
    TrendingDown,
    Plus,
    Bookmark,
    BookmarkCheck,
    Building2,
    DollarSign,
    Clock,
    AlertCircle,
    CheckCircle,
    Heart,
    Menu,
    X,
    Home,
    Grid3X3,
    Calendar as CalendarIcon,
    Bell,
    Settings,
    LogOut
} from 'lucide-react';

export default function FavoritesIndex({ auth, favorites = [], stats = {} }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [currentPage, setCurrentPage] = useState(1);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [favoriteToRemove, setFavoriteToRemove] = useState(null);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState({
        header: false,
        searchBar: false,
        favoritesGrid: false,
        pagination: false
    });
    const itemsPerPage = 8;

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

    const handleRemoveClick = (favorite) => {
        setFavoriteToRemove(favorite);
        setRemoveDialogOpen(true);
    };

    const handleRemoveConfirm = async () => {
        if (favoriteToRemove) {
            setIsRemoving(true);
            setRemoveDialogOpen(false);

            // Show loading toast
            const loadingToast = toast.loading('Removing from favorites...', {
                duration: Infinity,
            });

            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // In a real app, this would make an API call to remove from favorites
                console.log('Removing from favorites:', favoriteToRemove.id);

                // Close loading toast and show success
                toast.dismiss(loadingToast);
                toast.success('Removed from favorites successfully!', {
                    icon: <CheckCircle className="h-4 w-4" />,
                });

                setFavoriteToRemove(null);
            } catch (error) {
                // Close loading toast and show error
                toast.dismiss(loadingToast);
                toast.error('Failed to remove from favorites. Please try again.', {
                    icon: <AlertCircle className="h-4 w-4" />,
                });
            } finally {
                setIsRemoving(false);
            }
        }
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'pending':
                return <Clock className="w-4 w-4 text-yellow-600" />;
            case 'cancelled':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    // Convert favorites data to properties format for display
    const properties = Array.isArray(favorites) ? favorites.map(favorite => {
        // Get the first screenshot from enriched data, or use placeholder
        const screenshots = favorite.enriched_data?.overview?.screenshots || [];
        const image = screenshots.length > 0 ? screenshots[0] : null;

        return {
            id: favorite.id,
            name: favorite.hotel_name,
            location: favorite.location,
            price: favorite.total_price,
            image: image,
            beds: favorite.rooms || 1,
            baths: 2, // Default value since we don't have this in booking data
            sqft: 1500, // Default value since we don't have this in booking data
            checkIn: favorite.check_in_date,
            checkOut: favorite.check_out_date,
            guests: favorite.guests,
            nights: favorite.nights,
            status: favorite.status,
            starRating: favorite.enriched_data?.overview?.star_rating || 4,
            priceDropDetected: favorite.price_drop_detected || false,
            originalPrice: favorite.original_price,
            currentPrice: favorite.total_price
        };
    }) : [];

    const filteredProperties = properties.filter(property =>
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProperties = filteredProperties.slice(startIndex, endIndex);

    const calculateSavings = (originalPrice, currentPrice) => {
        if (originalPrice > currentPrice) {
            return originalPrice - currentPrice;
        }
        return 0;
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
                        setIsMobileMenuOpen(false);
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
                                const isActive = item.page === 'favorites';

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
                <Sidebar activePage="favorites" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Head title="Favorites" />

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
                            <span className="text-xl font-bold text-yellow-600">Favorites</span>
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
                        <div className="w-full lg:max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search favorites..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 form-input-focus transition-all duration-300 w-full h-12 text-base"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 h-10 w-full sm:w-auto"
                            >
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
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

                {/* Content Area with Flex Layout */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Properties Grid - Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">
                        {currentProperties.length === 0 ? (
                            <div
                                data-section="favoritesGrid"
                                className={`text-center py-12 transition-all duration-1000 ease-out ${
                                    isVisible.favoritesGrid
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-8'
                                }`}
                            >
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                                    <Heart className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                                <p className="text-gray-500 mb-6">Start adding hotels to your favorites to track them here</p>
                                <Link href="/bookings">
                                    <Button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 touch-manipulation w-full sm:w-auto h-12 text-base">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Browse Hotels
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div
                                data-section="favoritesGrid"
                                className={`grid gap-4 lg:gap-6 transition-all duration-1000 ease-out ${
                                    isVisible.favoritesGrid
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-8'
                                } ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2' : 'grid-cols-1'}`}
                            >
                                {currentProperties.map((property, index) => (
                                    <div
                                        key={property.id}
                                        className="relative transition-all duration-500 ease-out hover-lift active:scale-95 touch-manipulation"
                                        style={{ transitionDelay: `${index * 100}ms` }}
                                    >
                                        <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]">
                                            <div className="relative">
                                                {property.image ? (
                                                    <img
                                                        src={property.image}
                                                        alt={property.name}
                                                        className="w-full h-48 object-cover image-hover transition-all duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                        <Building2 className="h-12 w-12 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3">
                                                    <Badge variant="default" className="bg-primary text-primary-foreground font-medium animate-pulse-glow transition-all duration-300 hover:scale-105 active:scale-95">
                                                        {formatCurrency(property.currentPrice)}
                                                    </Badge>
                                                </div>
                                                {property.priceDropDetected && (
                                                    <div className="absolute top-3 left-32">
                                                        <Badge variant="default" className="bg-green-600 text-white animate-pulse transition-all duration-300 hover:scale-105 active:scale-95">
                                                            <TrendingDown className="h-3 w-3 mr-1" />
                                                            Price Pulse
                                                        </Badge>
                                                    </div>
                                                )}
                                                {property.status && (
                                                    <div className="absolute bottom-3 left-3">
                                                        <Badge variant={getStatusBadgeVariant(property.status)} className="transition-all duration-300 hover:scale-105 active:scale-95">
                                                            {property.status}
                                                        </Badge>
                                                    </div>
                                                )}
                                                <div className="absolute top-12 left-3">
                                                    <div className="flex items-center space-x-1 bg-white bg-opacity-90 rounded-full px-2 py-1 animate-pulse">
                                                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                        <span className="text-xs font-medium text-gray-700">{property.starRating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <CardContent className="p-4 lg:p-6">
                                                <Link href={`/bookings/${property.id}`} className="block">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <h3 className="font-semibold text-foreground text-lg leading-tight mb-1 group-hover:text-yellow-600 transition-colors">
                                                                {property.name}
                                                            </h3>
                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                                                <span className="truncate">{property.location}</span>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                                            <div className="flex items-center text-muted-foreground">
                                                                <Bed className="h-4 w-4 mr-2 flex-shrink-0" />
                                                                <span>{property.beds} room{property.beds > 1 ? 's' : ''}</span>
                                                            </div>
                                                            <div className="flex items-center text-muted-foreground">
                                                                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                                                                <span>{property.nights} night{property.nights > 1 ? 's' : ''}</span>
                                                            </div>
                                                            <div className="flex items-center text-muted-foreground">
                                                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                                                <span>{property.guests} guest{property.guests > 1 ? 's' : ''}</span>
                                                            </div>
                                                        </div>

                                                        {property.priceDropDetected && (
                                                            <div className="pt-2 border-t border-border">
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span className="text-muted-foreground line-through">
                                                                        {formatCurrency(property.originalPrice)}
                                                                    </span>
                                                                    <span className="text-green-600 font-medium">
                                                                        Save {formatCurrency(calculateSavings(property.originalPrice, property.currentPrice))}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

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

                                        {/* Unfavorite button positioned outside the card */}
                                        <div className="absolute top-3 right-3 z-50">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="h-10 w-10 p-0 bg-white hover:bg-red-50 shadow-lg border border-gray-300 rounded-full text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 touch-manipulation"
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleRemoveClick(property);
                                                }}
                                            >
                                                <Heart className="h-5 w-5 fill-current" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination - Fixed at Bottom */}
                    {currentProperties.length > 0 && (
                        <div
                            data-section="pagination"
                            className={`bg-white border-t border-gray-200 p-4 lg:p-6 transition-all duration-1000 ease-out ${
                                isVisible.pagination
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                <div className="text-sm text-gray-600 text-center sm:text-left">
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} entries
                                </div>
                                <div className="flex items-center justify-center sm:justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 touch-manipulation"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Prev
                                    </Button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-8 h-8 p-0 transition-all duration-300 hover:scale-105 active:scale-95 ${
                                                    currentPage === pageNum
                                                        ? 'bg-yellow-300 hover:bg-yellow-400 text-gray-900'
                                                        : 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                    {totalPages > 5 && (
                                        <>
                                            <span className="text-gray-500">...</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(totalPages - 1)}
                                                className="w-8 h-8 p-0 border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 active:scale-95"
                                            >
                                                {totalPages - 1}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(totalPages)}
                                                className="w-8 h-8 p-0 border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 active:scale-95"
                                            >
                                                {totalPages}
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 touch-manipulation"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-40">
                    <div className="flex items-center justify-around">
                        {mobileNavigationItems.filter(item => item.page !== 'favorites').slice(0, 5).map((item) => {
                            const Icon = item.icon;
                            const isActive = item.page === 'favorites';

                            return (
                                <Link key={item.href} href={item.href} className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 active:scale-95">
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
                                    <span className={`text-xs ${
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

            {/* Remove Confirmation Dialog */}
            <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
                <DialogContent className="max-w-[95vw] max-h-[90vh] lg:max-w-md animate-in slide-in-from-bottom-4">
                    <DialogHeader>
                        <DialogTitle>Remove from Favorites</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove "{favoriteToRemove?.name}" from your favorites? This action can be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setRemoveDialogOpen(false)}
                            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation w-full sm:w-auto h-12 text-base"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRemoveConfirm}
                            disabled={isRemoving}
                            className={`bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation w-full sm:w-auto h-12 text-base ${isRemoving ? 'btn-loading' : ''}`}
                        >
                            {isRemoving ? 'Removing...' : 'Remove from Favorites'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
}
