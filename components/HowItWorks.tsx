'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Search, Calendar, UserCheck, CheckCircle } from 'lucide-react';
import AnimatedBackground from '@/components/animations/AnimatedBackground';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Choose a Service',
    description:
      'Select the household task you need help with from our available services.',
  },
  {
    number: '02',
    icon: Calendar,
    title: 'Choose Your Time',
    description:
      'Select the date and duration that works best for your schedule.',
  },
  {
    number: '03',
    icon: UserCheck,
    title: 'Get Your RENZA Helper',
    description:
      'RENZA assigns a suitable trained and verified helper for your booking.',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Get It Done',
    description:
      'Your helper arrives and completes the requested household work.',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<HTMLDivElement[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Connector line
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: lineRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Steps - sequential reveal
      stepRefs.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
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
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden section-padding bg-white dark:bg-[#070F0F]"
      aria-labelledby="how-it-works-heading"
    >
      <AnimatedBackground variant="light" />
      <div className="container-renza">
        {/* Heading */}
        <div ref={headingRef} style={{ opacity: 0 }}>
          <SectionHeading
            title="How It Works"
            highlight="Works"
            titleClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
            description="Four easy steps to get reliable household help whenever you need it."
          />
        </div>

        {/* Steps */}
        <div className="mt-14 md:mt-20 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px z-0">
            <div
              ref={lineRef}
              className="h-full bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20"
              style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  ref={(el) => {
                    if (el) stepRefs.current[index] = el;
                  }}
                  className="flex flex-col items-center md:items-center text-center group"
                  style={{ opacity: 0 }}
                >
                  {/* Mobile: vertical connector */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden w-px h-8 bg-gradient-to-b from-primary/40 to-border dark:to-[#1E2E2E] mt-4 mb-0 order-last" />
                  )}

                  {/* Step number + icon */}
                  <div className="relative">
                    {/* Outer ring */}
                    <div className="w-20 h-20 rounded-full border-2 border-border dark:border-[#1E2E2E] bg-white dark:bg-[#0D1B1B] flex items-center justify-center shadow-card dark:shadow-none group-hover:border-primary group-hover:shadow-turquoise transition-all duration-400">
                      <div className="w-14 h-14 rounded-full bg-light-bg dark:bg-[#070F0F] flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                        <Icon
                          size={24}
                          className="text-primary"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      {step.number.slice(-2)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-5">
                    <p className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">
                      Step {step.number}
                    </p>
                    <h3 className="text-base font-bold text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-[200px] mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <button className="btn-primary text-sm px-7 py-3" aria-label="Book a RENZA Helper now">
            Book a Helper Now
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
