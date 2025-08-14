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
import {
    Home,
    Grid3X3,
    Bell,
    Heart,
    Settings,
    LogOut,
    Save,
    RefreshCw,
    Shield,
    Users,
    Database,
    Globe,
    Bell as BellIcon,
    Clock,
    DollarSign,
    Key,
    Eye,
    EyeOff,
    Trash2,
    Plus,
    Edit,
    CheckCircle,
    AlertCircle,
    Building2,
    Zap,
    Download,
    Upload
} from 'lucide-react';

export default function SettingsIndex({ auth, settings, stats }) {
    const [activeTab, setActiveTab] = useState('providers');
    const [showApiKeys, setShowApiKeys] = useState(false);
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

    const handleApiKeyChange = (providerKey, apiKey) => {
        setFormData(prev => ({
            ...prev,
            providers: {
                ...prev.providers,
                [providerKey]: {
                    ...prev.providers[providerKey],
                    api_key: apiKey
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
                    <Link href="/calendar" className="block">
                        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Calendar</span>
                        </div>
                    </Link>
                    <Link href="/price-alerts" className="block">
                        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <div className="relative">
                                <Bell className="h-5 w-5 text-gray-600" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">2</span>
                                </div>
                            </div>
                            <span className="text-gray-700">Price Drops</span>
                        </div>
                    </Link>
                    <Link href="/favorites" className="block">
                        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <Heart className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Favorite</span>
                        </div>
                    </Link>
                    <Link href="/settings" className="block">
                        <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                            <Settings className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-gray-900">Settings</span>
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
                <Head title="Settings" />

                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                            <p className="text-gray-600 mt-1">Manage your account preferences and integrations</p>
                        </div>
                        <div className="flex items-center space-x-3">
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
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Building2 className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Active Providers</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.active_providers}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Users className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Team Members</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.team_members}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Database className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Storage Used</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.storage_used}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <Download className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Last Backup</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatDate(stats.last_backup)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Settings Tabs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuration</CardTitle>
                                <CardDescription>
                                    Manage your integrations, alerts, and preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid w-full grid-cols-5">
                                        <TabsTrigger value="providers" className="flex items-center space-x-2">
                                            <Building2 className="h-4 w-4" />
                                            <span>Providers</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="alerts" className="flex items-center space-x-2">
                                            <BellIcon className="h-4 w-4" />
                                            <span>Alerts</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="team" className="flex items-center space-x-2">
                                            <Users className="h-4 w-4" />
                                            <span>Team</span>
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
                                    <TabsContent value="providers" className="space-y-6">
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
                                                                <Button variant="outline" size="sm">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {provider.enabled && (
                                                            <div className="mt-4 space-y-3">
                                                                <div>
                                                                    <Label htmlFor={`api-key-${key}`} className="text-sm font-medium">
                                                                        API Key
                                                                    </Label>
                                                                    <div className="relative mt-1">
                                                                        <Input
                                                                            id={`api-key-${key}`}
                                                                            type={showApiKeys ? "text" : "password"}
                                                                            value={provider.api_key || ''}
                                                                            onChange={(e) => handleApiKeyChange(key, e.target.value)}
                                                                            placeholder="Enter API key..."
                                                                            className="pr-10"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                            onClick={() => setShowApiKeys(!showApiKeys)}
                                                                        >
                                                                            {showApiKeys ? (
                                                                                <EyeOff className="h-4 w-4" />
                                                                            ) : (
                                                                                <Eye className="h-4 w-4" />
                                                                            )}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    {/* Alerts Tab */}
                                    <TabsContent value="alerts" className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center space-x-2">
                                                        <DollarSign className="h-5 w-5" />
                                                        <span>Price Alert Rules</span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div>
                                                        <Label htmlFor="global-threshold">Global Threshold ($)</Label>
                                                        <Input
                                                            id="global-threshold"
                                                            type="number"
                                                            value={formData.alert_rules.global_threshold}
                                                            onChange={(e) => handleAlertRuleChange('global_threshold', parseFloat(e.target.value))}
                                                            placeholder="50.00"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="global-percentage">Global Percentage (%)</Label>
                                                        <Input
                                                            id="global-percentage"
                                                            type="number"
                                                            value={formData.alert_rules.global_percentage}
                                                            onChange={(e) => handleAlertRuleChange('global_percentage', parseFloat(e.target.value))}
                                                            placeholder="5.0"
                                                        />
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-1">
                                                            <Label htmlFor="quiet-start">Quiet Hours Start</Label>
                                                            <Input
                                                                id="quiet-start"
                                                                type="time"
                                                                value={formData.alert_rules.quiet_hours_start}
                                                                onChange={(e) => handleAlertRuleChange('quiet_hours_start', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <Label htmlFor="quiet-end">Quiet Hours End</Label>
                                                            <Input
                                                                id="quiet-end"
                                                                type="time"
                                                                value={formData.alert_rules.quiet_hours_end}
                                                                onChange={(e) => handleAlertRuleChange('quiet_hours_end', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center space-x-2">
                                                        <BellIcon className="h-5 w-5" />
                                                        <span>Notifications</span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <Label htmlFor="email-notifications">Email Notifications</Label>
                                                            <p className="text-sm text-gray-500">Receive alerts via email</p>
                                                        </div>
                                                        <Switch
                                                            id="email-notifications"
                                                            checked={formData.alert_rules.email_notifications}
                                                            onCheckedChange={(checked) => handleAlertRuleChange('email_notifications', checked)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="webhook-url">Webhook URL</Label>
                                                        <Input
                                                            id="webhook-url"
                                                            value={formData.alert_rules.webhook_url}
                                                            onChange={(e) => handleAlertRuleChange('webhook_url', e.target.value)}
                                                            placeholder="https://hooks.slack.com/..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="slack-channel">Slack Channel</Label>
                                                        <Input
                                                            id="slack-channel"
                                                            value={formData.alert_rules.slack_channel}
                                                            onChange={(e) => handleAlertRuleChange('slack_channel', e.target.value)}
                                                            placeholder="#hotel-alerts"
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>

                                    {/* Team Tab */}
                                    <TabsContent value="team" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle>Team Members</CardTitle>
                                                        <CardDescription>Manage access to your account</CardDescription>
                                                    </div>
                                                    <Button>
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Member
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {settings.team.members.map((member) => (
                                                        <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-gray-600">
                                                                        {member.name.split(' ').map(n => n[0]).join('')}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{member.name}</p>
                                                                    <p className="text-sm text-gray-500">{member.email}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-3">
                                                                <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                                                                    {member.role}
                                                                </Badge>
                                                                <Button variant="outline" size="sm">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Data Tab */}
                                    <TabsContent value="data" className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center space-x-2">
                                                        <Database className="h-5 w-5" />
                                                        <span>Data Retention</span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div>
                                                        <Label htmlFor="retention-window">Retention Window (days)</Label>
                                                        <Input
                                                            id="retention-window"
                                                            type="number"
                                                            value={settings.data_retention.retention_window}
                                                            placeholder="90"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <Label htmlFor="auto-export">Auto Export</Label>
                                                            <p className="text-sm text-gray-500">Automatically export data</p>
                                                        </div>
                                                        <Switch
                                                            id="auto-export"
                                                            checked={settings.data_retention.auto_export}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="export-frequency">Export Frequency</Label>
                                                        <Select value={settings.data_retention.export_frequency}>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center space-x-2">
                                                        <Globe className="h-5 w-5" />
                                                        <span>Currency Settings</span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div>
                                                        <Label htmlFor="default-currency">Default Currency</Label>
                                                        <Select value={settings.currency.default_currency}>
                                                            <SelectTrigger>
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
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <Label htmlFor="tax-inclusive">Tax Inclusive</Label>
                                                            <p className="text-sm text-gray-500">Include taxes in prices</p>
                                                        </div>
                                                        <Switch
                                                            id="tax-inclusive"
                                                            checked={settings.currency.tax_inclusive}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>

                                    {/* Security Tab */}
                                    <TabsContent value="security" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center space-x-2">
                                                    <Shield className="h-5 w-5" />
                                                    <span>Security Settings</span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label htmlFor="current-password">Current Password</Label>
                                                        <Input
                                                            id="current-password"
                                                            type="password"
                                                            placeholder="Enter current password"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="new-password">New Password</Label>
                                                        <Input
                                                            id="new-password"
                                                            type="password"
                                                            placeholder="Enter new password"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                        <Input
                                                            id="confirm-password"
                                                            type="password"
                                                            placeholder="Confirm new password"
                                                        />
                                                    </div>
                                                    <Button className="w-full">
                                                        <Shield className="h-4 w-4 mr-2" />
                                                        Update Password
                                                    </Button>
                                                </div>

                                                <Separator />

                                                <div className="space-y-4">
                                                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-gray-900">Enable 2FA</p>
                                                            <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                                        </div>
                                                        <Button variant="outline">
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            Setup 2FA
                                                        </Button>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div className="space-y-4">
                                                    <h3 className="font-medium text-gray-900">Active Sessions</h3>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                            <div>
                                                                <p className="font-medium text-gray-900">Current Session</p>
                                                                <p className="text-sm text-gray-500">macOS • Chrome • San Francisco, CA</p>
                                                            </div>
                                                            <Badge variant="default">Active</Badge>
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                            <div>
                                                                <p className="font-medium text-gray-900">Previous Session</p>
                                                                <p className="text-sm text-gray-500">Windows • Firefox • New York, NY</p>
                                                            </div>
                                                            <Button variant="outline" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
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
