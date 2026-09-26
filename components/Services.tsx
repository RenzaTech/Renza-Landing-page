'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import {
  Home,
  Utensils,
  Shirt,
  WashingMachine,
  BedDouble,
  Sparkles,
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceData {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  rate: string;
  tasks: string[];
}

const services: ServiceData[] = [
  {
    id: 'house-cleaning',
    icon: Home,
    title: 'House Cleaning',
    description: 'Sweeping, mopping and general cleaning of your home.',
    rate: '₹199/hr',
    tasks: [
      'Floor sweeping, wet mopping & vacuuming',
      'Surface dusting, tabletops & shelves',
      'Waste disposal & balcony dry cleaning',
    ],
  },
  {
    id: 'vessel-washing',
    icon: Utensils,
    title: 'Vessel Washing',
    description: 'Get help with everyday kitchen cleanup and dishwashing.',
    rate: '₹199/hr',
    tasks: [
      'Hand washing pots, pans & everyday vessels',
      'Sink cleaning & countertop sanitization',
      'Drying and neat cabinet arrangement',
    ],
  },
  {
    id: 'laundry',
    icon: WashingMachine,
    title: 'Laundry Assistance',
    description: 'Washing, folding and organizing clothes with care.',
    rate: '₹199/hr',
    tasks: [
      'Washing machine loading & cycle care',
      'Clothes drying, neat folding & stacking',
      'Wardrobe organization & linen care',
    ],
  },
  {
    id: 'kitchen-cleaning',
    icon: Sparkles,
    title: 'Kitchen Cleaning',
    description: 'Keep your kitchen spotless and well-organized.',
    rate: '₹199/hr',
    tasks: [
      'Countertop degreasing & stove wipe-down',
      'Tile backsplash & chimney exterior wipe',
      'Appliance exterior cleaning & sink polish',
    ],
  },
  {
    id: 'room-cleaning',
    icon: BedDouble,
    title: 'Room Cleaning',
    description: 'Refresh bedrooms and living spaces for daily comfort.',
    rate: '₹199/hr',
    tasks: [
      'Bedsheet changing & mattress dusting',
      'Furniture wiping, mirrors & glass clean',
      'Tidying clutter, curtains & floor care',
    ],
  },
  {
    id: 'household-assistance',
    icon: Shirt,
    title: 'Household Assistance',
    description: 'Basic everyday household tasks handled with care.',
    rate: '₹199/hr',
    tasks: [
      'Grocery sorting & pantry organization',
      'Balcony tidying & plant care assistance',
      'Flexible everyday household chore support',
    ],
  },
];

interface ServiceCardProps {
  service: ServiceData;
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = service.icon;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      { opacity: 0, y: 35, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true,
        },
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="w-full h-[225px] sm:h-[235px] cursor-pointer group"
      style={{ perspective: '1200px' }}
      onClick={() => setIsFlipped((prev) => !prev)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${service.title} service card. Click or hover to flip for details.`}
    >
      {/* 3D Rotating Inner Box */}
      <div
        className={`relative w-full h-full duration-700 transition-transform ${
          isFlipped ? '[transform:rotateY(180deg)]' : 'group-hover:[transform:rotateY(180deg)]'
        }`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ========================================= */}
        {/* FRONT FACE (Clean, no Learn more button)  */}
        {/* ========================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-white dark:bg-[#0D1B1B] border border-border dark:border-[#1E2E2E] p-6 shadow-sm hover:shadow-lg dark:shadow-none hover:border-primary/60 transition-all flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div>
            {/* Top row: Icon & Rate Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-light-bg dark:bg-[#070F0F] border border-border dark:border-[#1E2E2E] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                <Icon size={22} aria-hidden="true" />
              </div>
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {service.rate}
              </span>
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-text-primary tracking-tight mb-2">
              {service.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* BACK FACE (Detailed Tasks & Quick Action) */}
        {/* ========================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#071313] via-[#091b1b] to-[#0d2325] text-white border border-[#00D2C4]/50 p-5 sm:p-6 shadow-xl shadow-[#00D2C4]/15 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div>
            {/* Header: Title & "What's Included" */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-[#00D2C4] uppercase tracking-wider flex items-center gap-1.5">
                <Icon size={14} className="text-[#00D2C4]" />
                {service.title}
              </span>
              <span className="text-[10px] font-semibold text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                What&apos;s Included
              </span>
            </div>

            {/* Task Checklist */}
            <ul className="space-y-1.5 text-xs text-white/85">
              {service.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2C4] shrink-0 mt-0.5" />
                  <span className="leading-snug">{task}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Book CTA Button */}
          <a
            href="#home"
            onClick={(e) => {
              e.stopPropagation();
              const heroSection = document.getElementById('home');
              heroSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-[#00D2C4] hover:bg-[#00bdae] text-[#071313] font-bold text-xs rounded-xl shadow-md transition-all duration-200 cursor-pointer mt-2"
          >
            <span>Book This Service</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const headingRef = useRef<HTMLDivElement>(null);

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
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      className="relative overflow-hidden section-padding bg-white dark:bg-[#070F0F]"
      aria-labelledby="services-heading"
    >
      <AnimatedBackground variant="light" />
      <div className="container-renza">
        {/* Heading */}
        <div ref={headingRef} style={{ opacity: 0 }}>
          <SectionHeading
            title="Our Services"
            highlight="Services"
            titleClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
            description="Book a RENZA Helper for everyday household assistance without the commitment of hiring a permanent maid."
          />
        </div>

        {/* Cards Grid */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
            />
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-text-secondary">
            More services coming soon.{' '}
            <a
              href="#home"
              className="text-primary font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Book a helper today</span>
              <span>→</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
