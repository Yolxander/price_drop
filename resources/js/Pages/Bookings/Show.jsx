import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ImageGalleryModal from '@/components/ui/image-gallery-modal';
import Sidebar from '@/components/ui/sidebar';
import { toast, Toaster } from 'sonner';
import { MapPin, Star, Calendar, Users, DollarSign, TrendingDown, Clock, Globe, Phone, Mail, CheckCircle, AlertCircle, Menu, X, Home, Grid3X3, Calendar as CalendarIcon, Heart, Bell, Settings, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Show({ auth, booking }) {
    const [loading, setLoading] = useState(false);
    const [enrichmentStatus, setEnrichmentStatus] = useState(null);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [availableImages, setAvailableImages] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showPriceAlertDialog, setShowPriceAlertDialog] = useState(false);
    const [isVisible, setIsVisible] = useState({
        header: false,
        overview: false,
        facilities: false,
        details: false,
        history: false,
        sidebar: false
    });

    // Debug booking object
    useEffect(() => {
        console.log('Booking object:', booking);
        console.log('price_alert_active:', booking?.price_alert_active);
        console.log('booking.id:', booking?.id);
    }, [booking]);

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

    // Filter out unavailable images
    React.useEffect(() => {
        if (booking.enriched_data?.overview?.screenshots) {
            const images = booking.enriched_data.overview.screenshots.map((src, index) => ({
                src: src,
                alt: `${booking.hotel_name} - Image ${index + 1}`,
                originalIndex: index
            }));
            setAvailableImages(images);
        } else {
            setAvailableImages([]);
        }
    }, [booking.enriched_data?.overview?.screenshots, booking.hotel_name]);

    const triggerEnrichment = async () => {
        if (loading) return;

        setLoading(true);

        // Show loading toast
        const loadingToast = toast.loading('Getting more details about your trip...', {
            duration: Infinity,
            position: 'top-right',
            style: {
                background: '#fbbf24',
                color: '#1f2937',
                border: '1px solid #f59e0b',
            },
        });

        try {
            // Simulate background processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await fetch(`/bookings/${booking.id}/enrich`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            const data = await response.json();
            setEnrichmentStatus(data);

            if (data.success) {
                // Dismiss loading toast
                toast.dismiss(loadingToast);

                // Show success toast
                toast.success('Data enriched successfully!', {
                    position: 'top-right',
                    duration: 4000,
                    style: {
                        background: '#10b981',
                        color: 'white',
                        border: '1px solid #059669',
                    },
                    icon: <CheckCircle className="h-4 w-4" />,
                });

                // Reload the page to show updated data
                window.location.reload();
            } else {
                // Dismiss loading toast
                toast.dismiss(loadingToast);

                // Show error toast
                toast.error('Enrichment failed. Please try again.', {
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
        } catch (error) {
            console.error('Enrichment failed:', error);

            // Dismiss loading toast
            toast.dismiss(loadingToast);

            // Show error toast
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

            setEnrichmentStatus({ success: false, message: 'Enrichment failed' });
        } finally {
            setLoading(false);
        }
    };

    const openGallery = (index) => {
        // Find the corresponding index in available images
        const availableIndex = availableImages.findIndex(img => img.originalIndex === index);
        if (availableIndex !== -1) {
            setSelectedImageIndex(availableIndex);
            setGalleryOpen(true);
        }
    };

    const closeGallery = () => {
        setGalleryOpen(false);
    };

    const handleImageError = (originalIndex) => {
        setAvailableImages(prev => prev.filter(img => img.originalIndex !== originalIndex));
    };

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleSetPriceAlert = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await fetch(`/price-alerts/${booking.id}/set-alert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Price alert activated! You\'ll be notified of any price drops.', {
                    position: 'top-right',
                    duration: 4000,
                    style: {
                        background: '#10b981',
                        color: 'white',
                        border: '1px solid #059669',
                    },
                    icon: <CheckCircle className="h-4 w-4" />,
                });

                // Reload the page to show updated status
                window.location.reload();
            } else {
                toast.error(data.message || 'Failed to set price alert. Please try again.', {
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
        } catch (error) {
            console.error('Error setting price alert:', error);
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
            setLoading(false);
            setShowPriceAlertDialog(false);
        }
    };

    const handleRemovePriceAlert = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await fetch(`/price-alerts/${booking.id}/remove-alert`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Price alert removed from this booking.', {
                    position: 'top-right',
                    duration: 4000,
                    style: {
                        background: '#10b981',
                        color: 'white',
                        border: '1px solid #059669',
                    },
                    icon: <CheckCircle className="h-4 w-4" />,
                });

                // Reload the page to show updated status
                window.location.reload();
            } else {
                toast.error(data.message || 'Failed to remove price alert. Please try again.', {
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
        } catch (error) {
            console.error('Error removing price alert:', error);
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
            setLoading(false);
        }
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
                <Sidebar activePage="bookings" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Head title={`Booking - ${booking.hotel_name}`} />

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
                            <span className="text-xl font-bold text-yellow-600">Booking Details</span>
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
                        <div className={`transition-all duration-1000 delay-200 ${
                            isVisible.header
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-8'
                        }`}>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{booking.hotel_name}</h1>
                            <p className="text-gray-600 mt-1">{booking.location}</p>
                        </div>
                        <div className={`flex flex-col sm:flex-row items-center gap-3 lg:gap-4 transition-all duration-1000 delay-400 ${
                            isVisible.header
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-8'
                        }`}>
                            <Link href="/bookings">
                                <Button variant="outline" className="transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation w-full sm:w-auto h-10">
                                    Back to Bookings
                                </Button>
                            </Link>
                            {!booking.enrichment_successful && (
                                <Button
                                    onClick={triggerEnrichment}
                                    disabled={loading}
                                    variant="default"
                                    className={`transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation w-full sm:w-auto h-10 ${loading ? 'btn-loading' : ''}`}
                                >
                                    {loading ? 'Enriching...' : 'Enrich Data'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6">
                    {/* Enrichment Status */}
                    {enrichmentStatus && (
                        <Card className={`mb-6 transition-all duration-500 hover:scale-[1.02] active:scale-95 touch-manipulation ${enrichmentStatus.success ? 'border-green-200' : 'border-red-200'}`}>
                            <CardContent className="p-4">
                                <div className={`flex items-center gap-2 ${enrichmentStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                                    <Badge variant={enrichmentStatus.success ? "default" : "destructive"}>
                                        {enrichmentStatus.success ? 'Success' : 'Error'}
                                    </Badge>
                                    <span>{enrichmentStatus.message}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 p-1 bg-gray-100 rounded-xl">
                                    <TabsTrigger value="overview" className="flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border-2 data-[state=active]:border-yellow-200">
                                        <div className="w-6 h-6 rounded-lg bg-yellow-100 flex items-center justify-center">
                                            <Star className="h-4 w-4 text-yellow-600" />
                                        </div>
                                        <span className="text-xs font-medium hidden sm:block">Overview</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="facilities" className="flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border-2 data-[state=active]:border-yellow-200">
                                        <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        </div>
                                        <span className="text-xs font-medium hidden sm:block">Facilities</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="details" className="flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border-2 data-[state=active]:border-yellow-200">
                                        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <Calendar className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <span className="text-xs font-medium hidden sm:block">Details</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="history" className="flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border-2 data-[state=active]:border-yellow-200">
                                        <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <TrendingDown className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <span className="text-xs font-medium hidden sm:block">History</span>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-4 lg:mt-6">
                                    <Card
                                        data-section="overview"
                                        className={`transition-all duration-1000 ease-out hover:shadow-lg active:scale-95 touch-manipulation ${
                                            isVisible.overview
                                                ? 'opacity-100 translate-y-0'
                                                : 'opacity-0 translate-y-8'
                                        }`}
                                    >
                                        <CardHeader>
                                            <CardTitle>Hotel Overview</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 lg:space-y-6">
                                            {booking.enriched_data?.overview ? (
                                                <>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Star className="h-5 w-5 text-yellow-500 fill-current animate-pulse" />
                                                            <span className="font-semibold">
                                                                {booking.enriched_data.overview.star_rating} / 5.0
                                                            </span>
                                                        </div>
                                                        <Badge variant="outline" className="transition-all duration-300 hover:scale-105 active:scale-95 w-fit">
                                                            {booking.enriched_data.overview.canonical_name}
                                                        </Badge>
                                                    </div>

                                                    {/* Hotel Images */}
                                                    {availableImages.length > 0 ? (
                                                        <div>
                                                            <h3 className="font-semibold mb-3">Hotel Images</h3>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                                                                {availableImages.map((image, index) => (
                                                                    <div
                                                                        key={image.originalIndex}
                                                                        className="aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation image-hover"
                                                                        onClick={() => openGallery(image.originalIndex)}
                                                                    >
                                                                        <img
                                                                            src={image.src}
                                                                            alt={image.alt}
                                                                            className="w-full h-full object-cover transition-transform duration-500"
                                                                            onError={() => handleImageError(image.originalIndex)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <h3 className="font-semibold mb-3">Hotel Images</h3>
                                                            <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                                                                <div className="text-center">
                                                                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                        <span className="text-gray-500 text-xl">📷</span>
                                                                    </div>
                                                                    <p className="text-gray-500 text-sm">No images available</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="space-y-3">
                                                        <div className="flex items-start gap-3">
                                                            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium">{booking.enriched_data.overview.address}</p>
                                                                <p className="text-sm text-gray-600">{booking.enriched_data.overview.location}</p>
                                                            </div>
                                                        </div>

                                                        {booking.enriched_data.overview.hotel_website && (
                                                            <div className="flex items-center gap-3">
                                                                <Globe className="h-5 w-5 text-gray-500" />
                                                                <a
                                                                    href={booking.enriched_data.overview.hotel_website}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-yellow-600 hover:underline transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
                                                                >
                                                                    Visit Hotel Website
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500">No enriched data available</p>
                                                    <Button
                                                        onClick={triggerEnrichment}
                                                        disabled={loading}
                                                        className={`mt-4 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation w-full sm:w-auto h-10 ${loading ? 'btn-loading' : ''}`}
                                                    >
                                                        {loading ? 'Enriching...' : 'Enrich Data'}
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="facilities" className="mt-4 lg:mt-6">
                                    <Card className="transition-all duration-1000 ease-out hover:shadow-lg active:scale-95 touch-manipulation opacity-100 translate-y-0">
                                        <CardHeader>
                                            <CardTitle>Facilities & Amenities</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {booking.enriched_data?.facilities ? (
                                                <div className="space-y-4 lg:space-y-6">
                                                    <div>
                                                        <h3 className="font-semibold mb-3">Amenities</h3>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {booking.enriched_data.facilities.amenities?.map((amenity, index) => (
                                                                <div key={index} className="flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95">
                                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                    <span className="text-sm">{amenity}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    <div>
                                                        <h3 className="font-semibold mb-3">Facilities</h3>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {booking.enriched_data.facilities.facilities?.map((facility, index) => (
                                                                <div key={index} className="flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95">
                                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                                    <span className="text-sm">{facility}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={booking.enriched_data.facilities.breakfast_included ? "default" : "secondary"} className="transition-all duration-300 hover:scale-105 active:scale-95">
                                                            {booking.enriched_data.facilities.breakfast_included ? 'Breakfast Included' : 'Breakfast Not Included'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500">No facilities data available</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="details" className="mt-4 lg:mt-6">
                                    <Card className="transition-all duration-1000 ease-out hover:shadow-lg active:scale-95 touch-manipulation opacity-100 translate-y-0">
                                        <CardHeader>
                                            <CardTitle>Booking Details</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4 lg:space-y-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                                    <div>
                                                        <h3 className="font-semibold mb-3">Room Information</h3>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <span className="text-sm text-gray-600">Room Type:</span>
                                                                <p className="font-medium">
                                                                    {booking.enriched_data?.details?.room_type || 'Standard Room'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-600">Room Code:</span>
                                                                <p className="font-medium">
                                                                    {booking.enriched_data?.details?.room_code || 'N/A'}
                                                                </p>
                                                            </div>
                                                            {booking.enriched_data?.details?.room_description && (
                                                                <div>
                                                                    <span className="text-sm text-gray-600">Description:</span>
                                                                    <p className="text-sm">{booking.enriched_data.details.room_description}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="font-semibold mb-3">Pricing Details</h3>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <span className="text-sm text-gray-600">Base Rate:</span>
                                                                <p className="font-medium">
                                                                    {booking.enriched_data?.details?.base_rate
                                                                        ? formatCurrency(booking.enriched_data.details.base_rate, booking.currency)
                                                                        : formatCurrency(booking.original_price, booking.currency)
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-600">Taxes & Fees:</span>
                                                                <p className="font-medium">
                                                                    {booking.enriched_data?.details?.taxes_fees
                                                                        ? formatCurrency(booking.enriched_data.details.taxes_fees, booking.currency)
                                                                        : 'N/A'
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-600">Total Price:</span>
                                                                <p className="font-medium">
                                                                    {formatCurrency(booking.original_price, booking.currency)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div>
                                                    <h3 className="font-semibold mb-3">Cancellation Policy</h3>
                                                    <p className="text-sm">
                                                        {booking.enriched_data?.details?.cancellation_policy || 'Standard cancellation policy applies'}
                                                    </p>
                                                </div>

                                                {booking.enriched_data?.details?.booking_link && (
                                                    <>
                                                        <Separator />
                                                        <div>
                                                            <h3 className="font-semibold mb-3">Booking Links</h3>
                                                            <a
                                                                href={booking.enriched_data.details.booking_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-yellow-600 hover:underline transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
                                                            >
                                                                View Booking Details
                                                            </a>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="history" className="mt-4 lg:mt-6">
                                    <Card className="transition-all duration-1000 ease-out hover:shadow-lg active:scale-95 touch-manipulation opacity-100 translate-y-0">
                                        <CardHeader>
                                            <CardTitle>Price History & Tracking</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4 lg:space-y-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                                    <div>
                                                        <h3 className="font-semibold mb-3">Price Information</h3>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <span className="text-sm text-gray-600">Original Price:</span>
                                                                <p className="font-medium">
                                                                    {formatCurrency(booking.original_price, booking.currency)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-600">Current Price:</span>
                                                                <p className="font-medium">
                                                                    {formatCurrency(booking.current_price, booking.currency)}
                                                                </p>
                                                            </div>
                                                            {booking.price_drop_detected && (
                                                                <div>
                                                                    <span className="text-sm text-gray-600">Price Pulse:</span>
                                                                    <p className="font-medium text-green-600 animate-pulse">
                                                                        -{formatCurrency(booking.price_drop_amount, booking.currency)} ({booking.price_drop_percentage}%)
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="font-semibold mb-3">Tracking Status</h3>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <span className="text-sm text-gray-600">Status:</span>
                                                                <Badge variant={booking.status === 'active' ? 'default' : 'secondary'} className="transition-all duration-300 hover:scale-105 active:scale-95">
                                                                    {booking.status}
                                                                </Badge>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-600">Last Checked:</span>
                                                                <p className="font-medium">
                                                                    {booking.last_checked ? formatDate(booking.last_checked) : 'Never'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-600">Enrichment:</span>
                                                                <Badge variant={booking.enrichment_successful ? 'default' : 'destructive'} className="transition-all duration-300 hover:scale-105 active:scale-95">
                                                                    {booking.enrichment_successful ? 'Successful' : 'Failed'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div>
                                                    <h3 className="font-semibold mb-3">Stay Details</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                        <div className="flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95">
                                                            <Calendar className="h-4 w-4 text-gray-500" />
                                                            <div>
                                                                <p className="text-sm text-gray-600">Check-in</p>
                                                                <p className="font-medium">{formatDate(booking.check_in_date)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95">
                                                            <Calendar className="h-4 w-4 text-gray-500" />
                                                            <div>
                                                                <p className="text-sm text-gray-600">Check-out</p>
                                                                <p className="font-medium">{formatDate(booking.check_out_date)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95">
                                                            <Users className="h-4 w-4 text-gray-500" />
                                                            <div>
                                                                <p className="text-sm text-gray-600">Guests</p>
                                                                <p className="font-medium">{booking.guests}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar */}
                        <div
                            className="space-y-4 lg:space-y-6"
                            data-section="sidebar"
                        >
                            {/* Price Summary */}
                            <Card className={`transition-all duration-1000 ease-out hover:shadow-lg active:scale-95 touch-manipulation ${
                                isVisible.sidebar
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                            }`}>
                                <CardHeader>
                                    <CardTitle>Price Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Original Price:</span>
                                            <span className="font-medium">{formatCurrency(booking.original_price, booking.currency)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Current Price:</span>
                                            <span className="font-medium">{formatCurrency(booking.current_price, booking.currency)}</span>
                                        </div>
                                        {booking.price_drop_detected && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Savings:</span>
                                                <span className="font-medium animate-pulse">
                                                    -{formatCurrency(booking.price_drop_amount, booking.currency)}
                                                </span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between">
                                            <span>Per Night:</span>
                                            <span className="font-medium">{formatCurrency(booking.price_per_night, booking.currency)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Nights:</span>
                                            <span className="font-medium">{booking.nights}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className={`transition-all duration-1000 delay-200 ease-out hover:shadow-lg active:scale-95 touch-manipulation ${
                                isVisible.sidebar
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                            }`}>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation h-10" variant="outline">
                                        Check Current Price
                                    </Button>
                                    <Button className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation h-10" variant="outline">
                                        View Price History
                                    </Button>
                                    <Button className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation h-10" variant="outline">
                                        Edit Booking
                                    </Button>
                                    {booking.price_alert_active ? (
                                        <Button
                                            onClick={handleRemovePriceAlert}
                                            disabled={loading}
                                            className="w-full bg-red-100 hover:bg-red-200 text-red-700 border-red-300 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation h-10"
                                            variant="outline"
                                        >
                                            {loading ? 'Removing...' : 'Remove Price Alert'}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                setShowPriceAlertDialog(true);
                                            }}
                                            disabled={loading}
                                            className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-300 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation h-10"
                                            variant="outline"
                                        >
                                            Set Price Alert
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Price Alert Status */}
                            {booking.price_alert_active && (
                                <Card className={`transition-all duration-1000 delay-300 ease-out hover:shadow-lg active:scale-95 touch-manipulation ${
                                    isVisible.sidebar
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-8'
                                }`}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Bell className="h-5 w-5 text-yellow-600" />
                                            Price Alert Active
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-green-600">
                                                <CheckCircle className="h-4 w-4" />
                                                <span>Monitoring this booking for price drops</span>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                You'll be notified when prices drop below your alert thresholds.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-40">
                    <div className="flex items-center justify-around">
                        {mobileNavigationItems.slice(0, 5).map((item) => {
                            const Icon = item.icon;
                            const isActive = item.page === 'bookings';

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

            {/* Image Gallery Modal */}
            <ImageGalleryModal
                isOpen={galleryOpen}
                onClose={closeGallery}
                images={availableImages}
                initialIndex={selectedImageIndex}
            />

            {/* Price Alert Confirmation Dialog */}
            <Dialog
                open={showPriceAlertDialog}
                onOpenChange={setShowPriceAlertDialog}
            >
                <DialogContent className="sm:max-w-[425px] animate-in slide-in-from-bottom-4 duration-300 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Bell className="h-6 w-6 text-yellow-600" />
                            Activate Price Alert
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 text-base">
                            You're about to start monitoring this booking for price drops. You'll receive notifications when prices drop below your alert thresholds.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Bell className="h-4 w-4 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-yellow-800 mb-2">What happens next?</h4>
                                    <ul className="text-sm text-yellow-700 space-y-1">
                                        <li>• We'll check prices every 2 hours</li>
                                        <li>• You'll get notified of any price drops</li>
                                        <li>• Monitoring continues until you remove the alert</li>
                                        <li>• You can manage alerts from the Price Alerts page</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowPriceAlertDialog(false)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto h-12 text-base"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSetPriceAlert}
                            disabled={loading}
                            className={`bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto h-12 text-base ${loading ? 'btn-loading' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Activating...
                                </>
                            ) : (
                                <>
                                    <Bell className="w-4 h-4 mr-2" />
                                    Activate Price Alert
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Toaster for notifications */}
            <Toaster />
        </div>
    );
}
