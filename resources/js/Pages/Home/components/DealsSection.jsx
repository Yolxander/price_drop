import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Bell } from 'lucide-react';

export default function DealsSection({ isVisible, deals }) {
  return (
    <section
      data-section="deals"
      className={`mx-auto mt-16 mb-16 px-2 md:px-4 transition-all duration-1000 ease-out ${
        isVisible.deals
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-lg leading-tight transition-all duration-1000 delay-200 ${
          isVisible.deals
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-8'
        }`}>
          Hot Deals & Price Drops
        </h2>
        <div className={`text-gray-500 text-lg max-w-md mt-4 md:mt-0 md:text-right font-medium transition-all duration-1000 delay-400 ${
          isVisible.deals
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-8'
        }`}>
          Discover amazing hotel deals and track prices with our smart monitoring system.
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <div key={deal.id} className={`bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-105 border-2 ${
            deal.hasActivePriceWatch ? 'border-yellow-400 animate-pulse' : 'border-transparent'
          }`}>
            <div className="relative">
              <img
                src={deal.image}
                alt={deal.name}
                className="w-full h-48 object-cover"
              />
              {deal.hasActivePriceWatch && (
                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                  🔥 Active Watch
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {deal.price}/night
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{deal.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{deal.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{deal.location}</span>
                </div>
                <div className="flex items-center gap-1">
                   {[...Array(5)].map((_, index) => (
                     <span key={index} className={`text-lg ${
                       index < Math.floor(deal.rating) ? 'text-yellow-400' : 'text-gray-300'
                     }`}>
                       ★
                     </span>
                   ))}
                   <span className="text-sm text-gray-500 ml-1">({deal.rating})</span>
                 </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">
                  View Deal
                </Button>
                {deal.hasActivePriceWatch ? (
                  <Button variant="outline" className="border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                    <Bell className="h-4 w-4 mr-2" />
                    Watching
                  </Button>
                ) : (
                  <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                    <Bell className="h-4 w-4 mr-2" />
                    Set Alert
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
