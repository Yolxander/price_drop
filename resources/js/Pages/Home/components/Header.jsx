import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Building, Menu, X } from 'lucide-react';

export default function Header({ canLogin, canRegister }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-6">
        {/* Logo */}
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
            <Link href="/about">
              <Building className="h-4 w-4 mr-2" />
              About
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link href="/contact">
              <Building className="h-4 w-4 mr-2" />
              Contact
            </Link>
          </Button>

          {/* Login/Register Buttons */}
          <div className="ml-auto flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-black text-black hover:bg-black hover:text-white"
              asChild
            >
              <Link href={canLogin}>
                Login
              </Link>
            </Button>
            <Button
              className="rounded-full bg-black text-white hover:bg-gray-800"
              size="sm"
              asChild
            >
              <Link href={canRegister}>
                Register
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/top-hotels"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Top Hotels
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 pb-2 border-t border-gray-200">
              <Link
                href={canLogin}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href={canRegister}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
