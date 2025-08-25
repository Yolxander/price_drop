import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function DreamGetawaySection({ canRegister, isVisible }) {
  return (
    <section
      data-section="dream"
      className={`relative w-full max-w-8xl mx-auto mt-20 mb-20 transition-all duration-1000 ease-out ${
        isVisible.dream
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Background Image with Overlay */}
      <div className="relative rounded-3xl overflow-hidden">
        <img
          src="/hotel/hotel-booking.jpg"
          alt="Office Collaboration"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/50 "></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          {/* DOWNLOAD APP Button */}
          <Button
            variant="outline"
            className="mb-6 border-white text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full px-8 py-3"
          >
            DOWNLOAD APP
          </Button>

          {/* Main Title */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready To Save Money?
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white max-w-2xl mb-8 leading-relaxed">
            Download PricePulse now and start saving hundreds on your hotel bookings. Get instant price alerts and never overpay again.
          </p>

          {/* Download Now Button */}
          <Button
            className="bg-yellow-300 hover:bg-yellow-400 text-text font-semibold px-10 py-4 rounded-full text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            asChild
          >
            <Link href={canRegister}>
              Download Now
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
