import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Building2,
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    DollarSign,
    TrendingDown,
    RefreshCw,
    Edit,
    MoreHorizontal
} from 'lucide-react';

export default function BookingsShow({ auth, booking }) {
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={`Booked for ${formatCurrency(booking.original_price, booking.currency)} — Best Price Now ${formatCurrency(booking.current_price, booking.currency)} (Save ${formatCurrency(booking.price_drop_amount, booking.currency)})`}
        >
            <div className="space-y-6 pt-4 bg-gray-50 min-h-screen">
                {/* Back Button */}
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Bookings
                    </Button>
                </div>

                {/* Booking Header */}
                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center space-x-2 text-gray-900">
                                    <Building2 className="h-6 w-6 text-green-500" />
                                    <span>{booking.hotel_name}</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    {booking.location} • {booking.booking_reference}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-gray-100"
                                        >
                                            <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-lg">
                                        <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Trip
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Check Prices Now
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Booking Details */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Hotel Information */}
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Hotel Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4 text-green-500" />
                                <span className="font-medium text-gray-900">{booking.hotel_name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">{booking.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">
                                    {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">{booking.guests} guests</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing Information */}
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Pricing Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Original Price:</span>
                                <span className="font-medium text-gray-900 line-through">
                                    {formatCurrency(booking.original_price, booking.currency)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Current Price:</span>
                                <span className="font-medium text-gray-900">
                                    {formatCurrency(booking.current_price, booking.currency)}
                                </span>
                            </div>
                            {booking.price_drop_detected && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Potential Savings:</span>
                                    <span className="font-medium text-green-600">
                                        {formatCurrency(booking.price_drop_amount, booking.currency)}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Price per Night:</span>
                                <span className="font-medium text-gray-900">
                                    {formatCurrency(booking.price_per_night, booking.currency)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Price History Chart */}
                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Price History</CardTitle>
                        <CardDescription className="text-gray-600">
                            Track how prices have changed over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Price history chart will be displayed here</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Price Checks */}
                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Recent Price Checks</CardTitle>
                        <CardDescription className="text-gray-600">
                            Latest price monitoring activity
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Dummy price check data */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <RefreshCw className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Google Hotels</p>
                                        <p className="text-xs text-gray-500">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatCurrency(booking.current_price, booking.currency)}
                                    </p>
                                    {booking.price_drop_detected && (
                                        <p className="text-xs text-green-600">
                                            Save {formatCurrency(booking.price_drop_amount, booking.currency)}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <RefreshCw className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Booking.com</p>
                                        <p className="text-xs text-gray-500">4 hours ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatCurrency(booking.original_price, booking.currency)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
