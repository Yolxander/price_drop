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

    const dashboardStats = [
        {
            title: 'Total Bookings',
            value: stats.total_bookings || 0,
            description: 'from last month',
            trend: 'up',
            icon: Building2,
            color: 'text-green-500'
        },
        {
            title: 'Active Monitoring',
            value: stats.active_bookings || 0,
            description: 'currently tracking',
            trend: 'up',
            icon: Activity,
            color: 'text-blue-500'
        },
        {
            title: 'Total Savings',
            value: formatCurrency(stats.total_savings || 0, 'USD'),
            description: 'potential savings',
            trend: 'up',
            icon: TrendingDown,
            color: 'text-green-500'
        },
        {
            title: 'Price Checks',
            value: stats.total_checks || 0,
            description: 'this month',
            trend: 'up',
            icon: RefreshCw,
            color: 'text-purple-500'
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Let's find you a better deal."
        >
            <div className="space-y-6 pt-4 bg-gray-50 min-h-screen">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {dashboardStats.map((stat, index) => (
                        <Card key={index} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                <p className="text-xs text-gray-600 flex items-center mt-1">
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
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Bookings */}
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Recent Bookings</CardTitle>
                                <CardDescription className="text-gray-600">Your latest hotel reservations</CardDescription>
                            </div>
                            <Button
                                onClick={() => window.location.href = '/bookings/create'}
                                className="bg-green-500 hover:bg-green-600 text-white border-0"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Booking
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {hotel_bookings && hotel_bookings.length > 0 ? (
                                    hotel_bookings.slice(0, 5).map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => window.location.href = `/bookings/${booking.id}`}
                                        >
                                            <div className="flex-shrink-0">
                                                <Building2 className="h-8 w-8 text-green-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {booking.hotel_name}
                                                </p>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {booking.location}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)} bg-gray-50`}>
                                                        {booking.status}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {formatDate(booking.check_in_date)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(booking.total_price, booking.currency)}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {booking.nights} nights
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                                        <p className="text-gray-600 mb-4">
                                            Start tracking your hotel bookings to find better deals.
                                        </p>
                                        <Button
                                            onClick={() => window.location.href = '/bookings/create'}
                                            className="bg-green-500 hover:bg-green-600 text-white border-0"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Your First Booking
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Price Checks */}
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">Recent Price Checks</CardTitle>
                            <CardDescription className="text-gray-600">Latest price monitoring activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent_checks && recent_checks.length > 0 ? (
                                    recent_checks.slice(0, 5).map((check) => (
                                        <div key={check.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex-shrink-0">
                                                <RefreshCw className="h-8 w-8 text-blue-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {check.hotel_name}
                                                </p>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {check.provider}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="text-xs text-gray-500">
                                                        {formatTimeAgo(check.scraped_at)}
                                                    </span>
                                                    {check.diff_vs_booked < 0 && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-50">
                                                            Price Drop!
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(check.price, check.currency)}
                                                </p>
                                                {check.diff_vs_booked < 0 && (
                                                    <p className="text-xs text-green-600">
                                                        Save {formatCurrency(Math.abs(check.diff_vs_booked), check.currency)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No price checks yet</h3>
                                        <p className="text-gray-600">
                                            Price monitoring will start once you add your first booking.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                        <CardDescription className="text-gray-600">Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Button
                                onClick={() => window.location.href = '/bookings/create'}
                                className="flex items-center justify-center p-6 h-auto bg-green-500 hover:bg-green-600 text-white border-0"
                            >
                                <div className="text-center">
                                    <Plus className="h-8 w-8 mx-auto mb-2" />
                                    <p className="font-medium">Add New Booking</p>
                                    <p className="text-sm opacity-90">Track a hotel reservation</p>
                                </div>
                            </Button>
                            <Button
                                onClick={() => window.location.href = '/price-alerts'}
                                className="flex items-center justify-center p-6 h-auto bg-blue-500 hover:bg-blue-600 text-white border-0"
                            >
                                <div className="text-center">
                                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                                    <p className="font-medium">View Alerts</p>
                                    <p className="text-sm opacity-90">Check price drops</p>
                                </div>
                            </Button>
                            <Button
                                onClick={() => window.location.href = '/reports'}
                                className="flex items-center justify-center p-6 h-auto bg-purple-500 hover:bg-purple-600 text-white border-0"
                            >
                                <div className="text-center">
                                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                                    <p className="font-medium">View Reports</p>
                                    <p className="text-sm opacity-90">Analytics & trends</p>
                                </div>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
