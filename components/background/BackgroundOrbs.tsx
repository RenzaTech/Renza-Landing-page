'use client';

import React from 'react';

export interface BackgroundOrbsProps {
  theme: 'dark' | 'light' | 'turquoise' | 'footer';
  orb1Ref: React.RefObject<HTMLDivElement>;
  orb2Ref: React.RefObject<HTMLDivElement>;
}

export const BackgroundOrbs: React.FC<BackgroundOrbsProps> = ({
  theme,
  orb1Ref,
  orb2Ref,
}) => {
  if (theme === 'dark' || theme === 'footer') {
    const isFooter = theme === 'footer';
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Dark Atmospheric Depth Orb 1 */}
        <div
          ref={orb1Ref}
          className={`absolute top-16 right-8 sm:top-24 sm:right-28 w-64 h-64 sm:w-96 sm:h-96 rounded-full pointer-events-none transition-opacity duration-700 ${
            isFooter ? 'opacity-[0.04]' : 'opacity-[0.08]'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(0, 210, 196, 0.035) 0%, transparent 70%)',
            border: '1px solid rgba(0, 210, 196, 0.07)',
            willChange: 'transform',
          }}
        />

        {/* Dark Atmospheric Depth Orb 2 */}
        <div
          ref={orb2Ref}
          className={`absolute bottom-20 left-10 sm:bottom-28 sm:left-24 w-52 h-52 sm:w-80 sm:h-80 rounded-full pointer-events-none transition-opacity duration-700 ${
            isFooter ? 'opacity-[0.03]' : 'opacity-[0.06]'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(0, 210, 196, 0.025) 0%, transparent 70%)',
            border: '1px solid rgba(0, 210, 196, 0.06)',
            willChange: 'transform',
          }}
        />
      </div>
    );
  }

  if (theme === 'turquoise') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Turquoise Section Depth Ring 1 */}
        <div
          ref={orb1Ref}
          className="absolute top-12 right-12 sm:top-20 sm:right-32 w-64 h-64 sm:w-96 sm:h-96 rounded-full pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            willChange: 'transform',
          }}
        />

        {/* Turquoise Section Depth Ring 2 */}
        <div
          ref={orb2Ref}
          className="absolute bottom-16 left-8 sm:bottom-24 sm:left-24 w-56 h-56 sm:w-80 sm:h-80 rounded-full pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            willChange: 'transform',
          }}
        />
      </div>
    );
  }

  // Theme: light
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Light Floating Orb 1 */}
      <div
        ref={orb1Ref}
        className="absolute top-12 right-10 sm:top-16 sm:right-28 w-56 h-56 sm:w-80 sm:h-80 rounded-full pointer-events-none opacity-70"
        style={{
          background: 'radial-gradient(circle, rgba(0, 210, 196, 0.035) 0%, rgba(0, 210, 196, 0.01) 50%, transparent 70%)',
          border: '1px solid rgba(0, 210, 196, 0.06)',
          willChange: 'transform',
        }}
      />

      {/* Light Floating Orb 2 */}
      <div
        ref={orb2Ref}
        className="absolute bottom-16 left-8 sm:bottom-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 rounded-full pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(0, 210, 196, 0.03) 0%, rgba(120, 240, 230, 0.01) 50%, transparent 70%)',
          border: '1px solid rgba(0, 210, 196, 0.05)',
          willChange: 'transform',
        }}
      />
    </div>
  );
};

export default BackgroundOrbs;
