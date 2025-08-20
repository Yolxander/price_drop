import React, { useRef, useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, MapPin, Calendar as CalendarIcon, User as UserIcon, ChevronDown, Search as SearchIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Footer from './components/Footer';
import { LogOut, Bell, Calendar, Users, DollarSign, Building, Search, Menu, X, LayoutDashboard, Sparkles, Shield } from 'lucide-react';

export default function Home({ canLogin, canRegister }) {
  const carouselRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    banner: false,
    dream: false
  });

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target.dataset.section;
          if (section && !isVisible[section]) {
            setIsVisible(prev => ({ ...prev, [section]: true }));
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));

    // Trigger hero animation immediately
    setIsVisible(prev => ({ ...prev, hero: true }));

    return () => observer.disconnect();
  }, []);

  // Scroll carousel left/right
  const scrollCarousel = (dir) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector(".carousel-card");
    const cardWidth = card ? card.offsetWidth : 300;
    el.scrollBy({ left: dir === "left" ? -cardWidth - 24 : cardWidth + 24, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Head title="PricePulse - Save Money After You Book" />

      <header className="top-header sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex h-14 items-center justify-between px-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo/price-pulse-logo.png" alt="PricePulse Logo" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full border-b-2 border-yellow-300 hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/" className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/top-hotels">
                <Building className="h-4 w-4 mr-2" />
                Dream Hotels
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/mystery-booking" className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Surprise Deals
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/travel-insurance" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Travel Protection
              </Link>
            </Button>

            <div className="ml-auto flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-black text-black hover:bg-black hover:text-white"
                asChild
              >
                <Link href={canLogin}>
                  Login
                </Link>
              </Button>
              <Button
                className="rounded-full bg-black text-white hover:bg-gray-800"
                asChild
              >
                <Link href={canRegister}>
                  Register
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t animate-in slide-in-from-top-2 duration-300">
            <div className="w-full px-6 py-4 space-y-4">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/top-hotels" className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Dream Hotels
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/mystery-booking" className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Surprise Deals
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/travel-insurance" className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Travel Protection
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-black text-black hover:bg-black hover:text-white"
                  asChild
                >
                  <Link href={canLogin}>
                    Login
                  </Link>
                </Button>
                <Button
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  asChild
                >
                  <Link href={canRegister}>
                    Register
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="bg-[#f9f9f9] px-2 md:px-6">
        {/* Hero Section */}
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
            className="object-cover w-full h-full absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
            <h1 className={`text-white text-3xl md:text-6xl font-bold tracking-tight text-center leading-tight drop-shadow-lg transition-all duration-1000 delay-300 animate-float ${
              isVisible.hero
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}>
              Never Overpay Again with<br /><span className="text-yellow-300">Smart Price Alerts</span>
            </h1>

            {/* Subtext & Stats */}
            <div className={`flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mt-6 md:mt-8 transition-all duration-1000 delay-500 ${
              isVisible.hero
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}>
              <div className="text-white text-sm md:text-base font-medium md:text-left text-center max-w-md px-4 md:px-0">
                Get friendly alerts when hotel prices drop after you book. Our smart system watches 100+ booking sites and finds you better deals, so you can save hundreds on every trip.
              </div>
              <div className="flex gap-6 md:gap-8 mt-4 md:mt-0 text-white text-center">
                <div className="stats-item animate-pulse hover:scale-110 transition-transform duration-300">
                  <div className="text-2xl md:text-3xl font-bold">$500+</div>
                  <div className="text-xs opacity-80 font-medium">Average Savings</div>
                </div>
                <div className="stats-item animate-pulse hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
                  <div className="text-2xl md:text-3xl font-bold">100+</div>
                  <div className="text-xs opacity-80 font-medium">Sites We Watch</div>
                </div>
                <div className="stats-item animate-pulse hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.4s' }}>
                  <div className="text-2xl md:text-3xl font-bold">24/7</div>
                  <div className="text-xs opacity-80 font-medium">Always Watching</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 mt-8 transition-all duration-1000 delay-700 ${
              isVisible.hero
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}>
              <Button
                size="lg"
                className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-8 py-4 rounded-full text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                asChild
              >
                <Link href={canRegister}>
                  Start Saving Money Today!
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href={canLogin}>
                  Welcome Back
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Top-rated Hotel Section */}
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

        {/* Dashboard Introduction Banner Section */}
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

        {/* Dream Getaway Section */}
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
      </main>

      {/* Footer Section */}
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
