'use client';

import React from 'react';

interface HeroCarouselControlsProps {
  totalScenes: number;
  currentIndex: number;
  onSelectScene: (index: number) => void;
  progressRef: React.RefObject<HTMLDivElement>;
}

export default function HeroCarouselControls({
  totalScenes,
  currentIndex,
  onSelectScene,
  progressRef,
}: HeroCarouselControlsProps) {
  const currentFormatted = String(currentIndex + 1).padStart(2, '0');
  const totalFormatted = String(totalScenes).padStart(2, '0');

  return (
    <div
      className="flex flex-col items-center sm:items-start gap-3 select-none"
      role="region"
      aria-label="Hero Scene Carousel Navigation"
    >
      {/* Top Row: Counter & Animated Progress Bar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center font-mono text-sm tracking-wider font-semibold">
          <span className="text-[#00D2C4]">{currentFormatted}</span>
          <span className="text-white/40 mx-1.5">/</span>
          <span className="text-white/40">{totalFormatted}</span>
        </div>

        {/* Progress Bar Track */}
        <div
          className="w-32 sm:w-44 h-[3px] bg-white/15 rounded-full overflow-hidden relative backdrop-blur-xs"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalScenes}
        >
          <div
            ref={progressRef}
            className="h-full bg-[#00D2C4] rounded-full origin-left will-change-transform shadow-[0_0_8px_#00D2C4]"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>

      {/* Bottom Row: Number Buttons 01 - 06 */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {Array.from({ length: totalScenes }).map((_, idx) => {
          const isActive = idx === currentIndex;
          const numFormatted = String(idx + 1).padStart(2, '0');

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectScene(idx)}
              aria-label={`Jump to scene ${idx + 1}`}
              aria-pressed={isActive}
              className={`transition-all duration-300 font-mono text-xs sm:text-sm font-semibold rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 cursor-pointer ${
                isActive
                  ? 'bg-[#00D2C4] text-[#071313] shadow-[0_0_18px_rgba(0,210,196,0.55)] scale-105'
                  : 'bg-[#0a171c]/80 hover:bg-[#12242c] text-white/50 hover:text-white/90 border border-white/5 backdrop-blur-sm'
              }`}
            >
              {numFormatted}
            </button>
          );
        })}
      </div>
    </div>
  );
}
