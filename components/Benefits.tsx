'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Calendar, Users, Clock, Plus } from 'lucide-react';
import AnimatedBackground from '@/components/animations/AnimatedBackground';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: Calendar,
    title: 'Need help occasionally?',
    description:
      'Book only when you need assistance. No lock-in, no recurring cost.',
    accent: 'from-primary/10 to-primary/5',
  },
  {
    icon: Users,
    title: "Don't want a permanent maid?",
    description:
      'Get reliable household help temporarily without managing a full-time arrangement.',
    accent: 'from-dark/5 to-dark/2',
  },
  {
    icon: Clock,
    title: 'Busy with everyday life?',
    description:
      'Let RENZA handle basic household tasks while you focus on what matters most.',
    accent: 'from-primary/10 to-primary/5',
  },
  {
    icon: Plus,
    title: 'Need extra help?',
    description:
      'Book additional hours or more frequent sessions whenever your schedule demands it.',
    accent: 'from-dark/5 to-dark/2',
  },
];

export default function Benefits() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      const cards = cardsRef.current?.querySelectorAll('.benefit-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden section-padding bg-white dark:bg-[#070F0F]"
      aria-labelledby="benefits-heading"
    >
      <AnimatedBackground variant="light" />
      <div className="container-renza">
        {/* Heading */}
        <div ref={headingRef} style={{ opacity: 0 }}>
          <SectionHeading
            title="Customer Benefits"
            highlight="Benefits"
            titleClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
            description="RENZA is designed for anyone who needs reliable household help — on their own schedule."
          />
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className={`benefit-card group relative overflow-hidden card-base p-7 md:p-8 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300`}
                style={{ opacity: 0 }}
                aria-label={benefit.title}
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.accent} pointer-events-none`}
                  aria-hidden="true"
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#070F0F] border border-border dark:border-[#1E2E2E] flex items-center justify-center mb-5 shadow-sm group-hover:bg-primary group-hover:border-primary group-hover:shadow-turquoise transition-all duration-300">
                    <Icon
                      size={22}
                      className="text-primary group-hover:text-white transition-colors duration-300"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-text-primary mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
