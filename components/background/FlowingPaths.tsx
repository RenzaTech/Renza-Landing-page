'use client';

import React from 'react';

export interface FlowingPathsProps {
  pathGroup1Ref: React.RefObject<SVGGElement>;
  pathGroup2Ref: React.RefObject<SVGGElement>;
}

export const FlowingPaths: React.FC<FlowingPathsProps> = ({
  pathGroup1Ref,
  pathGroup2Ref,
}) => {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full min-w-[1100px] pointer-events-none opacity-80"
        viewBox="0 0 1440 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D2C4" stopOpacity="0" />
            <stop offset="25%" stopColor="#00D2C4" stopOpacity="0.07" />
            <stop offset="65%" stopColor="#00D2C4" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#00D2C4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D2C4" stopOpacity="0" />
            <stop offset="35%" stopColor="#00D2C4" stopOpacity="0.06" />
            <stop offset="75%" stopColor="#00D2C4" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#00D2C4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Path Group 1: Elegant primary sweep across the viewport */}
        <g ref={pathGroup1Ref} style={{ transformOrigin: '50% 50%', willChange: 'transform' }}>
          {/* Curve 1: Passing behind left text and swooping toward right image */}
          <path
            d="M-120 180 C 260 40, 580 340, 940 160 C 1220 20, 1420 280, 1600 210"
            stroke="url(#flowGrad1)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Curve 2: Parallel gentle echo */}
          <path
            d="M-80 220 C 300 90, 620 380, 980 200 C 1260 70, 1450 320, 1640 250"
            stroke="url(#flowGrad2)"
            strokeWidth="0.8"
            strokeDasharray="6 8"
            strokeLinecap="round"
          />
          {/* Curve 3: Higher subtle arc */}
          <path
            d="M-60 80 C 380 -20, 760 220, 1100 80 C 1320 0, 1500 160, 1620 120"
            stroke="url(#flowGrad2)"
            strokeWidth="0.7"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />
        </g>

        {/* Path Group 2: Counter-flow across lower section */}
        <g ref={pathGroup2Ref} style={{ transformOrigin: '50% 50%', willChange: 'transform' }}>
          {/* Curve 4: Connecting lower left across to right */}
          <path
            d="M-100 520 C 320 620, 700 310, 1060 480 C 1280 580, 1460 400, 1620 450"
            stroke="url(#flowGrad1)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Curve 5: Low accent line */}
          <path
            d="M-40 570 C 360 660, 740 370, 1100 530 C 1310 620, 1480 460, 1650 500"
            stroke="url(#flowGrad2)"
            strokeWidth="0.75"
            strokeDasharray="5 7"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};

export default FlowingPaths;
