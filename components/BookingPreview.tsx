'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CheckCircle, Clock, ChevronRight, Home, Utensils, WashingMachine, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { icon: Home, label: 'House Cleaning' },
  { icon: Utensils, label: 'Vessel Washing' },
  { icon: WashingMachine, label: 'Laundry' },
  { icon: Sparkles, label: 'Kitchen Cleaning' },
];

const durations = [
  { hours: 1, price: 199 },
  { hours: 2, price: 398 },
  { hours: 3, price: 597 },
  { hours: 4, price: 796 },
];

type Screen = 'select' | 'duration' | 'confirm';

export default function BookingPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeScreen, setActiveScreen] = useState<Screen>('select');
  const [selectedService, setSelectedService] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        phoneRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-advance screens
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScreen((prev) => {
        if (prev === 'select') return 'duration';
        if (prev === 'duration') return 'confirm';
        return 'select';
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const selectedPrice = durations[selectedDuration].price;
  const selectedDurationHours = durations[selectedDuration].hours;

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-white dark:bg-[#070F0F]"
      aria-labelledby="booking-preview-heading"
    >
      <div className="container-renza">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div ref={contentRef} style={{ opacity: 0 }}>
            <SectionHeading
              badge="Booking Experience"
              title={`From "I need help" to "It's done."`}
              highlight={`"It's done."`}
              centered={false}
              description="Booking a RENZA Helper is designed to be as simple and fast as possible. Choose your service, set your time, and we handle the rest."
            />

            {/* Step indicators */}
            <div className="mt-8 space-y-4">
              {[
                { label: 'Choose a service', screen: 'select' as Screen },
                { label: 'Pick duration', screen: 'duration' as Screen },
                { label: 'Booking confirmed', screen: 'confirm' as Screen },
              ].map((step) => (
                <button
                  key={step.screen}
                  onClick={() => setActiveScreen(step.screen)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 text-left cursor-pointer ${
                    activeScreen === step.screen
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-border dark:border-[#1E2E2E] bg-white dark:bg-[#0D1B1B] hover:border-primary/30'
                  }`}
                  aria-pressed={activeScreen === step.screen}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      activeScreen === step.screen
                        ? 'bg-primary text-white'
                        : 'bg-light-bg dark:bg-[#070F0F] text-text-secondary border border-border dark:border-[#1E2E2E]'
                    }`}
                  >
                    <ChevronRight size={12} aria-hidden="true" />
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      activeScreen === step.screen
                        ? 'text-primary'
                        : 'text-text-secondary'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-5 text-xs text-text-secondary">
              * This preview demonstrates the intended booking experience.
            </p>
          </div>

          {/* Right - Phone Mockup */}
          <div
            ref={phoneRef}
            className="flex justify-center"
            style={{ opacity: 0 }}
            aria-label="RENZA app booking preview"
          >
            {/* Phone frame */}
            <div className="relative w-64 sm:w-72">
              {/* Phone outer */}
              <div className="bg-dark rounded-[2.5rem] p-2 shadow-2xl">
                {/* Screen */}
                <div className="bg-white dark:bg-[#070F0F] rounded-[2rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="bg-dark px-5 py-3 flex items-center justify-between">
                    <span className="text-white text-[10px] font-medium">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 rounded-sm border border-white/50 relative">
                        <div className="absolute left-0.5 top-0.5 bottom-0.5 w-2/3 bg-white/80 rounded-xs" />
                      </div>
                    </div>
                  </div>

                  {/* App header */}
                  <div className="bg-white dark:bg-[#070F0F] px-4 py-3 border-b border-border dark:border-[#1E2E2E] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">R</span>
                    </div>
                    <span className="text-xs font-bold text-text-primary">RENZA</span>
                  </div>

                  {/* Screen content */}
                  <div className="p-4 min-h-[320px] sm:min-h-[360px]">
                    {/* Screen 1: Select service */}
                    {activeScreen === 'select' && (
                      <div>
                        <p className="text-sm font-bold text-text-primary mb-3">
                          What do you need help with?
                        </p>
                        <div className="space-y-2">
                          {services.map((service, i) => {
                            const Icon = service.icon;
                            return (
                              <button
                                key={service.label}
                                onClick={() => setSelectedService(i)}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                                  selectedService === i
                                    ? 'border-primary bg-primary/8 dark:bg-primary/15'
                                    : 'border-border dark:border-[#1E2E2E] bg-white dark:bg-[#0D1B1B] hover:border-primary/40'
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                                    selectedService === i
                                      ? 'bg-primary text-white'
                                      : 'bg-light-bg dark:bg-[#070F0F] text-primary'
                                  }`}
                                >
                                  <Icon size={15} aria-hidden="true" />
                                </div>
                                <span
                                  className={`text-xs font-medium ${
                                    selectedService === i
                                      ? 'text-primary'
                                      : 'text-text-primary'
                                  }`}
                                >
                                  {service.label}
                                </span>
                                {selectedService === i && (
                                  <CheckCircle
                                    size={13}
                                    className="text-primary ml-auto shrink-0"
                                    aria-hidden="true"
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setActiveScreen('duration')}
                          className="mt-4 w-full bg-primary text-white text-xs font-semibold py-2.5 rounded-xl cursor-pointer hover:bg-primary-dark transition-colors"
                        >
                          Next →
                        </button>
                      </div>
                    )}

                    {/* Screen 2: Duration */}
                    {activeScreen === 'duration' && (
                      <div>
                        <p className="text-sm font-bold text-text-primary mb-3">
                          How long do you need help?
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {durations.map((d, i) => (
                            <button
                              key={d.hours}
                              onClick={() => setSelectedDuration(i)}
                              className={`p-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                                selectedDuration === i
                                  ? 'border-primary bg-primary/8 dark:bg-primary/15'
                                  : 'border-border dark:border-[#1E2E2E] bg-white dark:bg-[#0D1B1B] hover:border-primary/40'
                              }`}
                            >
                              <p
                                className={`text-xs font-semibold ${
                                  selectedDuration === i
                                    ? 'text-primary'
                                    : 'text-text-primary'
                                }`}
                              >
                                {d.hours} {d.hours === 1 ? 'Hour' : 'Hours'}
                              </p>
                            </button>
                          ))}
                        </div>

                        {/* Price summary */}
                        <div className="bg-light-bg dark:bg-[#0D1B1B] border border-transparent dark:border-[#1E2E2E] rounded-xl p-3 mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-primary" aria-hidden="true" />
                            <span className="text-xs text-text-secondary">
                              {selectedDurationHours} {selectedDurationHours === 1 ? 'hr' : 'hrs'}
                            </span>
                          </div>
                          <span className="text-base font-bold text-primary">
                            ₹{selectedPrice}
                          </span>
                        </div>

                        <button
                          onClick={() => setActiveScreen('confirm')}
                          className="w-full bg-primary text-white text-xs font-semibold py-2.5 rounded-xl cursor-pointer hover:bg-primary-dark transition-colors"
                        >
                          Confirm Booking →
                        </button>
                      </div>
                    )}

                    {/* Screen 3: Confirmed */}
                    {activeScreen === 'confirm' && (
                      <div className="flex flex-col items-center text-center py-4">
                        {/* Success icon */}
                        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-3">
                          <CheckCircle size={28} className="text-primary" aria-hidden="true" />
                        </div>

                        <p className="text-sm font-bold text-text-primary mb-1">
                          Booking Confirmed ✓
                        </p>
                        <p className="text-[11px] text-text-secondary mb-4">
                          Your RENZA Helper is on the way
                        </p>

                        {/* Booking summary */}
                        <div className="w-full bg-light-bg dark:bg-[#0D1B1B] border border-transparent dark:border-[#1E2E2E] rounded-xl p-3 text-left space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-[10px] text-text-secondary">Service</span>
                            <span className="text-[10px] font-semibold text-text-primary">
                              {services[selectedService].label}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[10px] text-text-secondary">Duration</span>
                            <span className="text-[10px] font-semibold text-text-primary">
                              {selectedDurationHours} {selectedDurationHours === 1 ? 'Hour' : 'Hours'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[10px] text-text-secondary">When</span>
                            <span className="text-[10px] font-semibold text-text-primary">
                              Today · 5:00 PM
                            </span>
                          </div>
                          <div className="h-px bg-border dark:bg-[#1E2E2E]" />
                          <div className="flex justify-between">
                            <span className="text-[10px] font-semibold text-text-primary">Total</span>
                            <span className="text-[10px] font-bold text-primary">
                              ₹{selectedPrice}
                            </span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="w-full">
                          <div className="flex justify-between text-[9px] text-text-secondary mb-1">
                            <span>Confirmed</span>
                            <span>On the way</span>
                            <span>Arrived</span>
                          </div>
                          <div className="h-1.5 bg-border rounded-full overflow-hidden">
                            <div className="h-full w-2/5 bg-gradient-to-r from-primary to-primary-dark rounded-full" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone notch */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-dark-secondary rounded-full" aria-hidden="true" />

              {/* Glow */}
              <div className="absolute inset-0 rounded-[2.5rem] shadow-turquoise -z-10 scale-105 opacity-50" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
