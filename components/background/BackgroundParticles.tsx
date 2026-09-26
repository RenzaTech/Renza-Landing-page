'use client';

import React from 'react';

export interface BackgroundParticlesProps {
  theme: 'dark' | 'light' | 'turquoise' | 'footer';
  particleRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

// Fixed positions so no SSR hydration mismatches occur
const PARTICLE_DATA = [
  { top: '15%', left: '12%', size: 3, opacity: 0.16 },
  { top: '28%', left: '32%', size: 2, opacity: 0.12 },
  { top: '42%', left: '78%', size: 4, opacity: 0.18 },
  { top: '56%', left: '22%', size: 2.5, opacity: 0.14 },
  { top: '68%', left: '88%', size: 3, opacity: 0.15 },
  { top: '80%', left: '48%', size: 2, opacity: 0.11 },
  { top: '22%', left: '62%', size: 3.5, opacity: 0.17 },
  { top: '35%', left: '90%', size: 2, opacity: 0.10 },
  { top: '75%', left: '15%', size: 2.5, opacity: 0.13 },
  { top: '88%', left: '70%', size: 3, opacity: 0.15 },
  { top: '18%', left: '82%', size: 2, opacity: 0.09 },
  { top: '50%', left: '5%', size: 3, opacity: 0.14 },
  { top: '62%', left: '55%', size: 2, opacity: 0.12 },
  { top: '92%', left: '38%', size: 2.5, opacity: 0.13 },
];

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({
  theme,
  particleRefs,
}) => {
  // Only dark and footer sections have subtle particles
  if (theme !== 'dark' && theme !== 'footer') {
    return null;
  }

  const isFooter = theme === 'footer';

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block"
      aria-hidden="true"
    >
      {PARTICLE_DATA.map((p, idx) => {
        const finalOpacity = isFooter ? p.opacity * 0.5 : p.opacity;
        return (
          <div
            key={idx}
            ref={(el) => {
              particleRefs.current[idx] = el;
            }}
            className="absolute rounded-full bg-[#00D2C4] pointer-events-none"
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: finalOpacity,
              boxShadow: '0 0 6px rgba(0, 210, 196, 0.4)',
              willChange: 'transform',
            }}
          />
        );
      })}
    </div>
  );
};

export default BackgroundParticles;
