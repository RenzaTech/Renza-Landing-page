'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CheckCircle, ArrowRight } from 'lucide-react';
import AnimatedBackground from '@/components/background/AnimatedBackground';

gsap.registerPlugin(ScrollTrigger);

const pricingFeatures = [
  'Trained Helper',
  'Verified Helper',
  'Flexible Duration',
  'Easy Booking',
  'RENZA Managed Service',
];

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden section-padding bg-white dark:bg-[#070F0F]"
      aria-labelledby="pricing-heading"
    >
      <AnimatedBackground theme="light" />
      <div className="container-renza">
        {/* Heading */}
        <SectionHeading
          badge="Pricing"
          title="Only pay for the help you need."
          highlight="help you need."
          description="No subscriptions. No hidden fees. Just simple hourly household help."
        />

        {/* Pricing Card */}
        <div className="mt-12 flex justify-center">
          <div
            ref={cardRef}
            className="relative w-full max-w-sm"
            style={{ opacity: 0 }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-primary/15 blur-2xl scale-105" aria-hidden="true" />

            {/* Card */}
            <div className="relative bg-white dark:bg-[#0D1B1B] rounded-3xl border border-border dark:border-[#1E2E2E] shadow-turquoise-lg overflow-hidden">
              {/* Card header */}
              <div className="bg-gradient-to-br from-dark to-dark-secondary p-7 pb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/20 blur-2xl" aria-hidden="true" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <span className="text-white font-bold text-sm">R</span>
                    </div>
                    <span className="text-white font-semibold text-sm">RENZA Helper</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-white/70 text-lg font-medium">₹</span>
                    <span className="text-5xl font-bold text-white">199</span>
                    <span className="text-white/60 text-base">/hour</span>
                  </div>
                  <p className="text-white/50 text-xs mt-2">
                    Billed per hour of service
                  </p>
                </div>
              </div>

              {/* Card features */}
              <div className="p-7">
                <ul className="space-y-3.5 mb-7">
                  {pricingFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle size={13} className="text-primary" aria-hidden="true" />
                      </div>
                      <span className="text-sm text-text-primary font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className="btn-primary w-full justify-center text-sm py-3.5"
                  aria-label="Book a RENZA Helper"
                >
                  Book a Helper
                  <ArrowRight size={15} aria-hidden="true" />
                </button>

                {/* Note */}
                <p className="text-center text-xs text-text-secondary mt-4">
                  No long-term commitment required
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-text-secondary mt-10 max-w-md mx-auto">
          No complicated pricing. Just simple hourly household help.
        </p>
      </div>
    </section>
  );
}
