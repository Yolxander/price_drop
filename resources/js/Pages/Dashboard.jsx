import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Building2,
    DollarSign,
    TrendingDown,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Plus,
    MoreHorizontal,
    Calendar,
    Users,
    MapPin,
    AlertCircle,
    CheckCircle,
    Clock,
    RefreshCw,
    BarChart3,
    History,
    Globe
} from 'lucide-react';

export default function Dashboard({ auth, stats, hotel_bookings, recent_checks }) {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showAddBooking, setShowAddBooking] = useState(false);

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

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours === 1) return '1 hour ago';
        if (diffInHours < 24) return `${diffInHours} hours ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-600';
            case 'paused': return 'text-yellow-600';
            case 'completed': return 'text-gray-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'paused': return <Clock className="h-4 w-4 text-yellow-600" />;
            case 'completed': return <AlertCircle className="h-4 w-4 text-gray-600" />;
            default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
        }
    };

    const dashboardStats = [
        {
            title: 'Total Bookings',
            value: stats.total_bookings,
            description: 'Active price tracking',
            icon: Building2,
            trend: 'up',
            color: 'text-blue-600'
        },
        {
            title: 'Active Trackers',
            value: stats.active_bookings,
            description: 'Currently monitoring',
            icon: Activity,
            trend: 'up',
            color: 'text-green-600'
        },
        {
            title: 'Price Drops',
            value: stats.price_drops_detected,
            description: 'Savings opportunities',
            icon: TrendingDown,
            trend: 'down',
            color: 'text-red-600'
        },
        {
            title: 'Total Savings',
            value: formatCurrency(stats.total_savings, 'USD'),
            description: 'Potential savings detected',
            icon: DollarSign,
            trend: 'down',
            color: 'text-emerald-600'
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Hotel Price Tracker"
        >
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {dashboardStats.map((stat, index) => (
                        <Card key={index} className="border-border/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <p className="text-xs text-muted-foreground flex items-center mt-1">
                                    {stat.trend === 'up' ? (
                                        <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 mr-1 text-red-600" />
                                    )}
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Hotel Bookings and Recent Activity */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Hotel Bookings */}
                    <Card className="col-span-4 border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center space-x-2">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                    <span>Hotel Bookings</span>
                                </CardTitle>
                                <CardDescription>
                                    {hotel_bookings.length} active bookings
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = '/hotel-bookings/create'}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {hotel_bookings.length === 0 ? (
                                <div className="text-center py-6">
                                    <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground mb-3">No bookings yet</p>
                                    <Button
                                        size="sm"
                                        onClick={() => window.location.href = '/hotel-bookings/create'}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Booking
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {hotel_bookings.slice(0, 4).map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer"
                                            onClick={() => window.location.href = `/hotel-bookings/${booking.id}`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Building2 className="h-4 w-4 text-blue-600" />
                                                <div>
                                                    <h3 className="font-medium text-sm text-foreground">
                                                        {booking.hotel_name}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        {booking.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-foreground">
                                                    {formatCurrency(booking.current_price, booking.currency)}
                                                </div>
                                                {booking.price_drop_detected && (
                                                    <div className="text-xs text-red-600">
                                                        -{booking.price_drop_percentage}%
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {hotel_bookings.length > 4 && (
                                        <div className="text-center pt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.location.href = '/hotel-bookings'}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                View all {hotel_bookings.length} bookings
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Price Checks */}
                    <Card className="col-span-3 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <TrendingDown className="h-5 w-5 text-green-600" />
                                <span>Recent Price Checks</span>
                            </CardTitle>
                            <CardDescription>
                                Latest price monitoring activity
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recent_checks.length === 0 ? (
                                <div className="text-center py-6">
                                    <TrendingDown className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">No recent price checks</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recent_checks.slice(0, 5).map((check) => (
                                        <div key={check.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/20 transition-colors">
                                            <div className={`w-3 h-3 rounded-full ${
                                                check.status === 'drop' ? 'bg-red-500' : 'bg-green-500'
                                            }`}></div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none text-foreground">
                                                    {check.hotel_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatTimeAgo(check.check_time)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-medium ${
                                                    check.status === 'drop' ? 'text-red-600' : 'text-green-600'
                                                }`}>
                                                    {check.status === 'drop' ? '↓' : '↑'} {formatCurrency(Math.abs(check.price_change), 'USD')}
                                                </p>
                                                <p className={`text-xs ${
                                                    check.status === 'drop' ? 'text-red-500' : 'text-green-500'
                                                }`}>
                                                    {check.percentage_change > 0 ? '+' : ''}{check.percentage_change}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-4 space-y-2">
                                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/price-alerts'}>
                                    <TrendingDown className="h-4 w-4 mr-2" />
                                    View All Alerts
                                </Button>
                                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/price-history'}>
                                    <History className="h-4 w-4 mr-2" />
                                    Price History
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>


            </div>
        </AuthenticatedLayout>
    );
}
