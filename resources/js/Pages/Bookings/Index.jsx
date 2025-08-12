import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Building2,
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Pause,
    Play,
    RefreshCw,
    Calendar,
    MapPin,
    Users,
    DollarSign,
    TrendingDown
} from 'lucide-react';

export default function BookingsIndex({ auth, bookings, stats }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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
            case 'active': return 'text-green-600 bg-green-100';
            case 'paused': return 'text-yellow-600 bg-yellow-100';
            case 'completed': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            booking.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Hotel Bookings"
        >
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_bookings}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                            <Play className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.active_bookings}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Paused</CardTitle>
                            <Pause className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.paused_bookings}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatCurrency(stats.total_savings, 'USD')}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Toolbar */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div>
                                <CardTitle>Manage Bookings</CardTitle>
                                <CardDescription>
                                    Track and manage your hotel price monitoring
                                </CardDescription>
                            </div>
                            <Button onClick={() => window.location.href = '/bookings/create'}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Booking
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search hotels or locations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">No bookings found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchTerm || statusFilter !== 'all'
                                        ? 'Try adjusting your search or filters'
                                        : 'Start tracking your hotel prices by adding your first booking'
                                    }
                                </p>
                                {!searchTerm && statusFilter === 'all' && (
                                    <Button onClick={() => window.location.href = '/bookings/create'}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Your First Booking
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        filteredBookings.map((booking) => (
                            <Card key={booking.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Building2 className="h-5 w-5 text-blue-600" />
                                                        <h3 className="text-lg font-semibold text-foreground">
                                                            {booking.hotel_name}
                                                        </h3>
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                                                            {booking.status}
                                                        </span>
                                                        {booking.price_drop_detected && (
                                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
                                                                🔥 Price Drop!
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center space-x-1">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{booking.location}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Users className="h-4 w-4" />
                                                            <span>{booking.guests} guests</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Booked Price:</span>
                                                        <span className="font-medium">
                                                            {formatCurrency(booking.original_price, booking.currency)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Current Price:</span>
                                                        <span className="font-medium">
                                                            {formatCurrency(booking.current_price, booking.currency)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    {booking.price_drop_detected ? (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Potential Savings:</span>
                                                            <span className="font-medium text-red-600">
                                                                {formatCurrency(booking.price_drop_amount, booking.currency)} ({booking.price_drop_percentage}%)
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Price Change:</span>
                                                            <span className="font-medium text-gray-600">No change</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Last Checked:</span>
                                                        <span className="font-medium">
                                                            {booking.last_checked ? new Date(booking.last_checked).toLocaleDateString() : 'Never'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.location.href = `/bookings/${booking.id}`}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.location.href = `/bookings/${booking.id}/edit`}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.location.href = `/bookings/${booking.id}/check-price`}
                                            >
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Check
                                            </Button>
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
