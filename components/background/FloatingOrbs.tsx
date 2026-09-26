'use client';

import React from 'react';

export interface FloatingOrbsProps {
  orbRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  lightPointRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

// 6 Soft Orbs (80px - 180px) positioned across the background
const ORB_CONFIGS = [
  { top: '14%', left: '16%', size: 140, blur: 22, opacity: 0.7 },
  { top: '24%', right: '14%', size: 160, blur: 26, opacity: 0.65 },
  { top: '48%', left: '38%', size: 110, blur: 18, opacity: 0.55 },
  { top: '65%', right: '22%', size: 170, blur: 28, opacity: 0.7 },
  { top: '78%', left: '12%', size: 130, blur: 20, opacity: 0.6 },
  { top: '86%', right: '35%', size: 95, blur: 15, opacity: 0.5 },
];

// 7 Subtle Micro Light Points (2px - 3px) - not hundreds of particles, just delicate light points
const LIGHT_POINTS = [
  { top: '18%', left: '25%', size: 2.5, opacity: 0.12 },
  { top: '32%', right: '28%', size: 2, opacity: 0.10 },
  { top: '46%', left: '18%', size: 3, opacity: 0.14 },
  { top: '62%', right: '18%', size: 2.5, opacity: 0.11 },
  { top: '74%', left: '44%', size: 2, opacity: 0.09 },
  { top: '84%', right: '40%', size: 2.5, opacity: 0.13 },
  { top: '90%', left: '22%', size: 3, opacity: 0.11 },
];

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({
  orbRefs,
  lightPointRefs,
}) => {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* 5-8 Soft Translucent Depth Orbs */}
      {ORB_CONFIGS.map((orb, idx) => (
        <div
          key={`orb-${idx}`}
          ref={(el) => {
            orbRefs.current[idx] = el;
          }}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: orb.top,
            left: orb.left,
            right: orb.right,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background:
              'radial-gradient(circle, rgba(0, 210, 196, 0.035) 0%, rgba(0, 210, 196, 0.01) 60%, transparent 80%)',
            border: '1px solid rgba(0, 210, 196, 0.045)',
            filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity,
            willChange: 'transform',
          }}
        />
      ))}

      {/* 5-8 Subtle Micro Floating Light Points */}
      {LIGHT_POINTS.map((pt, idx) => (
        <div
          key={`pt-${idx}`}
          ref={(el) => {
            lightPointRefs.current[idx] = el;
          }}
          className="absolute rounded-full pointer-events-none hidden sm:block"
          style={{
            top: pt.top,
            left: pt.left,
            right: pt.right,
            width: `${pt.size}px`,
            height: `${pt.size}px`,
            backgroundColor: '#00D2C4',
            opacity: pt.opacity,
            boxShadow: '0 0 6px rgba(0, 210, 196, 0.35)',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
};

export default FloatingOrbs;
