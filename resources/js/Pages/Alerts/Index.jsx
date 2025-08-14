import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    Home,
    Grid3X3,
    Bell,
    Heart,
    Settings,
    LogOut,
    TrendingDown,
    DollarSign,
    MapPin,
    Calendar,
    Clock,
    Filter,
    Search,
    MoreHorizontal,
    Eye,
    EyeOff,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ArrowRight,
    Building2,
    Star
} from 'lucide-react';

export default function AlertsIndex({ auth, alerts, stats }) {
    const [searchQuery, setSearchQuery] = useState('');
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'new':
                return 'default';
            case 'actioned':
                return 'secondary';
            case 'dismissed':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const getSeverityBadgeVariant = (severity) => {
        switch (severity) {
            case 'high':
                return 'destructive';
            case 'medium':
                return 'default';
            case 'low':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'new':
                return <AlertTriangle className="w-4 h-4" />;
            case 'actioned':
                return <CheckCircle className="w-4 h-4" />;
            case 'dismissed':
                return <XCircle className="w-4 h-4" />;
            default:
                return <AlertTriangle className="w-4 h-4" />;
        }
    };

    const filteredAlerts = alerts?.filter(alert => {
        const matchesSearch = alert.hotel_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            alert.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
        const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;

        return matchesSearch && matchesStatus && matchesSeverity;
    }) || [];

    const handleAlertAction = (alertId, action) => {
        // TODO: Implement alert actions
        console.log(`Alert ${alertId}: ${action}`);
    };

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
                        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <Grid3X3 className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">All Bookings</span>
                        </div>
                    </Link>
                    <Link href="/price-alerts" className="block">
                        <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                            <div className="relative">
                                <Bell className="h-5 w-5 text-blue-600" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">2</span>
                                </div>
                            </div>
                            <span className="font-medium text-gray-900">Price Drops</span>
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
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Price Alerts</h1>
                            <p className="text-gray-600">Monitor price changes for your hotel bookings</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Mark All Read
                            </Button>
                            <Button size="sm">
                                <Bell className="w-4 h-4 mr-2" />
                                Alert Settings
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <Head title="Price Alerts" />

                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                                    <Bell className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats?.total_alerts || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Across all bookings
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">New Alerts</CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats?.new_alerts || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Require attention
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Actioned</CardTitle>
                                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats?.actioned_alerts || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Already handled
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {formatCurrency(stats?.total_savings || 0)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Potential savings detected
                                    </p>
                        </CardContent>
                    </Card>
                        </div>

                        {/* Filters and Search */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                    <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                            <Input
                                                placeholder="Search hotels or locations..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <Filter className="w-4 h-4 mr-2" />
                                                    Status: {statusFilter === 'all' ? 'All' : statusFilter}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                                                    All Status
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setStatusFilter('new')}>
                                                    New
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setStatusFilter('actioned')}>
                                                    Actioned
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setStatusFilter('dismissed')}>
                                                    Dismissed
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <Filter className="w-4 h-4 mr-2" />
                                                    Severity: {severityFilter === 'all' ? 'All' : severityFilter}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => setSeverityFilter('all')}>
                                                    All Severity
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setSeverityFilter('high')}>
                                                    High
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setSeverityFilter('medium')}>
                                                    Medium
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setSeverityFilter('low')}>
                                                    Low
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                            </div>
                                        </div>
                            </CardContent>
                        </Card>

                        {/* Alerts List */}
                        <div className="space-y-4">
                            {filteredAlerts.length === 0 ? (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
                                        <p className="text-muted-foreground mb-4">
                                            {searchQuery || statusFilter !== 'all' || severityFilter !== 'all'
                                                ? 'Try adjusting your filters or search terms.'
                                                : 'You\'re all caught up! No price alerts at the moment.'
                                            }
                                        </p>
                                        {(searchQuery || statusFilter !== 'all' || severityFilter !== 'all') && (
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setStatusFilter('all');
                                                    setSeverityFilter('all');
                                                }}
                                            >
                                                Clear Filters
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredAlerts.map((alert) => (
                                    <Card key={alert.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex items-center space-x-2">
                                                                {getStatusIcon(alert.status)}
                                                                <Badge variant={getStatusBadgeVariant(alert.status)}>
                                                                    {alert.status}
                                                                </Badge>
                                                                <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                                                                    {alert.severity}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleAlertAction(alert.id, 'view')}>
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    View Booking
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleAlertAction(alert.id, 'dismiss')}>
                                                                    <XCircle className="w-4 h-4 mr-2" />
                                                                    Dismiss Alert
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>

                                                    <div className="flex items-start space-x-4">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold mb-1">{alert.hotel_name}</h3>
                                                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                                                                <MapPin className="w-4 h-4 mr-1" />
                                                                {alert.location}
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                                <div className="flex items-center space-x-2">
                                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                                    <span className="text-sm">
                                                                        Check-in: {formatDate(alert.check_in_date)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                                                    <span className="text-sm">
                                                                        Provider: {alert.provider}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                                                    <span className="text-sm">
                                                                        {formatTimeAgo(alert.triggered_at)}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="bg-muted/50 rounded-lg p-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <p className="text-sm text-muted-foreground mb-1">Price Change</p>
                                                                        <div className="flex items-center space-x-2">
                                                                            <span className="text-lg font-semibold">
                                                                                {formatCurrency(alert.current_price, alert.currency)}
                                                                            </span>
                                                                            <span className="text-sm text-muted-foreground line-through">
                                                                                {formatCurrency(alert.booked_price, alert.currency)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-muted-foreground mb-1">Savings</p>
                                                                        <div className="flex items-center space-x-2">
                                                                            <TrendingDown className="w-4 h-4 text-green-600" />
                                                                            <span className="text-lg font-semibold text-green-600">
                                                                                {formatCurrency(Math.abs(alert.delta_amount), alert.currency)}
                                                                            </span>
                                                                            <Badge variant="secondary" className="text-green-700">
                                                                                {alert.delta_percent}%
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-2">
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Rule: {alert.rule_threshold}
                                                                    </p>
                                                                </div>
                                                            </div>
                        </div>
                    </div>
                </div>
            </div>

                                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                                <div className="flex items-center space-x-2">
                                                    <Link href={`/bookings/${alert.booking_id}`}>
                                                        <Button variant="outline" size="sm">
                                                            View Booking
                                                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                                                    </Link>
                    </div>
                                                <div className="flex items-center space-x-2">
                                                    {alert.status === 'new' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleAlertAction(alert.id, 'action')}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Mark Actioned
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleAlertAction(alert.id, 'dismiss')}
                                                            >
                                                                <XCircle className="w-4 h-4 mr-2" />
                                                                Dismiss
                    </Button>
                                                        </>
                                                    )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
