import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Building2,
    Plus,
    Eye,
    Edit,
    Pause,
    Play,
    RefreshCw,
    Calendar,
    MapPin,
    Users,
    DollarSign,
    TrendingDown,
    MoreHorizontal,
    Filter
} from 'lucide-react';

export default function BookingsIndex({ auth, bookings, stats }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-600 bg-green-50';
            case 'paused': return 'text-yellow-600 bg-yellow-50';
            case 'completed': return 'text-gray-600 bg-gray-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
        const matchesPrice = priceFilter === 'all' ||
            (priceFilter === 'low' && booking.total_price < 500) ||
            (priceFilter === 'medium' && booking.total_price >= 500 && booking.total_price < 1000) ||
            (priceFilter === 'high' && booking.total_price >= 1000);
        return matchesStatus && matchesPrice;
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Your hotel bookings."
        >
            <div className="space-y-6 pt-4 bg-gray-50 min-h-screen">
                {/* Filters */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Total Trips</CardTitle>
                            <Filter className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm text-gray-700 bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="completed">Completed</option>
                            </select>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Active</CardTitle>
                            <Filter className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <select
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm text-gray-700 bg-white"
                            >
                                <option value="all">All Prices</option>
                                <option value="low">Under $500</option>
                                <option value="medium">$500 - $1000</option>
                                <option value="high">Over $1000</option>
                            </select>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Total Spent</CardTitle>
                            <Filter className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatCurrency(stats.total_spent || 0, 'USD')}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Potential Savings</CardTitle>
                            <Filter className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(Math.abs(stats.potential_savings || 0), 'USD')}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bookings List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBookings.length === 0 ? (
                        <Card className="bg-white border-gray-200 shadow-sm col-span-full">
                            <CardContent className="text-center py-12">
                                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                                <p className="text-gray-600 mb-4">
                                    {statusFilter !== 'all' || priceFilter !== 'all'
                                        ? 'Try adjusting your filters'
                                        : 'You haven\'t added any bookings yet. Paste your booking details or just forward your hotel confirmation email — we\'ll do the rest.'
                                    }
                                </p>
                                {statusFilter === 'all' && priceFilter === 'all' && (
                                    <Button
                                        onClick={() => window.location.href = '/bookings/create'}
                                        className="bg-green-500 hover:bg-green-600 text-white border-0"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Track Your First Trip
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        filteredBookings.map((booking) => (
                            <Card
                                key={booking.id}
                                className="hover:shadow-md transition-all duration-200 cursor-pointer bg-white border-gray-200 shadow-sm relative"
                                onClick={() => window.location.href = `/bookings/${booking.id}`}
                            >
                                <CardContent className="p-4">
                                    {/* Dropdown Menu - Top Right */}
                                    <div className="absolute top-2 right-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-gray-100"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-lg">
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = `/bookings/${booking.id}`;
                                                }} className="text-gray-700 hover:bg-gray-50">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = `/bookings/${booking.id}/edit`;
                                                }} className="text-gray-700 hover:bg-gray-50">
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Trip
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = `/bookings/${booking.id}/check-price`;
                                                }} className="text-gray-700 hover:bg-gray-50">
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Check Prices
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Booking Content */}
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 line-clamp-1">
                                                    {booking.hotel_name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {booking.location}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                            <div className="text-xs text-gray-500">
                                                {formatDate(booking.check_in_date)}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Total Price:</span>
                                                <span className="font-medium text-gray-900">
                                                    {formatCurrency(booking.total_price, booking.currency)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Per Night:</span>
                                                <span className="font-medium text-gray-900">
                                                    {formatCurrency(booking.price_per_night, booking.currency)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Guests: {booking.guests}</span>
                                            <span>{booking.nights} nights</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
