'use client';

import React from 'react';
import { HeroSceneData } from './heroData';
import HeroScene from './HeroScene';

interface HeroImageStageProps {
  scenes: HeroSceneData[];
  currentIndex: number;
  stageRef: React.RefObject<HTMLDivElement>;
  glowRef: React.RefObject<HTMLDivElement>;
  sceneContainerRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  sceneImageRefs: React.MutableRefObject<(HTMLImageElement | null)[]>;
  sceneBlurRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  sceneBadgeRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const HeroImageStage: React.FC<HeroImageStageProps> = ({
  scenes,
  currentIndex,
  stageRef,
  glowRef,
  sceneContainerRefs,
  sceneImageRefs,
  sceneBlurRefs,
  sceneBadgeRefs,
}) => {
  return (
    <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[85vh] max-h-[760px] min-h-[440px] flex items-center justify-center">
      {/* Subtle turquoise radial atmospheric glow behind image */}
      <div
        ref={glowRef}
        className="absolute -inset-12 z-0 pointer-events-none opacity-50 blur-xl"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(0, 210, 196, 0.18), rgba(0, 210, 196, 0.04) 55%, transparent 75%)',
          willChange: 'transform, opacity',
        }}
        aria-hidden="true"
      />

      {/* Main Image Stage Container */}
      <div
        ref={stageRef}
        className="relative z-10 w-full h-full rounded-3xl lg:rounded-[2.5rem] p-1.5 sm:p-2 bg-gradient-to-b from-white/60 to-white/20 dark:from-slate-800/50 dark:to-slate-900/20 backdrop-blur-sm border border-white/80 dark:border-slate-800/80 shadow-2xl shadow-[#00D2C4]/10"
        style={{ willChange: 'transform' }}
      >
        <div className="relative w-full h-full overflow-hidden rounded-2xl lg:rounded-[2.2rem]">
          {scenes.map((scene, idx) => (
            <HeroScene
              key={scene.id}
              scene={scene}
              index={idx}
              isActive={idx === currentIndex}
              containerRef={(el) => (sceneContainerRefs.current[idx] = el)}
              imageRef={(el) => (sceneImageRefs.current[idx] = el)}
              blurRef={(el) => (sceneBlurRefs.current[idx] = el)}
              badgeRef={(el) => (sceneBadgeRefs.current[idx] = el)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroImageStage;
