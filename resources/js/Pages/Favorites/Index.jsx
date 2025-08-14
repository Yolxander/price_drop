import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Home,
    Grid3X3,
    Bell,
    Heart,
    Settings,
    LogOut,
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
    CheckCircle
} from 'lucide-react';

export default function FavoritesIndex({ auth, favorites = [], stats = {} }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [currentPage, setCurrentPage] = useState(1);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [favoriteToRemove, setFavoriteToRemove] = useState(null);
    const itemsPerPage = 8;

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

    const handleRemoveConfirm = () => {
        if (favoriteToRemove) {
            // In a real app, this would make an API call to remove from favorites
            console.log('Removing from favorites:', favoriteToRemove.id);
            setRemoveDialogOpen(false);
            setFavoriteToRemove(null);
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
                return <Clock className="w-4 w-4 text-blue-600" />;
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
                        <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                            <Heart className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-gray-900">Favorite</span>
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
                <Head title="Favorites" />

                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search favorites..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" className="flex items-center space-x-2">
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
                            </Button>
                            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="h-8 w-8 p-0"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="h-8 w-8 p-0"
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
                    <div className="flex-1 overflow-y-auto p-6">
                        {currentProperties.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                                <p className="text-gray-500 mb-6">Start adding hotels to your favorites to track them here</p>
                                <Link href="/bookings">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Browse Hotels
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2' : 'grid-cols-1'}`}>
                                {currentProperties.map((property) => (
                                    <div key={property.id} className="relative">
                                        <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]">
                                            <div className="relative">
                                                {property.image ? (
                                                    <img
                                                        src={property.image}
                                                        alt={property.name}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                        <Building2 className="h-12 w-12 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3">
                                                    <Badge variant="default" className="bg-primary text-primary-foreground font-medium">
                                                        {formatCurrency(property.currentPrice)}
                                                    </Badge>
                                                </div>
                                                {property.priceDropDetected && (
                                                    <div className="absolute top-3 left-32">
                                                        <Badge variant="default" className="bg-green-600 text-white">
                                                            <TrendingDown className="h-3 w-3 mr-1" />
                                                            Price Drop
                                                        </Badge>
                                                    </div>
                                                )}
                                                {property.status && (
                                                    <div className="absolute bottom-3 left-3">
                                                        <Badge variant={getStatusBadgeVariant(property.status)}>
                                                            {property.status}
                                                        </Badge>
                                                    </div>
                                                )}
                                                <div className="absolute top-12 left-3">
                                                    <div className="flex items-center space-x-1 bg-white bg-opacity-90 rounded-full px-2 py-1">
                                                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                        <span className="text-xs font-medium text-gray-700">{property.starRating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <CardContent className="p-6">
                                                <Link href={`/bookings/${property.id}`} className="block">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <h3 className="font-semibold text-foreground text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                                                                {property.name}
                                                            </h3>
                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                                                <span className="truncate">{property.location}</span>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-3 text-sm">
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
                                                className="h-10 w-10 p-0 bg-white hover:bg-red-50 shadow-lg border border-gray-300 rounded-full text-red-600 hover:text-red-700"
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
                        <div className="bg-white border-t border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} entries
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
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
                                                className="w-8 h-8 p-0"
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
                                                className="w-8 h-8 p-0"
                                            >
                                                {totalPages - 1}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(totalPages)}
                                                className="w-8 h-8 p-0"
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
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Remove Confirmation Dialog */}
            <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove from Favorites</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove "{favoriteToRemove?.name}" from your favorites? This action can be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRemoveDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRemoveConfirm}
                        >
                            Remove from Favorites
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
