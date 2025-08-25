import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function HeroSection({ canLogin, canRegister, isVisible }) {
  return (
    <section
      data-section="hero"
      className={`relative w-full h-[500px] md:h-[700px] rounded-3xl overflow-hidden mx-auto mt-6 shadow-lg transition-all duration-1000 ease-out ${
        isVisible.hero
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      <img
        src="/hotel/hotel-main.jpg"
        alt="Hotel price tracking hero"
        className={`object-cover w-full h-full absolute inset-0 transition-all duration-1500 ease-out ${
          isVisible.hero
            ? 'scale-100 opacity-100'
            : 'scale-110 opacity-80'
        }`}
      />
      <div className={`absolute inset-0 bg-black/50 transition-all duration-1000 ease-out ${
        isVisible.hero
          ? 'opacity-100'
          : 'opacity-0'
      }`} />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        {/* Main Title with enhanced animation */}
        <h1 className={`text-white text-3xl md:text-6xl font-bold tracking-tight text-center leading-tight drop-shadow-lg transition-all duration-1200 ease-out ${
          isVisible.hero
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-12 scale-95'
        }`} style={{ transitionDelay: '200ms' }}>
          Never Overpay Again with<br />
          <span className={`text-yellow-300 transition-all duration-1200 ease-out ${
            isVisible.hero
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '400ms' }}>
            Smart Price Alerts
          </span>
        </h1>

        {/* Subtext & Stats with staggered animations */}
        <div className={`flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mt-6 md:mt-8 transition-all duration-1000 ease-out ${
          isVisible.hero
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '600ms' }}>
          <div className={`text-white text-sm md:text-base font-medium md:text-left text-center max-w-md px-4 md:px-0 transition-all duration-1000 ease-out ${
            isVisible.hero
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-8'
          }`} style={{ transitionDelay: '800ms' }}>
            Get friendly alerts when hotel prices drop after you book. Our smart system watches 100+ booking sites and finds you better deals, so you can save hundreds on every trip.
          </div>

          <div className={`flex gap-6 md:gap-8 mt-4 md:mt-0 text-white text-center transition-all duration-1000 ease-out ${
            isVisible.hero
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-8'
          }`} style={{ transitionDelay: '1000ms' }}>
            <div className={`stats-item transition-all duration-500 ease-out hover:scale-110 hover:text-yellow-300 ${
              isVisible.hero
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '1200ms' }}>
              <div className="text-2xl md:text-3xl font-bold">$500+</div>
              <div className="text-xs opacity-80 font-medium">Average Savings</div>
            </div>
            <div className={`stats-item transition-all duration-500 ease-out hover:scale-110 hover:text-yellow-300 ${
              isVisible.hero
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '1400ms' }}>
              <div className="text-2xl md:text-3xl font-bold">100+</div>
              <div className="text-xs opacity-80 font-medium">Sites We Watch</div>
            </div>
            <div className={`stats-item transition-all duration-500 ease-out hover:scale-110 hover:text-yellow-300 ${
              isVisible.hero
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '1600ms' }}>
              <div className="text-2xl md:text-3xl font-bold">24/7</div>
              <div className="text-xs opacity-80 font-medium">Always Watching</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons with enhanced animations */}
        <div className={`flex flex-col sm:flex-row gap-4 mt-8 transition-all duration-1000 ease-out ${
          isVisible.hero
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-8 scale-95'
        }`} style={{ transitionDelay: '1800ms' }}>
          <Button
            size="lg"
            className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-8 py-4 rounded-full text-lg shadow-lg transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:bg-yellow-400 transform hover:-translate-y-1"
            asChild
          >
            <Link href={canRegister}>
              Start Saving Money Today!
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-500 ease-out hover:scale-105 hover:border-yellow-300 hover:text-yellow-300 transform hover:-translate-y-1"
            asChild
          >
            <Link href={canLogin}>
              Welcome Back
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
