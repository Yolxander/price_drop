import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPin } from 'lucide-react';

export default function DashboardBannerSection({ canRegister, isVisible }) {
  return (
    <section
      data-section="banner"
      className={`relative w-full h-[600px] rounded-3xl overflow-hidden mx-auto mt-12 transition-all duration-1000 ease-out ${
        isVisible.banner
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      <img
        src="/dashboard.png"
        alt="Your Travel Savings Hub"
        className="object-cover w-full h-full absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col md:flex-row md:items-end md:justify-between z-10">
        <div className={`transition-all duration-1000 delay-300 ${
          isVisible.banner
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-8'
        }`}>
          <div className="mb-2">
            <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">Your Travel Hub</span>
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4">Your Personal<br />Travel Savings Hub</h2>
          <div className="flex items-center gap-6 text-white/90 text-base font-medium">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <span>All My Trips</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Always Watching Prices</span>
            </div>
          </div>
        </div>
        <Button className={`mt-8 md:mt-0 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-10 py-4 rounded-full text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl btn-hover-effect ${
          isVisible.banner
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-8'
        }`} asChild>
          <Link href={canRegister}>Get Started Free</Link>
        </Button>
      </div>
    </section>
  );
}
