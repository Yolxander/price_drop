import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast, Toaster } from 'sonner';
import Sidebar from '@/components/ui/sidebar';
import {
    TrendingDown,
    DollarSign,
    MapPin,
    Calendar,
    Clock,
    Filter,
    MoreHorizontal,
    Eye,
    EyeOff,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ArrowRight,
    Building2,
    Star,
    Search,
    Bell,
    Settings,
    Save,
    Loader2,
    Menu,
    X,
    Home,
    Grid3X3,
    Calendar as CalendarIcon,
    Heart,
    LogOut
} from 'lucide-react';

export default function AlertsIndex({ auth, alerts, stats }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState({
        header: false,
        searchBar: false,
        statsCards: false,
        alertsList: false
    });
    const [alertSettings, setAlertSettings] = useState({
        min_price_drop_amount: 10.00,
        min_price_drop_percent: 5.00,
        email_notifications: true,
        push_notifications: true,
        sms_notifications: false,
        notification_frequency: 'immediate',
        quiet_hours_start: null,
        quiet_hours_end: null,
        excluded_providers: [],
        included_locations: []
    });

    // Mobile navigation items
    const mobileNavigationItems = [
        {
            href: '/dashboard',
            icon: Home,
            label: 'Dashboard',
            page: 'dashboard'
        },
        {
            href: '/bookings',
            icon: Grid3X3,
            label: 'All Bookings',
            page: 'bookings'
        },
        {
            href: '/calendar',
            icon: CalendarIcon,
            label: 'Calendar',
            page: 'calendar'
        },
        {
            href: '/price-alerts',
            icon: Bell,
            label: 'Price Pulses',
            page: 'alerts',
            hasNotification: true,
            notificationCount: 2
        },
        {
            href: '/favorites',
            icon: Heart,
            label: 'Favorites',
            page: 'favorites'
        },
        {
            href: '/settings',
            icon: Settings,
            label: 'Settings',
            page: 'settings'
        }
    ];

    // Intersection Observer for scroll-triggered animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const section = entry.target.getAttribute('data-section');
                        if (section && isVisible.hasOwnProperty(section)) {
                            setIsVisible(prev => ({
                                ...prev,
                                [section]: true
                            }));
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observe all sections with data-section attributes
        const sections = document.querySelectorAll('[data-section]');
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        loadAlertSettings();
    }, []);

    const loadAlertSettings = async () => {
        try {
            const response = await fetch('/price-alerts/settings');
            const data = await response.json();
            if (data.success) {
                setAlertSettings(data.settings);
            }
        } catch (error) {
            console.error('Error loading alert settings:', error);
        }
    };

    const saveAlertSettings = async () => {
        setIsLoading(true);

        // Show loading toast
        const loadingToast = toast.loading('Saving alert settings...', {
            duration: Infinity,
        });

        try {
            const response = await fetch('/price-alerts/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(alertSettings)
            });
            const data = await response.json();
            if (data.success) {
                setShowSettings(false);

                // Close loading toast and show success
                toast.dismiss(loadingToast);
                toast.success('Alert settings saved successfully!', {
                    icon: <CheckCircle className="h-4 w-4" />,
                });
            } else {
                throw new Error(data.message || 'Failed to save settings');
            }
        } catch (error) {
            // Close loading toast and show error
            toast.dismiss(loadingToast);
            toast.error('Failed to save alert settings. Please try again.', {
                icon: <AlertTriangle className="h-4 w-4" />,
            });
            console.error('Error saving alert settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleAlertAction = async (alertId, action) => {
        setIsLoading(true);

        // Show loading toast
        const actionText = action === 'action' ? 'marking as actioned' : 'dismissing';
        const loadingToast = toast.loading(`${actionText} alert...`, {
            duration: Infinity,
        });

        try {
            let endpoint = '';
            if (action === 'action') {
                endpoint = `/price-alerts/${alertId}/action`;
            } else if (action === 'dismiss') {
                endpoint = `/price-alerts/${alertId}/dismiss`;
            }

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (response.ok) {
                // Close loading toast and show success
                toast.dismiss(loadingToast);
                toast.success(`Alert ${action === 'action' ? 'marked as actioned' : 'dismissed'} successfully!`, {
                    icon: <CheckCircle className="h-4 w-4" />,
                });

                // Refresh the page to show updated data
                setTimeout(() => window.location.reload(), 1000);
            } else {
                throw new Error('Failed to update alert');
            }
        } catch (error) {
            // Close loading toast and show error
            toast.dismiss(loadingToast);
            toast.error(`Failed to ${actionText} alert. Please try again.`, {
                icon: <AlertTriangle className="h-4 w-4" />,
            });
            console.error(`Error ${action} alert:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        setIsLoading(true);

        // Show loading toast
        const loadingToast = toast.loading('Marking all alerts as read...', {
            duration: Infinity,
        });

        try {
            const response = await fetch('/price-alerts/mark-all-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (response.ok) {
                // Close loading toast and show success
                toast.dismiss(loadingToast);
                toast.success('All alerts marked as read successfully!', {
                    icon: <CheckCircle className="h-4 w-4" />,
                });

                // Refresh the page to show updated data
                setTimeout(() => window.location.reload(), 1000);
            } else {
                throw new Error('Failed to mark all as read');
            }
        } catch (error) {
            // Close loading toast and show error
            toast.dismiss(loadingToast);
            toast.error('Failed to mark all alerts as read. Please try again.', {
                icon: <AlertTriangle className="h-4 w-4" />,
            });
            console.error('Error marking all as read:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckPrices = async () => {
        setIsLoading(true);

        // Show loading toast
        const loadingToast = toast.loading('Checking prices for all bookings...', {
            duration: Infinity,
        });

        try {
            const response = await fetch('/price-alerts/check-prices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            const data = await response.json();
            if (data.success) {
                // Close loading toast and show success
                toast.dismiss(loadingToast);
                toast.success(data.message || 'Price check completed successfully!', {
                    icon: <CheckCircle className="h-4 w-4" />,
                });

                // Refresh the page to show updated data
                setTimeout(() => window.location.reload(), 1000);
            } else {
                throw new Error(data.message || 'Price check failed');
            }
        } catch (error) {
            // Close loading toast and show error
            toast.dismiss(loadingToast);
            toast.error('Error checking prices. Please try again.', {
                icon: <AlertTriangle className="h-4 w-4" />,
            });
            console.error('Error checking prices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAlerts = alerts?.filter(alert => {
        const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
        const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
        const matchesSearch = !searchQuery ||
            alert.hotel_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.provider.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSeverity && matchesSearch;
    }) || [];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
                        setIsMobileMenuOpen(false);
                    }} />
                    <div className="mobile-menu-container fixed inset-y-0 left-0 flex w-80 flex-col bg-white border-r border-gray-200 animate-in slide-in-from-left duration-300">
                        {/* Mobile Menu Header */}
                        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <img
                                    src="/logo/price-pulse-logo.png"
                                    alt="Price Pulse"
                                    className="w-8 h-8"
                                />
                                <span className="text-xl font-bold text-yellow-600">Price Pulse</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                }}
                                className="h-8 w-8"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Mobile Navigation */}
                        <nav className="flex-1 p-4 space-y-2">
                            {mobileNavigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.page === 'alerts';

                                return (
                                    <Link key={item.href} href={item.href} className="block">
                                        <div className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-200 active:scale-95 ${
                                            isActive
                                                ? 'bg-yellow-50 border border-yellow-200'
                                                : 'hover:bg-gray-50 active:bg-gray-100'
                                        }`}>
                                            {item.hasNotification ? (
                                                <div className="relative">
                                                    <Icon className={`h-6 w-6 ${
                                                        isActive ? 'text-yellow-600' : 'text-gray-600'
                                                    }`} />
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                        <span className="text-xs text-white font-medium">{item.notificationCount}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Icon className={`h-6 w-6 ${
                                                    isActive ? 'text-yellow-600' : 'text-gray-600'
                                                }`} />
                                            )}
                                            <span className={`text-lg ${
                                                isActive
                                                    ? 'font-semibold text-gray-900'
                                                    : 'text-gray-700'
                                            }`}>
                                                {item.label}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Mobile User Profile */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-lg">
                                        {auth?.user?.name?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{auth?.user?.name || 'User'}</p>
                                    <p className="text-sm text-gray-600">{auth?.user?.email || 'user@example.com'}</p>
                                </div>
                            </div>
                            <Link href="/" className="block mt-3">
                                <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 active:bg-gray-100 rounded-xl cursor-pointer transition-all duration-200 active:scale-95">
                                    <LogOut className="h-5 w-5 text-gray-600" />
                                    <span className="text-gray-700 font-medium">Log Out</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
                <Sidebar activePage="alerts" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Head title="Price Alerts" />

                {/* Mobile Header */}
                <div className="lg:hidden bg-white border-b border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="h-10 w-10 active:scale-95 transition-transform"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        <div className="flex items-center space-x-3">
                            <img
                                src="/logo/price-pulse-logo.png"
                                alt="Price Pulse"
                                className="w-8 h-8"
                            />
                            <span className="text-xl font-bold text-yellow-600">Price Alerts</span>
                        </div>
                        <div className="w-10" /> {/* Spacer for centering */}
                    </div>
                </div>

                {/* Header */}
                <div
                    data-section="header"
                    className={`bg-white border-b border-gray-200 p-4 lg:p-6 transition-all duration-1000 ease-out ${
                        isVisible.header
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="w-full lg:max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search alerts..."
                                    className="pl-10 form-input-focus transition-all duration-300 w-full h-12 text-base"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleMarkAllAsRead}
                                disabled={isLoading}
                                className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 h-10 w-full sm:w-auto"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Eye className="w-4 h-4 mr-2" />
                                )}
                                Mark All Read
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCheckPrices}
                                disabled={isLoading}
                                className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 h-10 w-full sm:w-auto"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 mr-2" />
                                )}
                                Check Prices Now
                            </Button>
                            <Dialog open={showSettings} onOpenChange={setShowSettings}>
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 h-10 w-full sm:w-auto"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Alert Settings
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl lg:text-2xl font-bold text-gray-900">Alert Settings</DialogTitle>
                                        <DialogDescription className="text-gray-600 text-base lg:text-lg">
                                            Configure your price pulse alert preferences to stay informed about the best deals.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="min_amount" className="text-gray-700 font-semibold">Minimum Price Pulse Amount ($)</Label>
                                                <Input
                                                    id="min_amount"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={alertSettings.min_price_drop_amount}
                                                    onChange={(e) => setAlertSettings({
                                                        ...alertSettings,
                                                        min_price_drop_amount: parseFloat(e.target.value)
                                                    })}
                                                    className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg transition-all duration-300 form-input-focus h-12 text-base"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="min_percent" className="text-gray-700 font-semibold">Minimum Price Pulse Percent (%)</Label>
                                                <Input
                                                    id="min_percent"
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="0.0"
                                                    value={alertSettings.min_price_drop_percent}
                                                    onChange={(e) => setAlertSettings({
                                                        ...alertSettings,
                                                        min_price_drop_percent: parseFloat(e.target.value)
                                                    })}
                                                    className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg transition-all duration-300 form-input-focus h-12 text-base"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-semibold">Notification Methods</Label>
                                            <div className="space-y-3 mt-2">
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="email"
                                                        checked={alertSettings.email_notifications}
                                                        onCheckedChange={(checked) => setAlertSettings({
                                                            ...alertSettings,
                                                            email_notifications: checked
                                                        })}
                                                    />
                                                    <Label htmlFor="email" className="text-gray-700">Email Notifications</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="push"
                                                        checked={alertSettings.push_notifications}
                                                        onCheckedChange={(checked) => setAlertSettings({
                                                            ...alertSettings,
                                                            push_notifications: checked
                                                        })}
                                                    />
                                                    <Label htmlFor="push" className="text-gray-700">Push Notifications</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="sms"
                                                        checked={alertSettings.sms_notifications}
                                                        onCheckedChange={(checked) => setAlertSettings({
                                                            ...alertSettings,
                                                            sms_notifications: checked
                                                        })}
                                                    />
                                                    <Label htmlFor="sms" className="text-gray-700">SMS Notifications</Label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="frequency" className="text-gray-700 font-semibold">Notification Frequency</Label>
                                            <Select
                                                value={alertSettings.notification_frequency}
                                                onValueChange={(value) => setAlertSettings({
                                                    ...alertSettings,
                                                    notification_frequency: value
                                                })}
                                            >
                                                <SelectTrigger className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg transition-all duration-300 form-input-focus h-12 text-base">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="immediate">Immediate</SelectItem>
                                                    <SelectItem value="daily">Daily Digest</SelectItem>
                                                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowSettings(false)}
                                                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto h-12 text-base"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={saveAlertSettings}
                                                disabled={isLoading}
                                                className={`bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 btn-hover-effect w-full sm:w-auto h-12 text-base ${isLoading ? 'btn-loading' : ''}`}
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4 mr-2" />
                                                )}
                                                Save Settings
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6">
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div
                            data-section="statsCards"
                            className={`grid gap-4 grid-cols-2 lg:grid-cols-4 transition-all duration-1000 ease-out ${
                                isVisible.statsCards
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                            }`}
                        >
                            <Card className="transition-all duration-500 ease-out hover-lift active:scale-95 touch-manipulation">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                                    <Bell className="h-4 w-4 text-muted-foreground animate-pulse" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl lg:text-2xl font-bold">{stats?.total_alerts || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Across all bookings
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="transition-all duration-500 ease-out hover-lift active:scale-95 touch-manipulation" style={{ transitionDelay: '100ms' }}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">New Alerts</CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-muted-foreground animate-pulse" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl lg:text-2xl font-bold">{stats?.new_alerts || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Require attention
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="transition-all duration-500 ease-out hover-lift active:scale-95 touch-manipulation" style={{ transitionDelay: '200ms' }}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Actioned</CardTitle>
                                    <CheckCircle className="h-4 w-4 text-muted-foreground animate-pulse" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl lg:text-2xl font-bold">{stats?.actioned_alerts || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Already handled
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="transition-all duration-500 ease-out hover-lift active:scale-95 touch-manipulation" style={{ transitionDelay: '300ms' }}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground animate-pulse" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl lg:text-2xl font-bold">
                                        {formatCurrency(stats?.total_savings || 0)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Potential savings detected
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Alerts List */}
                        <div
                            data-section="alertsList"
                            className={`space-y-4 transition-all duration-1000 ease-out ${
                                isVisible.alertsList
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                            }`}
                        >
                            {filteredAlerts.length === 0 ? (
                                <Card className="transition-all duration-500 ease-out hover-lift active:scale-95 touch-manipulation">
                                    <CardContent className="p-6 lg:p-8 text-center">
                                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-float" />
                                        <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
                                        <p className="text-muted-foreground mb-4">
                                            {statusFilter !== 'all' || severityFilter !== 'all' || searchQuery
                                                ? 'Try adjusting your filters or search terms.'
                                                : 'You\'re all caught up! No price alerts at the moment.'
                                            }
                                        </p>
                                        {(statusFilter !== 'all' || severityFilter !== 'all' || searchQuery) && (
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setStatusFilter('all');
                                                    setSeverityFilter('all');
                                                    setSearchQuery('');
                                                }}
                                                className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 touch-manipulation"
                                            >
                                                Clear Filters
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredAlerts.map((alert, index) => (
                                    <Card
                                        key={alert.id}
                                        className="hover:shadow-md transition-all duration-500 ease-out hover-lift active:scale-95 touch-manipulation"
                                        style={{ transitionDelay: `${index * 100}ms` }}
                                    >
                                        <CardContent className="p-4 lg:p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex items-center space-x-2">
                                                                {getStatusIcon(alert.status)}
                                                                <Badge variant={getStatusBadgeVariant(alert.status)} className="transition-all duration-300 hover:scale-105 active:scale-95">
                                                                    {alert.status}
                                                                </Badge>
                                                                <Badge variant={getSeverityBadgeVariant(alert.severity)} className="transition-all duration-300 hover:scale-105 active:scale-95">
                                                                    {alert.severity}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105 active:scale-95">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="animate-in slide-in-from-top-2">
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

                                                            <div className="grid grid-cols-1 gap-3 mb-4">
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
                                                                <div className="grid grid-cols-1 gap-4">
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
                                                                            <TrendingDown className="w-4 h-4 text-green-600 animate-pulse" />
                                                                            <span className="text-lg font-semibold text-green-600">
                                                                                {formatCurrency(Math.abs(alert.delta_amount), alert.currency)}
                                                                            </span>
                                                                            <Badge variant="secondary" className="text-green-700 transition-all duration-300 hover:scale-105 active:scale-95">
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

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t space-y-3 sm:space-y-0">
                                                <div className="flex items-center space-x-2">
                                                    <Link href={`/bookings/${alert.booking_id}`}>
                                                        <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 touch-manipulation w-full sm:w-auto">
                                                            View Booking
                                                            <ArrowRight className="w-4 h-4 ml-2" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                                    {alert.status === 'new' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleAlertAction(alert.id, 'action')}
                                                                disabled={isLoading}
                                                                className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 touch-manipulation w-full sm:w-auto"
                                                            >
                                                                {isLoading ? (
                                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                                )}
                                                                Mark Actioned
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleAlertAction(alert.id, 'dismiss')}
                                                                disabled={isLoading}
                                                                className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 touch-manipulation w-full sm:w-auto"
                                                            >
                                                                {isLoading ? (
                                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                ) : (
                                                                    <XCircle className="w-4 h-4 mr-2" />
                                                                )}
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

                {/* Mobile Bottom Navigation */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-40">
                    <div className="flex items-center justify-around">
                        {mobileNavigationItems.slice(0, 5).map((item) => {
                            const Icon = item.icon;
                            const isActive = item.page === 'alerts';

                            return (
                                <Link key={item.href} href={item.href} className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 active:scale-95">
                                    {item.hasNotification ? (
                                        <div className="relative">
                                            <Icon className={`h-6 w-6 ${
                                                isActive ? 'text-yellow-600' : 'text-gray-600'
                                            }`} />
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-xs text-white font-medium">{item.notificationCount}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <Icon className={`h-6 w-6 ${
                                            isActive ? 'text-yellow-600' : 'text-gray-600'
                                        }`} />
                                    )}
                                    <span className={`text-xs ${
                                        isActive ? 'font-semibold text-yellow-600' : 'text-gray-600'
                                    }`}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
}
