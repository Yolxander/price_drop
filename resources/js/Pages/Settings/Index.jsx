import React, { useState } from 'react';
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
    const [formData, setFormData] = useState({
        providers: settings.providers,
        alert_rules: settings.alert_rules,
        check_frequency: settings.check_frequency,
        currency: settings.currency
    });

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
                <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search settings..."
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" className="flex items-center space-x-2">
                                <RefreshCw className="h-4 w-4" />
                                <span>Refresh</span>
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Settings Tabs */}
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Configuration</CardTitle>
                                <CardDescription>
                                    Manage your integrations, alerts, and preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="providers" className="flex items-center space-x-2">
                                            <Building2 className="h-4 w-4" />
                                            <span>Providers</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="alerts" className="flex items-center space-x-2">
                                            <BellIcon className="h-4 w-4" />
                                            <span>Alerts</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="data" className="flex items-center space-x-2">
                                            <Database className="h-4 w-4" />
                                            <span>Data</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="security" className="flex items-center space-x-2">
                                            <Shield className="h-4 w-4" />
                                            <span>Security</span>
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Providers Tab */}
                                    <TabsContent value="providers" className="space-y-6 mt-6">
                                        <div className="space-y-4">
                                            {Object.entries(formData.providers).map(([key, provider]) => (
                                                <Card key={key} className="border-l-4 border-l-blue-500">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                    <Building2 className="h-6 w-6 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                                                                    <div className="flex items-center space-x-2 mt-1">
                                                                        <Badge className={getProviderStatusColor(provider)}>
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
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            {/* Price Alert Rules */}
                                            <Card className="lg:col-span-2 border-l-4 border-l-blue-500">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="flex items-center space-x-3 text-lg">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <DollarSign className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                        <span>Price Alert Rules</span>
                                                            <p className="text-sm text-gray-500 font-normal mt-1">Configure price drop thresholds and rules</p>
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
                                                                className="h-10"
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
                                                                className="h-10"
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
                                                                    className="h-10"
                                                            />
                                                        </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="quiet-end" className="text-xs text-gray-500">End Time</Label>
                                                            <Input
                                                                id="quiet-end"
                                                                type="time"
                                                                value={formData.alert_rules.quiet_hours_end}
                                                                onChange={(e) => handleAlertRuleChange('quiet_hours_end', e.target.value)}
                                                                    className="h-10"
                                                            />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Notifications */}
                                            <Card className="border-l-4 border-l-green-500">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="flex items-center space-x-3 text-lg">
                                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
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
                                                            className="h-10"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label htmlFor="slack-channel" className="text-sm font-medium">Slack Channel</Label>
                                                        <Input
                                                            id="slack-channel"
                                                            value={formData.alert_rules.slack_channel}
                                                            onChange={(e) => handleAlertRuleChange('slack_channel', e.target.value)}
                                                            placeholder="#hotel-alerts"
                                                            className="h-10"
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>

                                    {/* Data Tab */}
                                    <TabsContent value="data" className="space-y-6 mt-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            {/* Data Retention */}
                                            <Card className="lg:col-span-2 border-l-4 border-l-purple-500">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="flex items-center space-x-3 text-lg">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
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
                                                                className="h-10"
                                                        />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="export-frequency" className="text-sm font-medium">Export Frequency</Label>
                                                        <Select value={settings.data_retention.export_frequency}>
                                                                <SelectTrigger className="h-10">
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
                                            <Card className="border-l-4 border-l-orange-500">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="flex items-center space-x-3 text-lg">
                                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
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
                                                            <SelectTrigger className="h-10">
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
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Password Management */}
                                            <Card className="border-l-4 border-l-red-500">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="flex items-center space-x-3 text-lg">
                                                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
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
                                                            className="h-10"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                                                        <Input
                                                            id="new-password"
                                                            type="password"
                                                            placeholder="Enter new password"
                                                            className="h-10"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</Label>
                                                        <Input
                                                            id="confirm-password"
                                                            type="password"
                                                            placeholder="Confirm new password"
                                                            className="h-10"
                                                        />
                                                    </div>
                                                    <Button className="w-full h-10">
                                                        <Shield className="h-4 w-4 mr-2" />
                                                        Update Password
                                                    </Button>
                                                </CardContent>
                                            </Card>

                                            {/* Two-Factor Authentication */}
                                            <Card className="border-l-4 border-l-indigo-500">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="flex items-center space-x-3 text-lg">
                                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
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
                                                        <Button variant="outline" className="h-10">
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            Setup 2FA
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                                </div>

                                        {/* Active Sessions */}
                                        <Card className="border-l-4 border-l-yellow-500">
                                            <CardHeader className="pb-4">
                                                <CardTitle className="flex items-center space-x-3 text-lg">
                                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
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
                                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">Current Session</p>
                                                                <p className="text-sm text-gray-500">macOS • Chrome • San Francisco, CA</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">Previous Session</p>
                                                                <p className="text-sm text-gray-500">Windows • Firefox • New York, NY</p>
                                                            </div>
                                                        </div>
                                                        <Button variant="outline" size="sm" className="h-8">
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
        </div>
    );
}
