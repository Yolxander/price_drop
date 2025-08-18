import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, Eye, EyeOff, Building, Sparkles, Shield, CheckCircle } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9]">
            <Head title="Create Account - PricePulse" />

            {/* Header */}
            <header className="top-header sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full flex h-14 items-center justify-between px-6">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <img src="/logo/price-pulse-logo.png" alt="PricePulse Logo" className="h-8 w-auto" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full border-b-2 border-yellow-300 hover:scale-105 transition-all duration-300"
                            asChild
                        >
                            <Link href="/" className="flex items-center">
                                <Building className="h-4 w-4 mr-2" />
                                Home
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full hover:scale-105 transition-all duration-300"
                            asChild
                        >
                            <Link href="/top-hotels">
                                <Building className="h-4 w-4 mr-2" />
                                Top Hotels
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full hover:scale-105 transition-all duration-300"
                            asChild
                        >
                            <Link href="/mystery-booking" className="flex items-center">
                                <Sparkles className="h-4 w-4 mr-2" />
                                Mystery Booking
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full hover:scale-105 transition-all duration-300"
                            asChild
                        >
                            <Link href="/travel-insurance" className="flex items-center">
                                <Shield className="h-4 w-4 mr-2" />
                                Travel Insurance
                            </Link>
                        </Button>

                        <div className="ml-auto flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-black text-black hover:bg-black hover:text-white"
                                asChild
                            >
                                <Link href="/login">
                                    Login
                                </Link>
                            </Button>
                            <Button
                                className="rounded-full bg-black text-white hover:bg-gray-800"
                                asChild
                            >
                                <Link href="/register">
                                    Register
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="bg-[#f9f9f9] px-2 md:px-6">
                {/* Hero Section with Register Form */}
                <section className="relative w-full h-[500px] md:h-[700px] rounded-3xl overflow-hidden mx-auto mt-6 shadow-lg">
                    <img
                        src="/hotel/hotel-main.jpg"
                        alt="Hotel price tracking hero"
                        className="object-cover w-full h-full absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-black/50" />

                    {/* Register Form Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 w-full max-w-2xl shadow-2xl">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    Join PricePulse
                                </h1>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Create your account and start saving money on every hotel booking
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-300"
                                            autoComplete="name"
                                            autoFocus
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-300"
                                            autoComplete="username"
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                        {errors.email && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={data.password}
                                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-300"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.password}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-300"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.password_confirmation}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold py-3 px-6 rounded-lg text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="my-6 flex items-center">
                                <div className="flex-1 border-t border-gray-300"></div>
                                <span className="px-4 text-sm text-gray-500">or</span>
                                <div className="flex-1 border-t border-gray-300"></div>
                            </div>

                            {/* Login Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-4">
                                    Already have an account?{' '}
                                    <Link
                                        href="/login"
                                        className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


            </main>
        </div>
    );
}
