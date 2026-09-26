'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/ui/SectionHeading';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import {
  ShieldCheck,
  GraduationCap,
  Clock,
  Calendar,
  Smartphone,
  Headphones,
  CheckCircle2,
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface WhyRenzaItem {
  id: number;
  number: string;
  title: string;
  highlight: string;
  icon: React.ElementType;
  description: string;
  backTitle: string;
  backPoints: string[];
}

const whyRenzaData: WhyRenzaItem[] = [
  {
    id: 1,
    number: '01',
    title: 'Verified Helpers',
    highlight: 'Verified',
    icon: ShieldCheck,
    description:
      'RENZA handles helper verification before they are made available on the platform.',
    backTitle: 'Safety & Trust First',
    backPoints: [
      'Government ID & Aadhaar verification',
      'Thorough screening for every helper',
      'Verified track record before visits',
    ],
  },
  {
    id: 2,
    number: '02',
    title: 'Trained Helpers',
    highlight: 'Trained',
    icon: GraduationCap,
    description:
      'Helpers receive training for the household services offered through RENZA.',
    backTitle: 'Professional Quality',
    backPoints: [
      'Standardized home cleaning SOPs',
      'Kitchen hygiene & vessel handling',
      'Trained in respectful home etiquette',
    ],
  },
  {
    id: 3,
    number: '03',
    title: 'Simple Hourly Pricing',
    highlight: 'Hourly Pricing',
    icon: Clock,
    description:
      'Customers can book help based on the time they actually need.',
    backTitle: 'Transparent & Fair',
    backPoints: [
      'Starting at just ₹199 per hour',
      'Pay strictly for the hours booked',
      'Zero hidden charges or surprise fees',
    ],
  },
  {
    id: 4,
    number: '04',
    title: 'No Permanent Commitment',
    highlight: 'Commitment',
    icon: Calendar,
    description:
      'Book when you need help instead of maintaining a permanent maid arrangement.',
    backTitle: 'Freedom On Your Terms',
    backPoints: [
      'Zero lock-in or recurring contracts',
      'No monthly fixed maid salaries',
      'Book on-demand whenever needed',
    ],
  },
  {
    id: 5,
    number: '05',
    title: 'Easy Booking',
    highlight: 'Booking',
    icon: Smartphone,
    description:
      'Select your service, duration and time, then book in just a few taps.',
    backTitle: 'Instant & Convenient',
    backPoints: [
      'Book in less than 60 seconds',
      'Select exact date and time slot',
      'Reschedule or cancel easily in app',
    ],
  },
  {
    id: 6,
    number: '06',
    title: 'RENZA Managed',
    highlight: 'Managed',
    icon: Headphones,
    description:
      'RENZA coordinates the helper and service experience end to end.',
    backTitle: 'Full Customer Care',
    backPoints: [
      'Dedicated customer care team',
      'Prompt replacement support if needed',
      'Continuous service quality checks',
    ],
  },
];

export default function WhyRenza() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sPathRef = useRef<SVGPathElement>(null);
  const sPathTrackRef = useRef<SVGPathElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Track flipped state for mobile taps and click interactions
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const toggleFlip = (id: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Heading entrance
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // 2. Animated S-shaped line stroke draw on scroll
      if (sPathRef.current) {
        const pathLength = sPathRef.current.getTotalLength();
        gsap.set(sPathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(sPathRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: 'top 75%',
            end: 'bottom 85%',
            scrub: 0.8,
          },
        });
      }

      // 3. Staggered 3D Flip Card Reveals
      const cards = cardsContainerRef.current?.querySelectorAll('.why-card-row');
      cards?.forEach((row, i) => {
        const isLeft = i % 2 === 0;
        const cardInner = row.querySelector('.why-card-wrapper');
        const nodeDot = row.querySelector('.timeline-node');

        if (cardInner) {
          gsap.fromTo(
            cardInner,
            {
              opacity: 0,
              x: isLeft ? -35 : 35,
              scale: 0.96,
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.65,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        if (nodeDot) {
          gsap.fromTo(
            nodeDot,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.45,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: row,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="why-renza"
      ref={sectionRef}
      className="relative overflow-hidden py-14 md:py-20 bg-white dark:bg-[#070F0F] transition-colors duration-500"
      aria-labelledby="why-renza-heading"
    >
      <AnimatedBackground variant="light" />

      <div className="container-renza relative z-10">
        {/* Section Heading */}
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <SectionHeading
            title="Why RENZA"
            highlight="RENZA"
            titleClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
            description="Everything you need to know about why thousands choose RENZA over traditional domestic help."
          />
        </div>

        {/* ======================================================== */}
        {/* Compact Alternating S-Curve Timeline with Clean 3D Cards */}
        {/* ======================================================== */}
        <div ref={cardsContainerRef} className="relative max-w-4xl mx-auto">
          {/* SVG line + milestone dots — all in one coordinate space (Desktop only) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-4 bottom-6 w-36 pointer-events-none hidden md:block z-20"
            aria-hidden="true"
          >
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 100 800"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="sLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00D2C4" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#00b8ab" stopOpacity="1" />
                  <stop offset="100%" stopColor="#00D2C4" stopOpacity="0.8" />
                </linearGradient>
                <filter id="lineGlow" x="-30%" y="-5%" width="160%" height="110%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Dashed background track */}
              <path
                ref={sPathTrackRef}
                d="M 50 0 C 20 65, 20 65, 50 130 C 80 195, 80 195, 50 260 C 20 325, 20 325, 50 390 C 80 455, 80 455, 50 520 C 20 585, 20 585, 50 650 C 80 715, 80 715, 50 780"
                stroke="#00D2C4"
                strokeWidth="1.5"
                strokeDasharray="5 6"
                strokeOpacity="0.18"
              />

              {/* Animated glowing S-curve (draws on scroll via GSAP) */}
              <path
                ref={sPathRef}
                d="M 50 0 C 20 65, 20 65, 50 130 C 80 195, 80 195, 50 260 C 20 325, 20 325, 50 390 C 80 455, 80 455, 50 520 C 20 585, 20 585, 50 650 C 80 715, 80 715, 50 780"
                stroke="url(#sLineGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#lineGlow)"
              />

              {/*
                Milestone dots drawn at the exact bezier anchor points so
                the line passes through the centre of every node.
                Path anchors: M 50 0 … 50 130 … 50 260 … 50 390 … 50 520 … 50 650
              */}
              {([0, 130, 260, 390, 520, 650] as number[]).map((y, i) => (
                <g key={i}>
                  {/* Soft glow halo */}
                  <circle cx="50" cy={y} r="12" fill="#00D2C4" fillOpacity="0.12" />
                  {/* Outer ring */}
                  <circle cx="50" cy={y} r="9" fill="#071313" stroke="#00D2C4" strokeWidth="2.5" />
                  {/* Inner filled dot */}
                  <circle cx="50" cy={y} r="4" fill="#00D2C4" />
                </g>
              ))}
            </svg>
          </div>

          {/* Mobile Straight Guide Line */}
          <div
            className="md:hidden absolute left-5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#00D2C4] via-[#00D2C4]/40 to-[#00D2C4] pointer-events-none"
            aria-hidden="true"
          />

          {/* Cards List - Compact Spacing */}
          <div className="space-y-4 md:space-y-5 relative z-10">
            {whyRenzaData.map((item, index) => {
              const isLeft = index % 2 === 0;
              const isFlipped = Boolean(flippedCards[item.id]);
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className={`why-card-row relative flex flex-col md:flex-row items-center ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Card Column */}
                  <div
                    className={`w-full md:w-1/2 pl-12 md:pl-0 ${
                      isLeft ? 'md:pr-10 md:flex md:justify-end' : 'md:pl-10 md:flex md:justify-start'
                    }`}
                  >
                    {/* 3D Flip Card Container - Compact Dimensions */}
                    <div
                      className="why-card-wrapper w-full max-w-[390px] h-[135px] sm:h-[140px] cursor-pointer group"
                      style={{ perspective: '1200px' }}
                      onClick={() => toggleFlip(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleFlip(item.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${item.title} card. Click to flip for more details.`}
                    >
                      {/* Inner 3D Box */}
                      <div
                        className={`relative w-full h-full duration-700 transition-transform ${
                          isFlipped ? '[transform:rotateY(180deg)]' : 'group-hover:[transform:rotateY(180deg)]'
                        }`}
                        style={{
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        {/* ========================================= */}
                        {/* FRONT FACE (Clean, no bottom hint)        */}
                        {/* ========================================= */}
                        <div
                          className="absolute inset-0 w-full h-full rounded-2xl bg-white dark:bg-[#0C1818] border border-slate-200/90 dark:border-slate-800 px-5 py-4 shadow-sm hover:shadow-md hover:border-[#00D2C4]/60 transition-all flex flex-col justify-center"
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                          }}
                        >
                          {/* Top: Icon & Monospace Number */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#00D2C4]/15 flex items-center justify-center text-[#00D2C4]">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {item.number}
                            </span>
                          </div>

                          {/* Title & Description */}
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {/* ========================================= */}
                        {/* BACK FACE (Clean, no pill badge, no hint) */}
                        {/* ========================================= */}
                        <div
                          className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#071313] via-[#091b1b] to-[#0d2325] text-white border border-[#00D2C4]/50 px-5 py-4 shadow-md shadow-[#00D2C4]/10 flex flex-col justify-center"
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          {/* Back Top: Title & Number */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#00D2C4] uppercase tracking-wider">
                              {item.backTitle}
                            </span>
                            <span className="font-mono text-[11px] text-white/40">{item.number}</span>
                          </div>

                          {/* Back Points */}
                          <ul className="space-y-1 text-xs text-white/85">
                            {item.backPoints.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-center gap-1.5 truncate">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2C4] shrink-0" />
                                <span className="truncate">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile-only dot — desktop dots are inside the SVG above */}
                  <div
                    className="timeline-node md:hidden absolute left-5 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-[#071313] border-2 border-[#00D2C4] shadow-sm shadow-[#00D2C4]/30 flex items-center justify-center z-20"
                    aria-hidden="true"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#00D2C4] animate-pulse" />
                  </div>

                  {/* Empty Spacer Column on Desktop */}
                  <div className="hidden md:block md:w-1/2" aria-hidden="true" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
