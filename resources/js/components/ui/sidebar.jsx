import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Home,
    Grid3X3,
    Bell,
    Heart,
    Settings,
    LogOut
} from 'lucide-react';

export default function Sidebar({ activePage = 'dashboard' }) {
    const navigationItems = [
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
            icon: Bell,
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
            label: 'Favorite',
            page: 'favorites'
        },
        {
            href: '/settings',
            icon: Settings,
            label: 'Settings',
            page: 'settings'
        }
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">T</span>
                    </div>
                                            <span className="text-xl font-bold text-yellow-600">Price Pulse</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.page;

                    return (
                        <Link key={item.href} href={item.href} className="block">
                            <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                                isActive
                                    ? 'bg-gray-100'
                                    : 'hover:bg-gray-50'
                            }`}>
                                {item.hasNotification ? (
                                    <div className="relative">
                                        <Icon className={`h-5 w-5 ${
                                            isActive ? 'text-yellow-600' : 'text-gray-600'
                                        }`} />
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                            <span className="text-xs text-white font-medium">{item.notificationCount}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <Icon className={`h-5 w-5 ${
                                        isActive ? 'text-yellow-600' : 'text-gray-600'
                                    }`} />
                                )}
                                <span className={`${
                                    isActive
                                        ? 'font-medium text-gray-900'
                                        : 'text-gray-700'
                                }`}>
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <Link href="/" className="w-full">
                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <LogOut className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700">Log Out</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
