'use client';

import SplashScreen from '@/components/splash/SplashScreen';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustStats from '@/components/TrustStats';
import Services from '@/components/Services';
import HowItWorks from '@/components/HowItWorks';
import WhyRenza from '@/components/WhyRenza';
import TrustSafety from '@/components/TrustSafety';
import Benefits from '@/components/Benefits';
import CTA from '@/components/CTA';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <SplashScreen />
      <main id="landing-page-content" className="overflow-x-hidden">
        <Navbar />
        <Hero />
        <TrustStats />
        <Services />
        <HowItWorks />
        <WhyRenza />
        <TrustSafety />
        <Benefits />
        <CTA />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}
