'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/ui/SectionHeading';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import {
  UserCheck,
  ShieldCheck,
  GraduationCap,
  ClipboardList,
  Headphones,
  FileText,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const trustFeatures = [
  {
    icon: UserCheck,
    title: 'Identity Verification',
    description:
      'RENZA conducts identity checks on helpers as part of the onboarding process.',
  },
  {
    icon: ShieldCheck,
    title: 'Helper Screening',
    description:
      'Helpers go through a screening process before being onboarded to the platform.',
  },
  {
    icon: GraduationCap,
    title: 'Training',
    description:
      'Helpers are trained on the household services offered through RENZA.',
  },
  {
    icon: ClipboardList,
    title: 'Service Guidelines',
    description:
      'RENZA maintains clear guidelines for service delivery and helper conduct.',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    description:
      'RENZA support is available to help customers with their bookings and concerns.',
  },
  {
    icon: FileText,
    title: 'Booking Records',
    description:
      'Every booking is recorded, providing transparency for both customers and helpers.',
  },
];

export default function TrustSafety() {
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

      const cards = cardsRef.current?.querySelectorAll('.trust-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
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
      aria-labelledby="trust-safety-heading"
    >
      <AnimatedBackground variant="light" />
      <div className="container-renza">
        {/* Heading */}
        <div ref={headingRef} style={{ opacity: 0 }}>
          <SectionHeading
            title="Trust & Safety"
            highlight="Safety"
            titleClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
            description="RENZA manages the helper lifecycle — from onboarding and training to the service experience — so you don't have to."
          />
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {trustFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="trust-card group card-base p-6 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
                style={{ opacity: 0 }}
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/15 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <Icon
                    size={20}
                    className="text-primary group-hover:text-white transition-colors duration-300"
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <h3 className="text-sm font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-10 text-center">
          <p className="text-text-secondary text-sm max-w-lg mx-auto">
            RENZA is building a platform focused on creating reliable, managed
            household help experiences for customers and fair opportunities for
            helpers.
          </p>
        </div>
      </div>
    </section>
  );
}
