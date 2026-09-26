'use client';

import React from 'react';

export interface BackgroundGlowProps {
  theme: 'dark' | 'light' | 'turquoise' | 'footer';
  glow1Ref: React.RefObject<HTMLDivElement>;
  glow2Ref: React.RefObject<HTMLDivElement>;
  glow3Ref: React.RefObject<HTMLDivElement>;
}

export const BackgroundGlow: React.FC<BackgroundGlowProps> = ({
  theme,
  glow1Ref,
  glow2Ref,
  glow3Ref,
}) => {
  if (theme === 'dark' || theme === 'footer') {
    const isFooter = theme === 'footer';
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Glow 1: Top-Left Primary Atmospheric Glow */}
        <div
          ref={glow1Ref}
          className={`absolute -top-28 -left-36 w-[650px] h-[650px] sm:w-[900px] sm:h-[900px] rounded-full blur-[100px] sm:blur-[135px] pointer-events-none transition-opacity duration-700 ${
            isFooter ? 'opacity-[0.10]' : 'opacity-[0.24]'
          }`}
          style={{
            background:
              'radial-gradient(circle at 45% 45%, rgba(0, 210, 196, 0.16) 0%, rgba(0, 210, 196, 0.05) 35%, transparent 70%)',
            willChange: 'transform',
          }}
        />

        {/* Glow 2: Bottom-Right Secondary Atmospheric Glow */}
        <div
          ref={glow2Ref}
          className={`absolute -bottom-28 -right-32 w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] rounded-full blur-[110px] sm:blur-[140px] pointer-events-none transition-opacity duration-700 ${
            isFooter ? 'opacity-[0.08]' : 'opacity-[0.20]'
          }`}
          style={{
            background:
              'radial-gradient(circle at 55% 55%, rgba(0, 210, 196, 0.14) 0%, rgba(0, 210, 196, 0.04) 40%, transparent 70%)',
            willChange: 'transform',
          }}
        />

        {/* Glow 3: Center-Right Breathing Atmosphere Glow */}
        <div
          ref={glow3Ref}
          className={`absolute top-1/3 -right-20 sm:top-1/4 sm:right-1/4 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full blur-[90px] sm:blur-[120px] pointer-events-none transition-opacity duration-700 ${
            isFooter ? 'opacity-[0.06]' : 'opacity-[0.16]'
          }`}
          style={{
            background:
              'radial-gradient(circle at center, rgba(0, 210, 196, 0.12) 0%, rgba(0, 210, 196, 0.03) 35%, transparent 70%)',
            willChange: 'transform',
          }}
        />
      </div>
    );
  }

  if (theme === 'turquoise') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Circle 1: Translucent White Deep Blob 1 */}
        <div
          ref={glow1Ref}
          className="absolute -top-24 -left-24 w-[550px] h-[550px] sm:w-[800px] sm:h-[800px] rounded-full blur-[90px] sm:blur-[120px] opacity-[0.45] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 45%, transparent 70%)',
            willChange: 'transform',
          }}
        />

        {/* Circle 2: Translucent White Deep Blob 2 */}
        <div
          ref={glow2Ref}
          className="absolute -bottom-28 -right-24 w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] rounded-full blur-[100px] sm:blur-[130px] opacity-[0.40] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.03) 40%, transparent 68%)',
            willChange: 'transform',
          }}
        />

        {/* Circle 3: Center Soft Scaler */}
        <div
          ref={glow3Ref}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full blur-[80px] sm:blur-[110px] opacity-[0.35] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 65%)',
            willChange: 'transform',
          }}
        />
      </div>
    );
  }

  // Theme: light
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Blob 1: Soft Mint / Turquoise Ambient Glow */}
      <div
        ref={glow1Ref}
        className="absolute -top-20 -left-20 sm:-top-32 sm:-left-32 w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] rounded-full blur-[90px] sm:blur-[120px] opacity-[0.48] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 45% 45%, rgba(0, 210, 196, 0.08) 0%, rgba(0, 210, 196, 0.02) 42%, transparent 68%)',
          willChange: 'transform',
        }}
      />

      {/* Blob 2: Light Cyan Soft Flow Blob */}
      <div
        ref={glow2Ref}
        className="absolute -bottom-24 -right-20 sm:-bottom-32 sm:-right-28 w-[550px] h-[550px] sm:w-[800px] sm:h-[800px] rounded-full blur-[85px] sm:blur-[115px] opacity-[0.42] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(120, 240, 230, 0.06) 0%, rgba(0, 210, 196, 0.02) 45%, transparent 68%)',
          willChange: 'transform',
        }}
      />

      {/* Blob 3: Center Organic Shape */}
      <div
        ref={glow3Ref}
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full blur-[80px] sm:blur-[105px] opacity-[0.38] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 210, 196, 0.05) 0%, transparent 62%)',
          willChange: 'transform',
        }}
      />
    </div>
  );
};

export default BackgroundGlow;
