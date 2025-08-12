import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Bell,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    TrendingDown,
    Building2,
    DollarSign,
    MoreHorizontal
} from 'lucide-react';

export default function AlertsIndex({ auth, alerts, filters, stats }) {
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
            case 'new': return 'text-blue-600 bg-blue-100';
            case 'actioned': return 'text-green-600 bg-green-100';
            case 'dismissed': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
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
            <div className="space-y-6 pt-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_alerts}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New</CardTitle>
                            <Clock className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.new_alerts}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Actioned</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.actioned_alerts}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatCurrency(Math.abs(stats.total_savings), 'USD')}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Filter className="h-5 w-5" />
                            <span>Filters</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                {filters.status.map(status => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={severityFilter}
                                onChange={(e) => setSeverityFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Severity</option>
                                {filters.severity.map(severity => (
                                    <option key={severity} value={severity}>
                                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAlerts.length === 0 ? (
                        <Card className="border-border/50 col-span-full">
                            <CardContent className="text-center py-12">
                                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">No price drops right now</h3>
                                <p className="text-muted-foreground">
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
                                className="hover:shadow-sm transition-all duration-200 cursor-pointer border-border/50 relative"
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
                                                    className="h-8 w-8 p-0"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {alert.status === 'new' && (
                                                    <>
                                                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                                            Mark as Rebooked
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                            <XCircle className="h-4 w-4 mr-2 text-gray-600" />
                                                            Dismiss Alert
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = `/bookings/${alert.booking_id}`;
                                                }}>
                                                    <Building2 className="h-4 w-4 mr-2" />
                                                    View Booking
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Card Content */}
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Building2 className="h-5 w-5 text-blue-600" />
                                            <h3 className="text-lg font-semibold text-foreground flex-1">
                                                {alert.hotel_name}
                                            </h3>
                                        </div>

                                        <div className="flex items-center space-x-2 mb-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                                                {alert.status}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                                                {alert.severity}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center space-x-1">
                                                <span>Provider:</span>
                                                <span className="font-medium">{alert.provider}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span>Rule:</span>
                                                <span className="font-medium">{alert.rule_threshold}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2 border-t border-border/50">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Was:</span>
                                                <span className="font-medium">
                                                    {formatCurrency(alert.old_price, 'USD')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Now:</span>
                                                <span className="font-medium">
                                                    {formatCurrency(alert.new_price, 'USD')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Save:</span>
                                                <span className="font-medium text-red-600">
                                                    {formatCurrency(Math.abs(alert.delta_amount), 'USD')}
                                                </span>
                                            </div>
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
