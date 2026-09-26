'use client';

import React from 'react';
import { HeroSceneData } from './heroData';

interface HeroControlsProps {
  scenes: HeroSceneData[];
  currentIndex: number;
  onSelectScene: (index: number) => void;
  isAnimating: boolean;
}

export const HeroControls: React.FC<HeroControlsProps> = ({
  scenes,
  currentIndex,
  onSelectScene,
  isAnimating,
}) => {
  return (
    <div
      className="flex items-center gap-2 sm:gap-2.5"
      role="tablist"
      aria-label="Scene selectors"
    >
      {scenes.map((scene, idx) => {
        const isActive = idx === currentIndex;
        const formattedNum = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;

        return (
          <button
            key={scene.id}
            role="tab"
            aria-selected={isActive}
            aria-label={`Select scene ${scene.id}: ${scene.category}`}
            disabled={isAnimating}
            onClick={() => onSelectScene(idx)}
            className={`group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-[#00D2C4] text-white shadow-md shadow-[#00D2C4]/25 scale-105'
                : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
            } ${isAnimating ? 'pointer-events-none' : ''}`}
          >
            <span>{formattedNum}</span>
          </button>
        );
      })}
    </div>
  );
};

export default HeroControls;
