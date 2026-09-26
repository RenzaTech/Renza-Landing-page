'use client';

import React from 'react';

export interface LightGlowProps {
  glow1Ref: React.RefObject<HTMLDivElement>;
  glow2Ref: React.RefObject<HTMLDivElement>;
  glow3Ref: React.RefObject<HTMLDivElement>;
}

export const LightGlow: React.FC<LightGlowProps> = ({
  glow1Ref,
  glow2Ref,
  glow3Ref,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* LIGHT 1: Atmospheric light behind left area (left: 10%, top: 30%) */}
      <div
        ref={glow1Ref}
        className="absolute w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] rounded-full blur-[90px] sm:blur-[125px] opacity-[0.55] pointer-events-none"
        style={{
          left: '10%',
          top: '30%',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(0, 210, 196, 0.08) 0%, rgba(0, 210, 196, 0.035) 35%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* LIGHT 2: Atmospheric light behind right area (right: 10%, top: 35%) */}
      <div
        ref={glow2Ref}
        className="absolute w-[650px] h-[650px] sm:w-[900px] sm:h-[900px] rounded-full blur-[100px] sm:blur-[130px] opacity-[0.50] pointer-events-none"
        style={{
          right: '10%',
          top: '35%',
          transform: 'translate(50%, -50%)',
          background:
            'radial-gradient(circle, rgba(0, 210, 196, 0.075) 0%, rgba(0, 210, 196, 0.03) 38%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* LIGHT 3: Bottom atmospheric depth light (left: 40%, bottom: -10%) */}
      <div
        ref={glow3Ref}
        className="absolute w-[550px] h-[550px] sm:w-[800px] sm:h-[800px] rounded-full blur-[85px] sm:blur-[120px] opacity-[0.45] pointer-events-none"
        style={{
          left: '40%',
          bottom: '-10%',
          transform: 'translate(-50%, 50%)',
          background:
            'radial-gradient(circle, rgba(120, 240, 230, 0.07) 0%, rgba(0, 210, 196, 0.025) 40%, transparent 68%)',
          willChange: 'transform',
        }}
      />
    </div>
  );
};

export default LightGlow;
