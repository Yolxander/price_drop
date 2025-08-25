import React from 'react';

export default function WhyChooseSection({ isVisible }) {
  return (
    <section
      data-section="why-choose"
      className={`w-full max-w-7xl mx-auto mt-20 mb-20 px-4 transition-all duration-1000 ease-out ${
        isVisible['why-choose']
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Main Title */}
      <div className="text-center mb-16">
        <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-lg leading-tight mx-auto mb-6 transition-all duration-1000 delay-200 ${
          isVisible['why-choose']
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
          Why Choose PricePulse?
        </h2>
        <p className={`text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
          isVisible['why-choose']
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
          PricePulse provides smart price monitoring, automated alerts, and real-time savings tracking to help you never overpay for hotels again.
        </p>
      </div>

      {/* Main Content with Phone and Feature Cards */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
        {/* Left Side Feature Cards */}
        <div className="flex flex-col gap-6 w-full lg:w-72">
          {/* Top Left Card */}
          <div className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-500 hover:shadow-xl hover:scale-105 ${
            isVisible['why-choose']
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-8'
          }`}>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Analytics</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Monitor your savings with intelligent price tracking and detailed insights.
            </p>
          </div>

          {/* Bottom Left Card */}
          <div className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-500 hover:shadow-xl hover:scale-105 ${
            isVisible['why-choose']
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-8'
          }`}>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Price Alerts</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get instant notifications when hotel prices drop so you can save money.
            </p>
          </div>
        </div>

        {/* Center Phone Image */}
        <div className={`flex-shrink-0 transition-all duration-1000 delay-200 ${
          isVisible['why-choose']
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95'
        }`}>
          <img
            src="/mobile/Home.png"
            alt="PricePulse Mobile App"
            className="w-80 h-auto object-contain"
          />
        </div>

        {/* Right Side Feature Cards */}
        <div className="flex flex-col gap-6 w-full lg:w-72">
          {/* Top Right Card */}
          <div className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-500 hover:shadow-xl hover:scale-105 ${
            isVisible['why-choose']
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-8'
          }`}>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Alerts</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Customized price monitoring based on your travel preferences and budget.
            </p>
          </div>

          {/* Bottom Right Card */}
          <div className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-500 hover:shadow-xl hover:scale-105 ${
            isVisible['why-choose']
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-8'
          }`}>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get expert recommendations and real-time analysis of hotel pricing trends.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
