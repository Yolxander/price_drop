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
            <div className="space-y-6 pt-4">
                {/* Back Button */}
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Bookings
                    </Button>
                </div>

                {/* Booking Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center space-x-2">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                    <span>{booking.hotel_name}</span>
                                </CardTitle>
                                <CardDescription>
                                    {booking.location} • {booking.booking_reference}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Trip
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Hotel Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">{booking.hotel_name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-600" />
                                <span>{booking.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-600" />
                                <span>{formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-gray-600" />
                                <span>{booking.guests} guests</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Original Price:</span>
                                <span className="font-medium">
                                    {formatCurrency(booking.original_price, booking.currency)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Current Price:</span>
                                <span className="font-medium">
                                    {formatCurrency(booking.current_price, booking.currency)}
                                </span>
                            </div>
                            {booking.price_drop_detected && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Potential Savings:</span>
                                    <span className="font-medium text-red-600">
                                        {formatCurrency(booking.price_drop_amount, booking.currency)} ({booking.price_drop_percentage}%)
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    booking.status === 'active' ? 'text-green-600 bg-green-100' :
                                    booking.status === 'paused' ? 'text-yellow-600 bg-yellow-100' :
                                    'text-gray-600 bg-gray-100'
                                }`}>
                                    {booking.status}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Price History Chart Placeholder */}
                <Card>
                    <CardHeader>
                        <CardTitle>Price Story</CardTitle>
                        <CardDescription>
                            How prices changed for this trip
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg border border-border/50">
                            <div className="text-center">
                                <TrendingDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">Price history chart would go here</p>
                                <p className="text-sm text-muted-foreground/70">Using a library like Recharts or Chart.js</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Provider Comparison */}
                <Card>
                    <CardHeader>
                        <CardTitle>Where We Found It</CardTitle>
                        <CardDescription>
                            Best prices from different sources
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="font-medium">Google Hotels</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">{formatCurrency(booking.current_price, booking.currency)}</div>
                                    <div className="text-sm text-muted-foreground">2 hours ago</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="font-medium">Booking.com</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">{formatCurrency(booking.current_price + 50, booking.currency)}</div>
                                    <div className="text-sm text-muted-foreground">4 hours ago</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    <span className="font-medium">Expedia</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">{formatCurrency(booking.current_price + 75, booking.currency)}</div>
                                    <div className="text-sm text-muted-foreground">6 hours ago</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
