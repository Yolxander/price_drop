import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

export default function DreamGetawaySection({ canRegister, isVisible }) {
  return (
    <section
      data-section="dream"
      className={`w-full max-w-7xl mx-auto mt-20 flex flex-col md:flex-row items-center justify-between gap-12 transition-all duration-1000 ease-out ${
        isVisible.dream
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Left: Large Image */}
      <div className={`flex-1 flex justify-center transition-all duration-1000 delay-200 ${
        isVisible.dream
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 -translate-x-8'
      }`}>
        <div className="rounded-3xl overflow-hidden w-[420px] h-[420px] transition-all duration-500 hover:scale-105 hover:shadow-2xl image-hover">
          <img
            src="/hotel/1_Hotel_ReceptionV2h1281.webp"
            alt="Hotel Reception"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      {/* Right: Text and Button */}
      <div className={`flex-1 flex flex-col items-center md:items-start justify-center max-w-2xl text-center md:text-left transition-all duration-1000 delay-400 ${
        isVisible.dream
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-8'
      }`}>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-lg leading-tight mb-6">Never Overpay for<br />Your Dream Hotel Again</h2>
        <p className="text-lg text-gray-700 mb-8">Join thousands of smart travelers who save hundreds on every trip. Our friendly price alerts ensure you always get the best rates, even after you've already booked.</p>
        <Button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-8 py-4 rounded-full text-lg shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl mb-10 mx-auto md:mx-0 btn-hover-effect" asChild>
          <Link href={canRegister}>
            Start Saving Money Today!
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
