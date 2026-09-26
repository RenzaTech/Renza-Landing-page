'use client';

import React from 'react';

export interface BackgroundPathsProps {
  theme: 'dark' | 'light' | 'turquoise' | 'footer';
  path1Ref: React.RefObject<SVGGElement>;
  path2Ref: React.RefObject<SVGGElement>;
}

export const BackgroundPaths: React.FC<BackgroundPathsProps> = ({
  theme,
  path1Ref,
  path2Ref,
}) => {
  const isDark = theme === 'dark';
  const isFooter = theme === 'footer';
  const isTurquoise = theme === 'turquoise';

  let strokeColor = 'rgba(0, 210, 196, 0.045)';
  if (isDark) strokeColor = 'rgba(0, 210, 196, 0.08)';
  if (isFooter) strokeColor = 'rgba(0, 210, 196, 0.04)';
  if (isTurquoise) strokeColor = 'rgba(255, 255, 255, 0.07)';

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full min-w-[1000px] opacity-90"
        viewBox="0 0 1440 650"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Curve 1: Flowing horizontal gentle arc */}
        <g ref={path1Ref} style={{ transformOrigin: '50% 50%', willChange: 'transform' }}>
          <path
            d="M-100 220 C 280 80, 560 380, 920 200 C 1180 80, 1400 320, 1600 240"
            stroke={strokeColor}
            strokeWidth="1"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />
          <path
            d="M-50 260 C 320 120, 600 420, 960 240 C 1220 120, 1440 360, 1650 280"
            stroke={strokeColor}
            strokeWidth="0.8"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />
        </g>

        {/* Curve 2: Counter-balancing organic ambient path */}
        <g ref={path2Ref} style={{ transformOrigin: '50% 50%', willChange: 'transform' }}>
          <path
            d="M-80 480 C 300 580, 680 260, 1020 440 C 1260 560, 1450 380, 1620 420"
            stroke={strokeColor}
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};

export default BackgroundPaths;
