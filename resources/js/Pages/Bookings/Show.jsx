import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ImageGalleryModal from '@/components/ui/image-gallery-modal';
import { MapPin, Star, Calendar, Users, DollarSign, TrendingDown, Clock, Globe, Phone, Mail, Home, Grid3X3, Bell, Heart, Settings, LogOut } from 'lucide-react';

export default function Show({ auth, booking }) {
    const [loading, setLoading] = useState(false);
    const [enrichmentStatus, setEnrichmentStatus] = useState(null);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [availableImages, setAvailableImages] = useState([]);

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
        setLoading(true);
        try {
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
                // Reload the page to show updated data
                window.location.reload();
            }
        } catch (error) {
            console.error('Enrichment failed:', error);
            setEnrichmentStatus({ success: false, message: 'Enrichment failed' });
        }
        setLoading(false);
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
                        <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                            <Grid3X3 className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-gray-900">All Bookings</span>
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
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{booking.hotel_name}</h1>
                            <p className="text-gray-600 mt-1">{booking.location}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/bookings">
                                <Button variant="outline">Back to Bookings</Button>
                            </Link>
                            {!booking.enrichment_successful && (
                                <Button
                                    onClick={triggerEnrichment}
                                    disabled={loading}
                                    variant="default"
                                >
                                    {loading ? 'Enriching...' : 'Enrich Data'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <Head title={`Booking - ${booking.hotel_name}`} />

                    {/* Enrichment Status */}
                    {enrichmentStatus && (
                        <Card className={`mb-6 ${enrichmentStatus.success ? 'border-green-200' : 'border-red-200'}`}>
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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="facilities">Facilities</TabsTrigger>
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="history">History</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Hotel Overview</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {booking.enriched_data?.overview ? (
                                                <>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                                            <span className="font-semibold">
                                                                {booking.enriched_data.overview.star_rating} / 5.0
                                                            </span>
                                                        </div>
                                                        <Badge variant="outline">
                                                            {booking.enriched_data.overview.canonical_name}
                                                        </Badge>
                                                    </div>

                                                    {/* Hotel Images */}
                                                    {availableImages.length > 0 ? (
                                                        <div>
                                                            <h3 className="font-semibold mb-3">Hotel Images</h3>
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                                {availableImages.map((image, index) => (
                                                                    <div
                                                                        key={image.originalIndex}
                                                                        className="aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                                                                        onClick={() => openGallery(index)}
                                                                    >
                                                                        <img
                                                                            src={image.src}
                                                                            alt={image.alt}
                                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
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
                                                                    className="text-blue-600 hover:underline"
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
                                                        className="mt-4"
                                                    >
                                                        {loading ? 'Enriching...' : 'Enrich Data'}
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="facilities" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Facilities & Amenities</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {booking.enriched_data?.facilities ? (
                                                <div className="space-y-6">
                                                    <div>
                                                        <h3 className="font-semibold mb-3">Amenities</h3>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {booking.enriched_data.facilities.amenities?.map((amenity, index) => (
                                                                <div key={index} className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                    <span className="text-sm">{amenity}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    <div>
                                                        <h3 className="font-semibold mb-3">Facilities</h3>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {booking.enriched_data.facilities.facilities?.map((facility, index) => (
                                                                <div key={index} className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                    <span className="text-sm">{facility}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={booking.enriched_data.facilities.breakfast_included ? "default" : "secondary"}>
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

                                <TabsContent value="details" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Booking Details</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-6">
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
                                                                className="text-blue-600 hover:underline"
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

                                <TabsContent value="history" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Price History & Tracking</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-6">
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
                                                                    <span className="text-sm text-gray-600">Price Drop:</span>
                                                                    <p className="font-medium text-green-600">
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
                                                                <Badge variant={booking.status === 'active' ? 'default' : 'secondary'}>
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
                                                                <Badge variant={booking.enrichment_successful ? 'default' : 'destructive'}>
                                                                    {booking.enrichment_successful ? 'Successful' : 'Failed'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div>
                                                    <h3 className="font-semibold mb-3">Stay Details</h3>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-gray-500" />
                                                            <div>
                                                                <p className="text-sm text-gray-600">Check-in</p>
                                                                <p className="font-medium">{formatDate(booking.check_in_date)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-gray-500" />
                                                            <div>
                                                                <p className="text-sm text-gray-600">Check-out</p>
                                                                <p className="font-medium">{formatDate(booking.check_out_date)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
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
                        <div className="space-y-6">
                            {/* Price Summary */}
                            <Card>
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
                                                <span className="font-medium">
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
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full" variant="outline">
                                        Check Current Price
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        View Price History
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        Edit Booking
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        Set Price Alert
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
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
        </div>
    );
}
