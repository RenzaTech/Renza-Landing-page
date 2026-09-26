'use client';

import React from 'react';
import Image from 'next/image';
import { HeroSceneData } from './heroData';
import HeroBadge from './HeroBadge';

interface HeroSceneProps {
  scene: HeroSceneData;
  index: number;
  isActive: boolean;
  containerRef?: (el: HTMLDivElement | null) => void;
  imageRef?: (el: HTMLImageElement | null) => void;
  blurRef?: (el: HTMLDivElement | null) => void;
  badgeRef?: (el: HTMLDivElement | null) => void;
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  scene,
  index,
  isActive,
  containerRef,
  imageRef,
  blurRef,
  badgeRef,
}) => {
  return (
    <div
      ref={containerRef}
      className={`hero-scene-container absolute inset-0 w-full h-full overflow-hidden rounded-3xl lg:rounded-[2.5rem] shadow-2xl transition-opacity duration-300 ${
        isActive ? 'z-20 opacity-100 pointer-events-auto' : 'z-10 opacity-0 pointer-events-none'
      }`}
      style={{
        clipPath: isActive ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)',
        willChange: 'transform, clip-path, opacity',
      }}
    >
      {/* Layer 2: Subtle Blurred Duplicate behind image for rich depth */}
      <div
        ref={blurRef}
        className="absolute -inset-4 z-0 opacity-40 blur-2xl pointer-events-none scale-105"
        aria-hidden="true"
        style={{ willChange: 'transform' }}
      >
        <Image
          src={scene.image}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />
      </div>

      {/* Layer 1: Main High-Quality Photograph */}
      <div className="relative z-10 w-full h-full overflow-hidden">
        <Image
          ref={imageRef}
          src={scene.image}
          alt={scene.alt}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="hero-main-image object-cover object-center w-full h-full transition-transform duration-75 ease-out"
          style={{ willChange: 'transform' }}
        />

        {/* Layer 3: Subtle Gradient Overlay */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(7, 19, 19, 0.25) 0%, rgba(7, 19, 19, 0.05) 45%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Top subtle vignette for extra cinematic look */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(7, 19, 19, 0.2) 0%, transparent 30%, transparent 70%, rgba(7, 19, 19, 0.15) 100%)',
          }}
          aria-hidden="true"
        />

      </div>
    </div>
  );
};

export default HeroScene;
