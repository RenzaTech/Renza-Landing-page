'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import AnimatedBackground from '@/components/animations/AnimatedBackground';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
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
      className="relative overflow-hidden py-16 md:py-20 bg-white dark:bg-[#070F0F]"
      aria-labelledby="cta-heading"
    >
      <AnimatedBackground variant="cta" />
      <div className="container-renza">
        <div
          ref={contentRef}
          className="relative rounded-3xl overflow-hidden"
          style={{ opacity: 0 }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-secondary to-dark" />

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/8 blur-3xl translate-y-1/2 -translate-x-1/4" aria-hidden="true" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, #00D2C4 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
            aria-hidden="true"
          />

          {/* Horizontal accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" aria-hidden="true" />

          {/* Content */}
          <div className="relative z-10 px-8 py-14 md:px-16 md:py-20 text-center">
            {/* Heading */}
            <h2
              id="cta-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto"
            >
              Your household.{' '}
              <span className="gradient-text">Your schedule.</span>{' '}
              Your RENZA Helper.
            </h2>

            {/* Description */}
            <p className="mt-5 text-base text-white/60 max-w-lg mx-auto leading-relaxed">
              Whenever household work piles up, RENZA is ready to help.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                className="btn-primary text-sm md:text-base py-3.5 px-8 shadow-turquoise"
                aria-label="Book a RENZA Helper now"
              >
                Book a Helper
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 font-semibold rounded-xl px-6 py-3.5 text-sm md:text-base transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                aria-label="Explore RENZA services"
              >
                Explore Services
              </button>
            </div>

            {/* Trust note */}
            <p className="mt-8 text-white/30 text-xs">
              Trained helpers · Verified · On-demand · Starting at ₹199/hour
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
