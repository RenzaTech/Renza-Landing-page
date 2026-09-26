'use client';

import React from 'react';

interface HeroProgressProps {
  currentIndex: number;
  totalScenes: number;
  progressRef: React.RefObject<HTMLDivElement>;
  activeCategory?: string;
}

export const HeroProgress: React.FC<HeroProgressProps> = ({
  currentIndex,
  totalScenes,
  progressRef,
}) => {
  const formatNum = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  return (
    <div className="flex items-center gap-4 py-2">
      {/* Scene Number counter */}
      <div className="flex items-baseline gap-1 font-mono text-xs sm:text-sm tracking-wider">
        <span className="font-bold text-[#00D2C4]">
          {formatNum(currentIndex + 1)}
        </span>
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <span className="text-slate-400 dark:text-slate-500">
          {formatNum(totalScenes)}
        </span>
      </div>

      {/* Progress Track */}
      <div className="relative flex-1 h-1 bg-slate-200/70 dark:bg-slate-800 rounded-full overflow-hidden max-w-[200px] sm:max-w-[280px]">
        <div
          ref={progressRef}
          className="absolute top-0 left-0 bottom-0 bg-[#00D2C4] rounded-full w-full origin-left"
          style={{ transform: 'scaleX(0)' }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default HeroProgress;
