import React from 'react';

export default function BenefitsSection({ isVisible }) {
  return (
    <section
      data-section="benefits"
      className={`w-full max-w-8xl mx-auto mt-20 mb-20 px-4 py-16 transition-all duration-1000 ease-out relative min-h-[600px] ${
        isVisible.benefits
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 ">
        <img
          src="hotel/night-time-hotel.jpeg"
          alt="Mystery Hotel Background"
          className="w-full h-full object-cover rounded-3xl opacity-100"
        />
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-8 relative z-10">
        <div className="flex-1">
          {/* Badge */}
          <div className="inline-block bg-white border border-gray-300 rounded-full px-4 py-2 mb-6">
            <span className="text-gray-900 text-sm font-semibold uppercase tracking-wide">KEY BENEFITS</span>
          </div>

          {/* Title */}
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-white max-w-2xl leading-tight mb-6 transition-all duration-1000 delay-200 ${
            isVisible.benefits
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}>
            <span className="text-yellow-300">Save Money</span> on Every Booking
          </h2>
        </div>

        {/* Description */}
        <div className={`flex-1 max-w-md transition-all duration-1000 delay-400 ${
          isVisible.benefits
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-lg text-white leading-relaxed">
            Stop overpaying for hotels! Our smart price monitoring system tracks prices 24/7 and alerts you instantly when rates drop, so you can rebook and save money.
          </p>
        </div>
      </div>

      {/* Benefits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Real-time Monitoring Card */}
        <div className={`bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-2xl shadow-lg p-8 transition-all duration-500 hover:shadow-xl hover:scale-105 ${
          isVisible.benefits
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
          <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">24/7 Price Watching</h3>
          <p className="text-white leading-relaxed">
            We watch hotel prices across all major booking sites 24/7, so you don't have to. When prices drop, we catch it instantly.
          </p>
        </div>

        {/* Instant Notifications Card */}
        <div className={`bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-2xl shadow-lg p-8 transition-all duration-500 hover:shadow-xl hover:scale-105 ${
          isVisible.benefits
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
          <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Instant Money-Saving Alerts</h3>
          <p className="text-white leading-relaxed">
            Get notified immediately when prices drop. Never miss a chance to save money - rebook at the lower rate and pocket the difference.
          </p>
        </div>

        {/* Smart Analytics Card */}
        <div className={`bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-2xl shadow-lg p-8 transition-all duration-500 hover:shadow-xl hover:scale-105 ${
          isVisible.benefits
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
          <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Track Your Savings</h3>
          <p className="text-white leading-relaxed">
            Track your savings and see exactly how much money you've saved. Get insights to make smarter booking decisions in the future.
          </p>
        </div>
      </div>
    </section>
  );
}
