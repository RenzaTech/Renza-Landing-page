'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, Clock, Users, Sparkles } from 'lucide-react';
import AnimatedBackground from '@/components/animations/AnimatedBackground';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    value: '₹199',
    unit: '/hr',
    label: 'Simple Hourly Pricing',
    icon: Sparkles,
    description: 'No complicated fees',
  },
  {
    value: 'Verified',
    unit: '',
    label: 'Helpers',
    icon: CheckCircle,
    description: 'Screened & onboarded',
  },
  {
    value: 'On-Demand',
    unit: '',
    label: 'Booking',
    icon: Clock,
    description: 'Book when you need it',
  },
  {
    value: 'Reliable',
    unit: '',
    label: 'Household Help',
    icon: Users,
    description: 'For everyone',
  },
];

export default function TrustStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-12 md:py-16 bg-white dark:bg-[#070F0F] border-y border-border dark:border-[#1E2E2E]"
      aria-label="RENZA key statistics"
    >
      <AnimatedBackground variant="light" />
      <div className="container-renza">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                ref={(el) => {
                  if (el) itemsRef.current[index] = el;
                }}
                className="flex flex-col items-center text-center group"
                style={{ opacity: 0 }}
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#0D1B1B] border border-border dark:border-[#1E2E2E] flex items-center justify-center mb-3 shadow-sm group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <Icon
                    size={20}
                    className="text-primary group-hover:text-white transition-colors duration-300"
                    aria-hidden="true"
                  />
                </div>

                {/* Value */}
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl md:text-3xl font-bold text-text-primary">
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-sm font-semibold text-primary">{stat.unit}</span>
                  )}
                </div>

                {/* Label */}
                <p className="text-sm font-semibold text-text-primary mt-0.5">{stat.label}</p>
                <p className="text-xs text-text-secondary mt-0.5">{stat.description}</p>

                {/* Divider accent */}
                <div className="w-8 h-0.5 rounded-full bg-primary/30 mt-2 group-hover:bg-primary group-hover:w-12 transition-all duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
