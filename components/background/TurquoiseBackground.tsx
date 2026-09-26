'use client';

import React from 'react';
import BackgroundGlow from './BackgroundGlow';
import BackgroundOrbs from './BackgroundOrbs';
import BackgroundPaths from './BackgroundPaths';

export interface TurquoiseBackgroundProps {
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
}

export const TurquoiseBackground: React.FC<TurquoiseBackgroundProps> = ({
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
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* Layer 1: Soft Translucent White Organic Shapes (Layer 1: ±3px, scroll: -80px) */}
      <div ref={layer1Ref} className="absolute inset-0 pointer-events-none" style={{ willChange: 'transform' }}>
        <BackgroundGlow
          theme="turquoise"
          glow1Ref={glow1Ref}
          glow2Ref={glow2Ref}
          glow3Ref={glow3Ref}
        />
      </div>

      {/* Layer 2: White Depth Circles (Layer 2: ±7px, scroll: -120px) */}
      <div ref={layer2Ref} className="absolute inset-0 pointer-events-none" style={{ willChange: 'transform' }}>
        <BackgroundOrbs theme="turquoise" orb1Ref={orb1Ref} orb2Ref={orb2Ref} />
      </div>

      {/* Layer 3: Delicate white accent lines (Layer 3: ±12px, scroll: -60px) */}
      <div ref={layer3Ref} className="absolute inset-0 pointer-events-none" style={{ willChange: 'transform' }}>
        <BackgroundPaths theme="turquoise" path1Ref={path1Ref} path2Ref={path2Ref} />
      </div>

      {/* Translucent white dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};

export default TurquoiseBackground;
