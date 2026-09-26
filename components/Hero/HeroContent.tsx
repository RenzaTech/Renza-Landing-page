'use client';

import React from 'react';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

interface HeroContentProps {
  line1Ref: React.RefObject<HTMLSpanElement>;
  line2Ref: React.RefObject<HTMLSpanElement>;
  descRef: React.RefObject<HTMLParagraphElement>;
  ctaRef: React.RefObject<HTMLDivElement>;
  priceRef: React.RefObject<HTMLDivElement>;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  line1Ref,
  line2Ref,
  descRef,
  ctaRef,
  priceRef,
}) => {
  return (
    <div className="flex flex-col justify-center h-full py-4 lg:py-8 max-w-xl">
      {/* 1. Headline with Line-by-Line Stagger */}
      <h1
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#071313] dark:text-white tracking-tight leading-[1.12] mb-5 sm:mb-6 flex flex-col justify-start"
      >
        <span
          ref={line1Ref}
          className="block transform-gpu"
          style={{ willChange: 'transform, opacity' }}
        >
          Household work,
        </span>
        <span
          ref={line2Ref}
          className="block text-[#00D2C4] transform-gpu mt-1"
          style={{ willChange: 'transform, opacity' }}
        >
          made simple.
        </span>
      </h1>

      {/* 2. Description */}
      <p
        ref={descRef}
        className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6 sm:mb-8"
        style={{ willChange: 'transform, opacity' }}
      >
        Book a trained and verified RENZA Helper for everyday household tasks. Simple booking, flexible hours and help when you need it.
      </p>

      {/* 3. CTA Buttons */}
      <div
        ref={ctaRef}
        className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-6 sm:mb-8"
        style={{ willChange: 'transform, opacity' }}
      >
        <button
          className="inline-flex items-center gap-2.5 bg-[#00D2C4] hover:bg-[#00b8ab] text-white font-semibold text-base px-7 py-3.5 rounded-2xl shadow-lg shadow-[#00D2C4]/30 hover:shadow-[#00D2C4]/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
          aria-label="Book a RENZA Helper now"
        >
          <span>Book a Helper</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          className="inline-flex items-center gap-2 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-[#071313] dark:text-white font-semibold text-base px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-[#00D2C4] hover:text-[#00D2C4] dark:hover:text-[#00D2C4] transition-all duration-300 cursor-pointer"
          aria-label="Explore all household services"
        >
          <span>Explore Services</span>
        </button>
      </div>

      {/* 4. Starting price & badges */}
      <div
        ref={priceRef}
        className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400"
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="flex items-center gap-1.5 font-medium">
          <CheckCircle className="w-4 h-4 text-[#00D2C4] flex-shrink-0" />
          <span>
            Starting at <strong className="text-[#071313] dark:text-white font-bold">₹199/hour</strong>
          </span>
        </div>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <div className="flex items-center gap-1.5 font-medium">
          <CheckCircle className="w-4 h-4 text-[#00D2C4] flex-shrink-0" />
          <span>Pay after service</span>
        </div>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <div className="flex items-center gap-1.5 font-medium">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">4.9★ Rated</span>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
