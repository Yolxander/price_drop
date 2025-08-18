import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    BarChart3,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
    Building2,
    FileText,
    Bell,
    TrendingDown,
    History,
    Globe,
    Activity,
    ChevronLeft,
    ChevronRight,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

export default function AuthenticatedLayout({ user, header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const navigation = [
        { name: 'My Trips', href: '/dashboard', icon: Home },
        { name: 'All Bookings', href: '/bookings', icon: Building2 },
        { name: 'Calendar', href: '/calendar', icon: Calendar },
        { name: 'Price Pulses', href: '/price-alerts', icon: Bell },
        { name: 'Past Prices', href: '/price-history', icon: TrendingDown },
        { name: 'Savings & Trends', href: '/reports', icon: BarChart3 },
        { name: 'Preferences', href: '/settings', icon: Settings },
    ];

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
                    <div className="flex h-16 items-center justify-between px-4">
                        <h1 className="text-xl font-semibold text-sidebar-foreground">Dashboard</h1>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    <Separator />
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User profile and logout at bottom of mobile sidebar */}
                    <div className="border-t border-sidebar-border p-4 space-y-2">
                        <div className="flex items-center space-x-3 p-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar} alt={user?.name} />
                                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start">
                                <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
                                <p className="text-xs text-sidebar-foreground/70">{user?.email}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Log out
                        </Button>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-48'}`}>
                <div className="flex flex-col flex-grow bg-sidebar border-r border-sidebar-border">
                    <div className="flex h-16 items-center justify-between px-4">
                        {!sidebarCollapsed && <h1 className="text-xl font-semibold text-sidebar-foreground">Dashboard</h1>}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="h-8 w-8"
                        >
                            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        </Button>
                    </div>
                    <Separator />
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                title={sidebarCollapsed ? item.name : undefined}
                            >
                                <item.icon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                {!sidebarCollapsed && item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User profile and logout at bottom of desktop sidebar */}
                    <div className="border-t border-sidebar-border p-4 space-y-2">
                        {sidebarCollapsed ? (
                            <>
                                <div className="flex justify-center">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.avatar} alt={user?.name} />
                                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    className="w-full h-10 p-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    title="Log out"
                                >
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center space-x-3 p-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.avatar} alt={user?.name} />
                                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start">
                                        <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
                                        <p className="text-xs text-sidebar-foreground/70">{user?.email}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                >
                                    <LogOut className="mr-3 h-5 w-5" />
                                    Log out
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-48'}`}>
                {/* Top navigation */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>

                    {/* Page Header */}
                    {header && (
                        <div className="flex-1">
                            <h1 className="text-2xl font-semibold text-foreground">{header}</h1>
                        </div>
                    )}

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1" />
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
