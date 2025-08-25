import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Trophy, Play, MessageCircle, Bell, User, Home, BarChart3 } from 'lucide-react';

export default function DashboardBannerSection({ canRegister, isVisible }) {
  const [expandedFeatures, setExpandedFeatures] = useState({
    '01': true,
    '02': false,
    '03': false,
    '04': false
  });

  const toggleFeature = (featureId) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
  };

  return (
    <section
      data-section="banner"
      className={`w-full max-w-5xl mx-auto mt-20 mb-20 px-4 transition-all duration-1000 ease-out ${
        isVisible.banner
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-center gap-16">
        {/* Left Section: Mobile App Mockup */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <div className="relative bg-transparent">
            {/* Phone Image */}
            <img
              src="/mobile/DropsDetails.png"
              alt="Mobile App Interface"
              className="w-80 h-auto"
            />
          </div>
        </div>

        {/* Right Section: Descriptive Text and Features */}
        <div className="flex-1 max-w-lg">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Smart Price Drop Detection & Alerts
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Our advanced AI system continuously monitors your hotel bookings across all major platforms, instantly detecting price drops and sending you personalized alerts to maximize your savings.
          </p>

          {/* Feature List */}
          <div className="space-y-0">
            {/* Feature 01 */}
            <div className="border-b border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFeature('01')}
                className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-600">01</span>
                  <h3 className="text-lg font-semibold text-gray-900">Price Drop Detection</h3>
                </div>
                <div className={`transition-transform duration-300 ease-in-out ${
                  expandedFeatures['01'] ? 'rotate-180' : 'rotate-0'
                }`}>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
              </button>
              <div className={`transition-all duration-500 ease-in-out ${
                expandedFeatures['01']
                  ? 'max-h-32 opacity-100 pb-4 px-4'
                  : 'max-h-0 opacity-0 pb-0 px-4'
              }`}>
                <p className="text-gray-600 leading-relaxed">
                  Advanced algorithms scan hundreds of booking sites simultaneously, instantly identifying when your hotel's price drops below your booking rate.
                </p>
              </div>
            </div>

            {/* Feature 02 */}
            <div className="border-b border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFeature('02')}
                className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-600">02</span>
                  <h3 className="text-lg font-semibold text-gray-900">Instant Smart Alerts</h3>
                </div>
                <div className={`transition-transform duration-300 ease-in-out ${
                  expandedFeatures['02'] ? 'rotate-180' : 'rotate-0'
                }`}>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
              </button>
              <div className={`transition-all duration-500 ease-in-out ${
                expandedFeatures['02']
                  ? 'max-h-32 opacity-100 pb-4 px-4'
                  : 'max-h-0 opacity-0 pb-0 px-4'
              }`}>
                <p className="text-gray-600 leading-relaxed">
                  Receive intelligent notifications only when significant savings are available, with personalized recommendations on when to rebook for maximum value.
                </p>
              </div>
            </div>

            {/* Feature 03 */}
            <div className="border-b border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFeature('03')}
                className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-600">03</span>
                  <h3 className="text-lg font-semibold text-gray-900">Booking Optimization</h3>
                </div>
                <div className={`transition-transform duration-300 ease-in-out ${
                  expandedFeatures['03'] ? 'rotate-180' : 'rotate-0'
                }`}>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
              </button>
              <div className={`transition-all duration-500 ease-in-out ${
                expandedFeatures['03']
                  ? 'max-h-32 opacity-100 pb-4 px-4'
                  : 'max-h-0 opacity-0 pb-0 px-4'
              }`}>
                <p className="text-gray-600 leading-relaxed">
                  Smart analysis determines the optimal rebooking strategy, considering cancellation policies, new rates, and potential savings to maximize your benefits.
                </p>
              </div>
            </div>

            {/* Feature 04 */}
            <div className="border-b border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFeature('04')}
                className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-600">04</span>
                  <h3 className="text-lg font-semibold text-gray-900">Savings Analytics</h3>
                </div>
                <div className={`transition-transform duration-300 ease-in-out ${
                  expandedFeatures['04'] ? 'rotate-180' : 'rotate-0'
                }`}>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
              </button>
              <div className={`transition-all duration-500 ease-in-out ${
                expandedFeatures['04']
                  ? 'max-h-32 opacity-100 pb-4 px-4'
                  : 'max-h-0 opacity-0 pb-0 px-4'
              }`}>
                <p className="text-gray-600 leading-relaxed">
                  Track your total savings over time, analyze price trends, and get insights to make smarter booking decisions for future trips.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
