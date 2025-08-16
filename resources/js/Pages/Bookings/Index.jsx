import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Head, Link, router } from '@inertiajs/react';
import Sidebar from '@/components/ui/sidebar';
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
    Settings
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
            <Sidebar activePage="bookings" />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Head title="Bookings" />

                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search bookings..."
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
                                                    <span className="text-gray-500 text-sm">No image available</span>
                                                </div>
                                            )}
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
                                                    className="h-10 w-10 p-0 bg-white hover:bg-gray-50 shadow-lg border border-gray-300 rounded-full"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        console.log('Dropdown button clicked!');
                                                    }}
                                                >
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-48 z-[100]"
                                                sideOffset={5}
                                                forceMount
                                            >
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/bookings/${property.id}`} className="flex items-center">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/bookings/${property.id}/edit`} className="flex items-center">
                                                        <Settings className="h-4 w-4 mr-2" />
                                                        Edit Booking
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600 flex items-center"
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
                    </div>

                    {/* Pagination - Fixed at Bottom */}
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
                                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
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
                                            className={`w-8 h-8 p-0 ${
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
                                            className="w-8 h-8 p-0 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                                        >
                                            {totalPages - 1}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(totalPages)}
                                            className="w-8 h-8 p-0 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
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
                                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
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
                            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

