import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link, router } from '@inertiajs/react';
import {
    Home,
    Grid3X3,
    Bell,
    Heart,
    Settings,
    LogOut,
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
    Calendar
} from 'lucide-react';

export default function BookingsIndex({ auth, bookings, stats }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);
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

    const handleDeleteClick = (booking) => {
        setBookingToDelete(booking);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (bookingToDelete) {
            router.delete(`/bookings/${bookingToDelete.id}`, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setBookingToDelete(null);
                },
            });
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
            status: booking.status
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
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Q Search..."
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

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Properties Grid */}
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
                        {currentProperties.map((property) => (
                            <Card key={property.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="relative">
                                    {property.image ? (
                                        <img
                                            src={property.image}
                                            alt={property.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 text-sm">No image available</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/bookings/${property.id}`}>
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/bookings/${property.id}/edit`}>
                                                        Edit Booking
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDeleteClick(property)}
                                                >
                                                    Delete Booking
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <Badge variant="default" className="bg-primary text-primary-foreground font-medium">
                                            ${property.price}
                                        </Badge>
                                    </div>
                                    {property.status && (
                                        <div className="absolute top-3 left-20">
                                            <Badge variant={getStatusBadgeVariant(property.status)}>
                                                {property.status}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="font-semibold text-foreground text-lg leading-tight mb-1">
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

                                        {property.checkIn && (
                                            <div className="pt-2 border-t border-border">
                                                <div className="text-xs text-muted-foreground">
                                                    Check-in: {formatDate(property.checkIn)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-8">
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
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Booking</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{bookingToDelete?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                        >
                            Delete Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

