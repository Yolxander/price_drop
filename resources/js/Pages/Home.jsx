import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';

import Footer from './components/Footer';
import {
  Header,
  HeroSection,
  BenefitsSection,
  DealsSection,
  DashboardBannerSection,
  DreamGetawaySection,
  WhyChooseSection
} from './Home/components';

export default function Home({ canLogin, canRegister }) {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    benefits: false,
    deals: false,
    banner: false,
    dream: false,
    'why-choose': false
  });

  // Sample deals data
  const deals = [
    {
      id: 1,
      name: "Excellence Riviera Cancun",
      description: "Luxury all-inclusive resort with stunning ocean views",
      location: "Riviera Maya, Mexico",
      price: "$299",
      rating: 4.9,
      image: "/hotel/excellence-riviera-cancun-one-of-the-best-resorts-in-the-world.jpg",
      hasActivePriceWatch: true
    },
    {
      id: 2,
      name: "Atrium Palace Resort",
      description: "Family-friendly resort with water park and spa",
      location: "Crete, Greece",
      price: "$189",
      rating: 4.2,
      image: "/hotel/Atrium-Palace-Thalasso-Spa-Resort-Villas.jpg",
      hasActivePriceWatch: false
    },
    {
      id: 3,
      name: "Lindos Grand Resort",
      description: "Boutique luxury resort with infinity pools",
      location: "Rhodes, Greece",
      price: "$245",
      rating: 4.8,
      image: "/hotel/Lindos-Grand-Resort-pool_bu.jpg",
      hasActivePriceWatch: true
    }
  ];

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

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Head title="PricePulse - Save Money After You Book" />

      <Header canLogin={canLogin} canRegister={canRegister} />

      <main className="bg-[#f9f9f9] px-2 md:px-6">
        <HeroSection
          canLogin={canLogin}
          canRegister={canRegister}
          isVisible={isVisible}
        />

        <WhyChooseSection isVisible={isVisible} />

        <BenefitsSection isVisible={isVisible} />

        {/* <DealsSection isVisible={isVisible} deals={deals} /> */}

        <DashboardBannerSection
          canRegister={canRegister}
          isVisible={isVisible}
        />

        <DreamGetawaySection
          canRegister={canRegister}
          isVisible={isVisible}
        />
      </main>

      {/* Footer Section */}
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
