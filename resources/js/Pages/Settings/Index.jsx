import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast, Toaster } from 'sonner';
import Sidebar from '@/components/ui/sidebar';
import {
    Save,
    RefreshCw,
    Shield,
    Database,
    Globe,
    Bell as BellIcon,
    Clock,
    DollarSign,
    Key,
    Trash2,
    Plus,
    CheckCircle,
    AlertCircle,
    Building2,
    Zap,
    Download,
    Upload,
    Search
} from 'lucide-react';

export default function SettingsIndex({ auth, settings, stats }) {
    const [activeTab, setActiveTab] = useState('providers');
    const [isSaving, setIsSaving] = useState(false);
    const [isVisible, setIsVisible] = useState({
        header: false,
        searchBar: false,
        settingsTabs: false,
        providersSection: false,
        alertsSection: false,
        dataSection: false,
        securitySection: false
    });
    const [formData, setFormData] = useState({
        providers: settings.providers,
        alert_rules: settings.alert_rules,
        check_frequency: settings.check_frequency,
        currency: settings.currency
    });

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

    const handleProviderToggle = (providerKey, enabled) => {
        setFormData(prev => ({
            ...prev,
            providers: {
                ...prev.providers,
                [providerKey]: {
                    ...prev.providers[providerKey],
                    enabled
                }
            }
        }));
    };

    const handleAlertRuleChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            alert_rules: {
                ...prev.alert_rules,
                [key]: value
            }
        }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);

        // Show loading toast
        const loadingToast = toast.loading('Saving changes...', {
            duration: Infinity,
        });

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // In a real app, this would make an API call to save settings
            console.log('Saving settings:', formData);

            // Close loading toast and show success
            toast.dismiss(loadingToast);
            toast.success('Settings saved successfully!', {
                icon: <CheckCircle className="h-4 w-4" />,
            });
        } catch (error) {
            // Close loading toast and show error
            toast.dismiss(loadingToast);
            toast.error('Failed to save settings. Please try again.', {
                icon: <AlertCircle className="h-4 w-4" />,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const getProviderStatusColor = (provider) => {
        if (!provider.enabled) return 'bg-gray-100 text-gray-600';
        if (provider.api_key) return 'bg-green-100 text-green-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    const getProviderStatusText = (provider) => {
        if (!provider.enabled) return 'Disabled';
        if (provider.api_key) return 'Active';
        return 'No API Key';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar */}
            <Sidebar activePage="settings" />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Head title="Settings" />

                {/* Header */}
                <div
                    data-section="header"
                    className={`bg-white border-b border-gray-200 p-6 transition-all duration-1000 ease-out ${
                        isVisible.header
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search settings..."
                                    className="pl-10 form-input-focus transition-all duration-300"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-md"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span>Refresh</span>
                            </Button>
                            <Button
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className={`bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-6 transition-all duration-300 hover:scale-105 hover:shadow-lg ${isSaving ? 'btn-loading' : ''}`}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Settings Tabs */}
                        <Card
                            data-section="settingsTabs"
                            className={`h-full transition-all duration-1000 ease-out ${
                                isVisible.settingsTabs
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                            }`}
                        >
                            <CardHeader>
                                <CardTitle>Configuration</CardTitle>
                                <CardDescription>
                                    Manage your integrations, alerts, and preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger
                                            value="providers"
                                            className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
                                        >
                                            <Building2 className="h-4 w-4" />
                                            <span>Providers</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="alerts"
                                            className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
                                        >
                                            <BellIcon className="h-4 w-4" />
                                            <span>Alerts</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="data"
                                            className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
                                        >
                                            <Database className="h-4 w-4" />
                                            <span>Data</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="security"
                                            className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
                                        >
                                            <Shield className="h-4 w-4" />
                                            <span>Security</span>
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Providers Tab */}
                                    <TabsContent value="providers" className="space-y-6 mt-6">
                                        <div
                                            data-section="providersSection"
                                            className={`space-y-4 transition-all duration-1000 ease-out ${
                                                isVisible.providersSection
                                                    ? 'opacity-100 translate-y-0'
                                                    : 'opacity-0 translate-y-8'
                                            }`}
                                        >
                                            {Object.entries(formData.providers).map(([key, provider], index) => (
                                                <Card
                                                    key={key}
                                                    className="border-l-4 border-l-yellow-500 transition-all duration-500 ease-out hover-lift"
                                                    style={{ transitionDelay: `${index * 100}ms` }}
                                                >
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                                                                    <Building2 className="h-6 w-6 text-yellow-600" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                                                                    <div className="flex items-center space-x-2 mt-1">
                                                                        <Badge className={`${getProviderStatusColor(provider)} transition-all duration-300 hover:scale-105`}>
                                                                            {getProviderStatusText(provider)}
                                                                        </Badge>
                                                                        {provider.last_updated && (
                                                                            <span className="text-sm text-gray-500">
                                                                                Updated {formatDate(provider.last_updated)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-3">
                                                                <Switch
                                                                    checked={provider.enabled}
                                                                    onCheckedChange={(enabled) => handleProviderToggle(key, enabled)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    {/* Alerts Tab */}
                                    <TabsContent value="alerts" className="space-y-6 mt-6">
                                        <div
                                            data-section="alertsSection"
                                            className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-1000 ease-out ${
                                                isVisible.alertsSection
                                                    ? 'opacity-100 translate-y-0'
                                                    : 'opacity-0 translate-y-8'
                                            }`}
                                        >
                                            {/* Price Alert Rules */}
                                            <Card className="lg:col-span-2 border-l-4 border-l-yellow-500 transition-all duration-500 ease-out hover-lift">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="flex items-center space-x-3 text-lg">
                                                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                                                            <DollarSign className="h-5 w-5 text-yellow-600" />
                                                        </div>
                                                        <div>
                                                            <span>Price Alert Rules</span>
                                                            <p className="text-sm text-gray-500 font-normal mt-1">Configure price pulse thresholds and rules</p>
                                                        </div>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="global-threshold" className="text-sm font-medium">Global Threshold ($)</Label>
                                                            <Input
                                                                id="global-threshold"
                                                                type="number"
                                                                value={formData.alert_rules.global_threshold}
                                                                onChange={(e) => handleAlertRuleChange('global_threshold', parseFloat(e.target.value))}
                                                                placeholder="50.00"
                                                                className="h-10 form-input-focus transition-all duration-300"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="global-percentage" className="text-sm font-medium">Global Percentage (%)</Label>
                                                            <Input
                                                                id="global-percentage"
                                                                type="number"
                                                                value={formData.alert_rules.global_percentage}
                                                                onChange={(e) => handleAlertRuleChange('global_percentage', parseFloat(e.target.value))}
                                                                placeholder="5.0"
                                                                className="h-10 form-input-focus transition-all duration-300"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-sm font-medium">Quiet Hours</Label>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="quiet-start" className="text-xs text-gray-500">Start Time</Label>
                                                                <Input
                                                                    id="quiet-start"
                                                                    type="time"
                                                                    value={formData.alert_rules.quiet_hours_start}
                                                                    onChange={(e) => handleAlertRuleChange('quiet_hours_start', e.target.value)}
                                                                    className="h-10 form-input-focus transition-all duration-300"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="quiet-end" className="text-xs text-gray-500">End Time</Label>
                                                                <Input
                                                                    id="quiet-end"
                                                                    type="time"
                                                                    value={formData.alert_rules.quiet_hours_end}
                                                                    onChange={(e) => handleAlertRuleChange('quiet_hours_end', e.target.value)}
                                                                    className="h-10 form-input-focus transition-all duration-300"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Notifications */}
                                            <Card className="border-l-4 border-l-green-500 transition-all duration-500 ease-out hover-lift">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="flex items-center space-x-3 text-lg">
                                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                                                            <BellIcon className="h-5 w-5 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <span>Notifications</span>
                                                            <p className="text-sm text-gray-500 font-normal mt-1">Manage alert delivery methods</p>
                                                        </div>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="space-y-1">
                                                                <Label htmlFor="email-notifications" className="text-sm font-medium">Email Notifications</Label>
                                                                <p className="text-xs text-gray-500">Receive alerts via email</p>
                                                            </div>
                                                            <Switch
                                                                id="email-notifications"
                                                                checked={formData.alert_rules.email_notifications}
                                                                onCheckedChange={(checked) => handleAlertRuleChange('email_notifications', checked)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label htmlFor="webhook-url" className="text-sm font-medium">Webhook URL</Label>
                                                        <Input
                                                            id="webhook-url"
                                                            value={formData.alert_rules.webhook_url}
                                                            onChange={(e) => handleAlertRuleChange('webhook_url', e.target.value)}
                                                            placeholder="https://hooks.slack.com/..."
                                                            className="h-10 form-input-focus transition-all duration-300"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label htmlFor="slack-channel" className="text-sm font-medium">Slack Channel</Label>
                                                        <Input
                                                            id="slack-channel"
                                                            value={formData.alert_rules.slack_channel}
                                                            onChange={(e) => handleAlertRuleChange('slack_channel', e.target.value)}
                                                            placeholder="#hotel-alerts"
                                                            className="h-10 form-input-focus transition-all duration-300"
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>

                                    {/* Data Tab */}
                                    <TabsContent value="data" className="space-y-6 mt-6">
                                        <div
                                            data-section="dataSection"
                                            className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-1000 ease-out ${
                                                isVisible.dataSection
                                                    ? 'opacity-100 translate-y-0'
                                                    : 'opacity-0 translate-y-8'
                                            }`}
                                        >
                                            {/* Data Retention */}
                                            <Card className="lg:col-span-2 border-l-4 border-l-purple-500 transition-all duration-500 ease-out hover-lift">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="flex items-center space-x-3 text-lg">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                                                            <Database className="h-5 w-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <span>Data Retention</span>
                                                            <p className="text-sm text-gray-500 font-normal mt-1">Manage data storage and export settings</p>
                                                        </div>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="retention-window" className="text-sm font-medium">Retention Window (days)</Label>
                                                            <Input
                                                                id="retention-window"
                                                                type="number"
                                                                value={settings.data_retention.retention_window}
                                                                placeholder="90"
                                                                className="h-10 form-input-focus transition-all duration-300"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="export-frequency" className="text-sm font-medium">Export Frequency</Label>
                                                            <Select value={settings.data_retention.export_frequency}>
                                                                <SelectTrigger className="h-10 form-input-focus transition-all duration-300">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="weekly">Weekly</SelectItem>
                                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="space-y-1">
                                                                <Label htmlFor="auto-export" className="text-sm font-medium">Auto Export</Label>
                                                                <p className="text-xs text-gray-500">Automatically export data</p>
                                                            </div>
                                                            <Switch
                                                                id="auto-export"
                                                                checked={settings.data_retention.auto_export}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Currency Settings */}
                                            <Card className="border-l-4 border-l-orange-500 transition-all duration-500 ease-out hover-lift">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="flex items-center space-x-3 text-lg">
                                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                                                            <Globe className="h-5 w-5 text-orange-600" />
                                                        </div>
                                                        <div>
                                                            <span>Currency Settings</span>
                                                            <p className="text-sm text-gray-500 font-normal mt-1">Configure display preferences</p>
                                                        </div>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <div className="space-y-3">
                                                        <Label htmlFor="default-currency" className="text-sm font-medium">Default Currency</Label>
                                                        <Select value={settings.currency.default_currency}>
                                                            <SelectTrigger className="h-10 form-input-focus transition-all duration-300">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {settings.currency.supported_currencies.map((currency) => (
                                                                    <SelectItem key={currency} value={currency}>
                                                                        {currency}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="space-y-1">
                                                                <Label htmlFor="tax-inclusive" className="text-sm font-medium">Tax Inclusive</Label>
                                                                <p className="text-xs text-gray-500">Include taxes in prices</p>
                                                            </div>
                                                            <Switch
                                                                id="tax-inclusive"
                                                                checked={settings.currency.tax_inclusive}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>

                                    {/* Security Tab */}
                                    <TabsContent value="security" className="space-y-6 mt-6">
                                        <div
                                            data-section="securitySection"
                                            className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-1000 ease-out ${
                                                isVisible.securitySection
                                                    ? 'opacity-100 translate-y-0'
                                                    : 'opacity-0 translate-y-8'
                                            }`}
                                        >
                                            {/* Password Management */}
                                            <Card className="border-l-4 border-l-red-500 transition-all duration-500 ease-out hover-lift">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="flex items-center space-x-3 text-lg">
                                                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                                                            <Shield className="h-5 w-5 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <span>Password Management</span>
                                                            <p className="text-sm text-gray-500 font-normal mt-1">Update your account password</p>
                                                        </div>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="space-y-3">
                                                        <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
                                                        <Input
                                                            id="current-password"
                                                            type="password"
                                                            placeholder="Enter current password"
                                                            className="h-10 form-input-focus transition-all duration-300"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                                                        <Input
                                                            id="new-password"
                                                            type="password"
                                                            placeholder="Enter new password"
                                                            className="h-10 form-input-focus transition-all duration-300"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</Label>
                                                        <Input
                                                            id="confirm-password"
                                                            type="password"
                                                            placeholder="Confirm new password"
                                                            className="h-10 form-input-focus transition-all duration-300"
                                                        />
                                                    </div>
                                                    <Button className="w-full h-10 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                                        <Shield className="h-4 w-4 mr-2" />
                                                        Update Password
                                                    </Button>
                                                </CardContent>
                                            </Card>

                                            {/* Two-Factor Authentication */}
                                            <Card className="border-l-4 border-l-indigo-500 transition-all duration-500 ease-out hover-lift">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="flex items-center space-x-3 text-lg">
                                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                                                            <Shield className="h-5 w-5 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <span>Two-Factor Authentication</span>
                                                            <p className="text-sm text-gray-500 font-normal mt-1">Add an extra layer of security</p>
                                                        </div>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-gray-900">Enable 2FA</p>
                                                            <p className="text-sm text-gray-500">Protect your account with two-factor authentication</p>
                                                        </div>
                                                        <Button variant="outline" className="h-10 border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 hover:shadow-md">
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            Setup 2FA
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Active Sessions */}
                                        <Card className="border-l-4 border-l-yellow-500 transition-all duration-500 ease-out hover-lift">
                                            <CardHeader className="pb-4">
                                                <CardTitle className="flex items-center space-x-3 text-lg">
                                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                                                        <Clock className="h-5 w-5 text-yellow-600" />
                                                    </div>
                                                    <div>
                                                        <span>Active Sessions</span>
                                                        <p className="text-sm text-gray-500 font-normal mt-1">Manage your active login sessions</p>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-green-50">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">Current Session</p>
                                                                <p className="text-sm text-gray-500">macOS • Chrome • San Francisco, CA</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="default" className="bg-green-100 text-green-800 transition-all duration-300 hover:scale-105">Active</Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">Previous Session</p>
                                                                <p className="text-sm text-gray-500">Windows • Firefox • New York, NY</p>
                                                            </div>
                                                        </div>
                                                        <Button variant="outline" size="sm" className="h-8 border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300 hover:scale-105 hover:shadow-md">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
}
