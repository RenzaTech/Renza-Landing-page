'use client';

import React from 'react';
import LightGlow from './LightGlow';
import OrganicBlob from './OrganicBlob';
import FlowingPaths from './FlowingPaths';
import FloatingOrbs from './FloatingOrbs';

export interface LightBackgroundProps {
  layer1Ref: React.RefObject<HTMLDivElement>;
  layer2Ref: React.RefObject<HTMLDivElement>;
  layer3Ref: React.RefObject<HTMLDivElement>;
  glow1Ref: React.RefObject<HTMLDivElement>;
  glow2Ref: React.RefObject<HTMLDivElement>;
  glow3Ref: React.RefObject<HTMLDivElement>;
  blob1Ref: React.RefObject<HTMLDivElement>;
  blob2Ref: React.RefObject<HTMLDivElement>;
  blob3Ref: React.RefObject<HTMLDivElement>;
  pathGroup1Ref: React.RefObject<SVGGElement>;
  pathGroup2Ref: React.RefObject<SVGGElement>;
  orbRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  lightPointRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const LightBackground: React.FC<LightBackgroundProps> = ({
  layer1Ref,
  layer2Ref,
  layer3Ref,
  glow1Ref,
  glow2Ref,
  glow3Ref,
  blob1Ref,
  blob2Ref,
  blob3Ref,
  pathGroup1Ref,
  pathGroup2Ref,
  orbRefs,
  lightPointRefs,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* Layer 1: Soft Turquoise Light (Mouse: ±4px, Scroll Parallax: -100px) */}
      <div ref={layer1Ref} className="absolute inset-0 pointer-events-none" style={{ willChange: 'transform' }}>
        <LightGlow
          glow1Ref={glow1Ref}
          glow2Ref={glow2Ref}
          glow3Ref={glow3Ref}
        />
      </div>

      {/* Layer 2: Organic Light Blobs & Floating Orbs (Mouse: ±8px, Scroll Parallax: -150px) */}
      <div ref={layer2Ref} className="absolute inset-0 pointer-events-none" style={{ willChange: 'transform' }}>
        <OrganicBlob
          blob1Ref={blob1Ref}
          blob2Ref={blob2Ref}
          blob3Ref={blob3Ref}
        />
        <FloatingOrbs
          orbRefs={orbRefs}
          lightPointRefs={lightPointRefs}
        />
      </div>

      {/* Layer 3: Flowing Curves & Connecting Paths (Mouse: ±12px, Scroll Parallax: -80px) */}
      <div ref={layer3Ref} className="absolute inset-0 pointer-events-none" style={{ willChange: 'transform' }}>
        <FlowingPaths
          pathGroup1Ref={pathGroup1Ref}
          pathGroup2Ref={pathGroup2Ref}
        />
      </div>

      {/* Delicate Micro-dot texture overlay (adds tangible tactile depth to flat white) */}
      <div
        className="absolute inset-0 opacity-[0.022] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #00D2C4 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />
    </div>
  );
};

export default LightBackground;
