import React from 'react';

export default function BenefitsSection({ isVisible }) {
  return (
    <section
      data-section="benefits"
      className={`w-full max-w-7xl mx-auto mt-20 mb-20 px-4 transition-all duration-1000 ease-out ${
        isVisible.benefits
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-8">
        <div className="flex-1">
          {/* Badge */}
          <div className="inline-block bg-white border border-gray-300 rounded-full px-4 py-2 mb-6">
            <span className="text-gray-900 text-sm font-semibold uppercase tracking-wide">KEY BENEFITS</span>
          </div>

          {/* Title */}
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-2xl leading-tight mb-6 transition-all duration-1000 delay-200 ${
            isVisible.benefits
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}>
            Why Choose PricePulse
          </h2>
        </div>

        {/* Description */}
        <div className={`flex-1 max-w-md transition-all duration-1000 delay-400 ${
          isVisible.benefits
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-lg text-gray-700 leading-relaxed">
            Experience the smartest way to save money on your hotel bookings with our advanced price monitoring technology.
          </p>
        </div>
      </div>

      {/* Benefits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Real-time Monitoring Card */}
        <div className={`bg-white rounded-2xl shadow-lg p-8 transition-all duration-500 hover:shadow-xl hover:scale-105 ${
          isVisible.benefits
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-time Monitoring</h3>
          <p className="text-gray-600 leading-relaxed">
            Our advanced algorithms continuously monitor hotel prices across all major booking platforms in real-time.
          </p>
        </div>

        {/* Instant Notifications Card */}
        <div className={`bg-blue-200 rounded-2xl shadow-lg p-8 transition-all duration-500 hover:shadow-xl hover:scale-105 ${
          isVisible.benefits
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
          <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-blue-900 mb-4">Instant Notifications</h3>
          <p className="text-blue-800 leading-relaxed">
            Get immediate alerts when prices drop, ensuring you never miss an opportunity to save money on your stay.
          </p>
        </div>

        {/* Smart Analytics Card */}
        <div className={`bg-white rounded-2xl shadow-lg p-8 transition-all duration-500 hover:shadow-xl hover:scale-105 ${
          isVisible.benefits
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Analytics</h3>
          <p className="text-gray-600 leading-relaxed">
            Access detailed insights and trends to make informed decisions about your travel bookings and savings.
          </p>
        </div>
      </div>
    </section>
  );
}
