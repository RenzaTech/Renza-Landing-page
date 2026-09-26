'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle, ShieldCheck, Star, Sparkles, Clock, Users } from 'lucide-react';
import { gsap } from 'gsap';

export interface SlideData {
  id: string;
  category: string;
  headingLine1: string;
  highlightText: string;
  headingLine2: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  badgeIcon: any;
  badgeTitle: string;
  badgeSubtitle: string;
  priceNote?: string;
  statNumber: string;
  statLabel: string;
}

const HERO_SLIDES: SlideData[] = [
  {
    id: 'cleaning',
    category: 'Home Cleaning & Care',
    headingLine1: 'Deep cleaning for',
    highlightText: 'effortless living',
    headingLine2: 'every single day.',
    description: 'Connect with expert, background-verified cleaning professionals. From deep house cleaning to daily chore support, enjoy a spotless sanctuary.',
    imageSrc: '/images/hero-cleaning.jpg',
    imageAlt: 'Professional RENZA cleaning helper polishing living space',
    badgeIcon: ShieldCheck,
    badgeTitle: 'Verified & Insured',
    badgeSubtitle: '100% background checked staff',
    priceNote: 'Starting from ₹199/hr',
    statNumber: '4.9★',
    statLabel: '15,000+ Cleaned Homes',
  },
  {
    id: 'kitchen',
    category: 'Kitchen & Meal Support',
    headingLine1: 'Fresh home meals,',
    highlightText: 'prepared with care',
    headingLine2: 'in your kitchen.',
    description: 'Skilled cook helpers for daily meal prep, chopping, and kitchen cleanup. Delicious home-cooked comfort without the exhaustion.',
    imageSrc: '/images/hero-kitchen.jpg',
    imageAlt: 'Friendly kitchen helper preparing fresh healthy meal',
    badgeIcon: Star,
    badgeTitle: 'Top-Rated Cooks',
    badgeSubtitle: 'Hygiene & taste guaranteed',
    priceNote: 'Flexible hourly booking',
    statNumber: '98%',
    statLabel: 'Repeat Customer Rate',
  },
  {
    id: 'laundry',
    category: 'Laundry & Wardrobe',
    headingLine1: 'Crisp laundry,',
    highlightText: 'neatly folded',
    headingLine2: 'without lifting a finger.',
    description: 'Washing, ironing, and wardrobe organization on your schedule. Keep your family looking sharp with zero hassle.',
    imageSrc: '/images/hero-laundry.jpg',
    imageAlt: 'RENZA helper ironing and organizing fresh laundry',
    badgeIcon: Sparkles,
    badgeTitle: 'Pristine Care',
    badgeSubtitle: 'Fabric-safe expert handling',
    priceNote: 'Pay only for exact hours',
    statNumber: '30 min',
    statLabel: 'Avg. Arrival Time',
  },
  {
    id: 'booking',
    category: 'On-Demand Booking',
    headingLine1: 'Instant helper dispatch',
    highlightText: 'when life gets busy.',
    headingLine2: 'Help is minutes away.',
    description: 'Unexpected guests? Last-minute party mess? Book an instant RENZA assistant in under 60 seconds with live real-time tracking.',
    imageSrc: '/images/hero-booking.jpg',
    imageAlt: 'Seamless RENZA mobile booking experience with real-time helper',
    badgeIcon: Clock,
    badgeTitle: 'Instant Dispatch',
    badgeSubtitle: 'Real-time arrival tracking',
    priceNote: 'No monthly commitment',
    statNumber: '< 60s',
    statLabel: 'Quick Booking Speed',
  },
  {
    id: 'trust',
    category: 'Trusted Household Network',
    headingLine1: 'A trusted partner',
    highlightText: 'for every home',
    headingLine2: 'in your city.',
    description: 'Empowering thousands of trained helpers while giving homeowners piece of mind, transparency, and reliable daily support.',
    imageSrc: '/images/hero-interaction.jpg',
    imageAlt: 'Happy customer welcoming trusted RENZA helper at home door',
    badgeIcon: Users,
    badgeTitle: 'Community Trust',
    badgeSubtitle: 'Over 50,000+ happy homes',
    priceNote: 'Transparent hourly rates',
    statNumber: '50k+',
    statLabel: 'Satisfied Families',
  },
];

const AUTOPLAY_DURATION = 6000; // 6 seconds per slide

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for animation targets
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTimeline = useRef<gsap.core.Timeline | null>(null);

  const currentSlide = HERO_SLIDES[currentIndex];

  // Function to switch to next slide
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Animate content transition on index change
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content transition: Fade out slightly, slide up new content
      if (contentContainerRef.current) {
        gsap.fromTo(
          contentContainerRef.current.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power3.out',
          }
        );
      }

      // Image transition: Crossfade and subtle scale
      if (imageContainerRef.current) {
        gsap.fromTo(
          imageContainerRef.current,
          { opacity: 0.4, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
        );
      }
    });

    return () => ctx.revert();
  }, [currentIndex]);

  // Handle Autoplay & Progress Bar
  useEffect(() => {
    if (isPaused) {
      if (progressTimeline.current) progressTimeline.current.pause();
      return;
    }

    if (progressBarRef.current) {
      progressTimeline.current = gsap.timeline({
        onComplete: () => {
          goToNext();
        },
      });

      progressTimeline.current.fromTo(
        progressBarRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: AUTOPLAY_DURATION / 1000, ease: 'linear' }
      );
    }

    return () => {
      if (progressTimeline.current) {
        progressTimeline.current.kill();
      }
    };
  }, [currentIndex, isPaused, goToNext]);

  return (
    <div
      className="relative w-full min-h-[620px] lg:min-h-[680px] flex items-center py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">

        {/* ── LEFT COLUMN: Text Content (Col 1 to 6) ── */}
        <div className="lg:col-span-6 flex flex-col justify-center max-w-xl lg:max-w-none">
          
          {/* Category Tag & Slide Counter */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20">
              <Sparkles size={13} className="animate-pulse" />
              {currentSlide.category}
            </span>
            <span className="text-xs font-mono font-medium text-text-muted">
              0{currentIndex + 1} / 0{HERO_SLIDES.length}
            </span>
          </div>

          {/* Animated Text Block */}
          <div ref={contentContainerRef} className="space-y-6">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-[1.15]">
              {currentSlide.headingLine1}{' '}
              <span className="gradient-text block sm:inline">{currentSlide.highlightText}</span>{' '}
              {currentSlide.headingLine2}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-lg">
              {currentSlide.description}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                className="btn-primary text-base py-3.5 px-7 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                aria-label="Book a household helper now"
              >
                Book a Helper
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              
              <button
                className="btn-secondary text-base py-3.5 px-6 border-border hover:bg-surface-hover transition-all"
                aria-label="Explore all RENZA services"
              >
                Explore Services
              </button>
            </div>

            {/* Price & Guarantee Note */}
            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-text-secondary">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-primary flex-shrink-0" />
                <span>
                  {currentSlide.priceNote || 'Starting at ₹199/hour'}
                </span>
              </div>
              <span className="text-border hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-primary flex-shrink-0" />
                <span>No long-term contracts</span>
              </div>
            </div>

          </div>

          {/* Navigation Controls & Category Tabs */}
          <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Slide Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    idx === currentIndex
                      ? 'bg-primary text-slate-950 font-bold shadow-md shadow-primary/20 scale-105'
                      : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${slide.category}`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrev}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary hover:bg-primary/10 transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              
              <button
                onClick={goToNext}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary hover:bg-primary/10 transition-all"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>

          </div>

          {/* Auto-play Progress Bar */}
          <div className="mt-3 w-full h-1 bg-surface rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-primary origin-left rounded-full"
            />
          </div>

        </div>

        {/* ── RIGHT COLUMN: Editorial Lifestyle Photograph (Col 7 to 12) ── */}
        <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
          
          <div
            ref={imageContainerRef}
            className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-[14/11] rounded-3xl overflow-hidden shadow-2xl border border-primary/20 bg-slate-900 group"
          >
            {/* Main Lifestyle Image */}
            <Image
              src={currentSlide.imageSrc}
              alt={currentSlide.imageAlt}
              fill
              priority
              className="object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 540px"
            />

            {/* Ambient Image Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

            {/* Top Badge Overlay: Feature Highlighting */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-950/70 border border-primary/30 backdrop-blur-md shadow-xl">
              <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                {React.createElement(currentSlide.badgeIcon, { size: 16 })}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">
                  {currentSlide.badgeTitle}
                </p>
                <p className="text-[10px] text-primary font-medium">
                  {currentSlide.badgeSubtitle}
                </p>
              </div>
            </div>

            {/* Bottom Floating Stat Badge */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 py-3 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md shadow-2xl flex items-center gap-3">
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-primary leading-none block">
                  {currentSlide.statNumber}
                </span>
                <span className="text-[11px] font-medium text-slate-300">
                  {currentSlide.statLabel}
                </span>
              </div>
            </div>

            {/* Decorative Corner Glow */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

          </div>

        </div>

      </div>
    </div>
  );
}
