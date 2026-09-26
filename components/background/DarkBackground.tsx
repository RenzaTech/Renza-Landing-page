'use client';

import React from 'react';
import BackgroundGlow from './BackgroundGlow';
import BackgroundOrbs from './BackgroundOrbs';
import BackgroundPaths from './BackgroundPaths';
import BackgroundParticles from './BackgroundParticles';

export interface DarkBackgroundProps {
  theme?: 'dark' | 'footer';
  layer1Ref: React.RefObject<HTMLDivElement>;
  layer2Ref: React.RefObject<HTMLDivElement>;
  layer3Ref: React.RefObject<HTMLDivElement>;
  glow1Ref: React.RefObject<HTMLDivElement>;
  glow2Ref: React.RefObject<HTMLDivElement>;
  glow3Ref: React.RefObject<HTMLDivElement>;
  orb1Ref: React.RefObject<HTMLDivElement>;
  orb2Ref: React.RefObject<HTMLDivElement>;
  path1Ref: React.RefObject<SVGGElement>;
  path2Ref: React.RefObject<SVGGElement>;
  particleRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const DarkBackground: React.FC<DarkBackgroundProps> = ({
  theme = 'dark',
  layer1Ref,
  layer2Ref,
  layer3Ref,
  glow1Ref,
  glow2Ref,
  glow3Ref,
  orb1Ref,
  orb2Ref,
  path1Ref,
  path2Ref,
  particleRefs,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* Layer 1: Atmospheric Glows (Layer 1 mouse parallax: ±3px, scroll parallax: -80px) */}
      <div ref={layer1Ref} className="absolute inset-0 pointer-events-none" style={{ willChange: 'transform' }}>
        <BackgroundGlow
          theme={theme}
          glow1Ref={glow1Ref}
          glow2Ref={glow2Ref}
          glow3Ref={glow3Ref}
        />
      </div>

      {/* Layer 2: Orbs & Flowing Abstract Curves (Layer 2 mouse parallax: ±7px, scroll parallax: -120px) */}
      <div ref={layer2Ref} className="absolute inset-0 pointer-events-none" style={{ willChange: 'transform' }}>
        <BackgroundOrbs theme={theme} orb1Ref={orb1Ref} orb2Ref={orb2Ref} />
        <BackgroundPaths theme={theme} path1Ref={path1Ref} path2Ref={path2Ref} />
      </div>

      {/* Layer 3: Drift Particles (Layer 3 mouse parallax: ±12px, scroll parallax: -60px) */}
      <div ref={layer3Ref} className="absolute inset-0 pointer-events-none" style={{ willChange: 'transform' }}>
        <BackgroundParticles theme={theme} particleRefs={particleRefs} />
      </div>

      {/* Subtle Dot Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #00D2C4 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};

export default DarkBackground;
