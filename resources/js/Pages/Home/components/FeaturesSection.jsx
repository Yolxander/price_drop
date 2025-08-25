import React, { useRef } from 'react';

export default function FeaturesSection({ isVisible }) {
  const carouselRef = useRef(null);

  // Scroll carousel left/right
  const scrollCarousel = (dir) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector(".carousel-card");
    const cardWidth = card ? card.offsetWidth : 300;
    el.scrollBy({ left: dir === "left" ? -cardWidth - 24 : cardWidth + 24, behavior: "smooth" });
  };

  return (
    <section
      data-section="features"
      className={`mx-auto mt-16 mb-16 px-2 md:px-4 transition-all duration-1000 ease-out ${
        isVisible.features
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-lg leading-tight transition-all duration-1000 delay-200 ${
          isVisible.features
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-8'
        }`}>
          How We Help You Save Money
        </h2>
        <div className={`text-gray-500 text-lg max-w-md mt-4 md:mt-0 md:text-right font-medium transition-all duration-1000 delay-400 ${
          isVisible.features
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-8'
        }`}>
          Just add your hotel booking and we'll keep an eye on the prices for you. When rates drop, we'll give you a friendly nudge so you can rebook and save money.
        </div>
      </div>
      {/* Carousel */}
      <div className="relative flex items-center gap-2 md:gap-4">
        {/* Left arrow (desktop only) */}
        <button
          className="hidden md:block bg-white shadow-md rounded-full p-2 text-gray-500 hover:bg-gray-100 absolute left-0 z-10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          onClick={() => scrollCarousel("left")}
          aria-label="Scroll left"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        {/* Hotel Cards */}
        <div
          ref={carouselRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide rounded-2xl bg-white/80 shadow-md px-2 py-4 md:px-4 md:py-6 scroll-smooth snap-x snap-mandatory"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {/* Card 1 */}
          <div className="carousel-card min-w-[260px] max-w-[260px] md:min-w-[450px] md:max-w-[450px] bg-white rounded-3xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-2 hover:border-green-600 hover:scale-105 snap-start hover-lift">
            <div className="h-32 md:h-44 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <svg className="w-16 h-16 md:w-20 md:h-20 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="p-4 md:p-6">
              <div className="text-lg md:text-2xl font-bold">Smart Price Watching</div>
              <div className="text-gray-500 text-sm md:text-base mb-2 font-medium">Our smart system keeps an eye on your hotel's price across all major booking sites, so you don't have to.</div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-gray-300 text-xl">★</span>
                <span className="ml-2 text-gray-500 text-xs md:text-base font-medium">(98 travelers saved)</span>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="carousel-card min-w-[260px] max-w-[260px] md:min-w-[450px] md:max-w-[450px] bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-green-600 snap-start transition-all duration-500 hover:scale-105 hover-lift">
            <div className="h-32 md:h-44 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <svg className="w-16 h-16 md:w-20 md:h-20 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="p-4 md:p-6">
              <div className="text-lg md:text-2xl font-bold">Friendly Price Drop Alerts</div>
              <div className="text-gray-500 text-sm md:text-base mb-2 font-medium">Get a friendly nudge when prices drop, so you can grab the better deal and save money on your stay.</div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-gray-300 text-xl">★</span>
                <span className="ml-2 text-gray-500 text-xs md:text-base font-medium">(122 travelers saved)</span>
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="carousel-card min-w-[260px] max-w-[260px] md:min-w-[450px] md:max-w-[450px] bg-white rounded-3xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-2 hover:border-green-600 hover:scale-105 snap-start hover-lift">
            <div className="h-32 md:h-44 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <svg className="w-16 h-16 md:w-20 md:h-20 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="p-4 md:p-6">
              <div className="text-lg md:text-2xl font-bold">Easy Rebooking</div>
              <div className="text-gray-500 text-sm md:text-base mb-2 font-medium">When prices drop, we make it simple to rebook at the lower rate, so you always get the best deal.</div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-gray-300 text-xl">★</span>
                <span className="ml-2 text-gray-500 text-xs md:text-base font-medium">(85 travelers saved)</span>
              </div>
            </div>
          </div>
          {/* Card 4 */}
          <div className="carousel-card min-w-[260px] max-w-[260px] md:min-w-[450px] md:max-w-[450px] bg-white rounded-3xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-2 hover:border-green-600 hover:scale-105 snap-start hover-lift">
            <div className="h-32 md:h-44 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <svg className="w-16 h-16 md:w-20 md:h-20 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="p-4 md:p-6">
              <div className="text-lg md:text-2xl font-bold">See Your Savings</div>
              <div className="text-gray-500 text-sm md:text-base mb-2 font-medium">Track how much money you've saved and get helpful reports on your travel savings journey.</div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-gray-300 text-xl">★</span>
                <span className="ml-2 text-gray-500 text-xs md:text-base font-medium">(76 travelers saved)</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right arrow (desktop only) */}
        <button
          className="hidden md:block bg-white shadow-md rounded-full p-2 text-gray-500 hover:bg-gray-100 absolute right-0 z-10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          onClick={() => scrollCarousel("right")}
          aria-label="Scroll right"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </section>
  );
}
