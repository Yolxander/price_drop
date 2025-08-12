import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Bell,
    CheckCircle,
    XCircle,
    Clock,
    TrendingDown,
    Building2,
    DollarSign,
    MoreHorizontal,
    Filter
} from 'lucide-react';

export default function AlertsIndex({ auth, alerts, stats }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [severityFilter, setSeverityFilter] = useState('all');

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD'
        }).format(amount);
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
            case 'new': return 'text-blue-600 bg-blue-50';
            case 'actioned': return 'text-green-600 bg-green-50';
            case 'dismissed': return 'text-gray-600 bg-gray-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const filteredAlerts = alerts.filter(alert => {
        const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
        const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
        return matchesStatus && matchesSeverity;
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="We found better deals on your trips."
        >
            <div className="space-y-6 pt-4 bg-gray-50 min-h-screen">
                {/* Filters */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Total Alerts</CardTitle>
                            <Filter className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm text-gray-700 bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="new">New</option>
                                <option value="actioned">Actioned</option>
                                <option value="dismissed">Dismissed</option>
                            </select>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">New Alerts</CardTitle>
                            <Filter className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <select
                                value={severityFilter}
                                onChange={(e) => setSeverityFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm text-gray-700 bg-white"
                            >
                                <option value="all">All Severity</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Actioned</CardTitle>
                            <Filter className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {stats.actioned_alerts}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Total Savings</CardTitle>
                            <Filter className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(Math.abs(stats.total_savings || 0), 'USD')}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAlerts.length === 0 ? (
                        <Card className="bg-white border-gray-200 shadow-sm col-span-full">
                            <CardContent className="text-center py-12">
                                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No price drops right now</h3>
                                <p className="text-gray-600">
                                    {statusFilter !== 'all' || severityFilter !== 'all'
                                        ? 'Try adjusting your filters'
                                        : 'No price drops right now — we\'ll let you know as soon as we spot one.'
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredAlerts.map((alert) => (
                            <Card
                                key={alert.id}
                                className="hover:shadow-md transition-all duration-200 cursor-pointer bg-white border-gray-200 shadow-sm relative"
                                onClick={() => window.location.href = `/bookings/${alert.booking_id}`}
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
                                                {alert.status === 'new' && (
                                                    <>
                                                        <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-gray-700 hover:bg-gray-50">
                                                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                                            Mark as Rebooked
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-gray-700 hover:bg-gray-50">
                                                            <XCircle className="h-4 w-4 mr-2 text-gray-600" />
                                                            Dismiss Alert
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = `/bookings/${alert.booking_id}`;
                                                }} className="text-gray-700 hover:bg-gray-50">
                                                    <Building2 className="h-4 w-4 mr-2" />
                                                    View Booking
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Alert Content */}
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 line-clamp-1">
                                                    {alert.hotel_name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {alert.location}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                                                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                                                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {formatTimeAgo(alert.created_at)}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Current Price:</span>
                                                <span className="font-medium text-gray-900">
                                                    {formatCurrency(alert.current_price, alert.currency)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Booked Price:</span>
                                                <span className="font-medium text-gray-900 line-through">
                                                    {formatCurrency(alert.booked_price, alert.currency)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Potential Savings:</span>
                                                <span className="font-medium text-green-600">
                                                    {formatCurrency(Math.abs(alert.delta_amount), alert.currency)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Provider: {alert.provider}</span>
                                            <span>Check-in: {new Date(alert.check_in_date).toLocaleDateString()}</span>
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
