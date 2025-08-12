import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
    BarChart3, 
    Users, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    Home,
    Package,
    FileText,
    Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

export default function AuthenticatedLayout({ user, header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Users', href: '/users', icon: Users },
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
        { name: 'Documents', href: '/documents', icon: FileText },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
                    <div className="flex h-16 items-center justify-between px-4">
                        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
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
                                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                    <div className="flex h-16 items-center px-4">
                        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                    </div>
                    <Separator />
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top navigation */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1" />
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-6 w-6" />
                            </Button>
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user?.avatar} alt={user?.name} />
                                            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user?.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {header && (
                            <div className="mb-8">
                                <h1 className="text-2xl font-semibold text-gray-900">{header}</h1>
                            </div>
                        )}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
