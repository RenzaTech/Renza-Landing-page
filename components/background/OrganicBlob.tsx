'use client';

import React from 'react';

export interface OrganicBlobProps {
  blob1Ref: React.RefObject<HTMLDivElement>;
  blob2Ref: React.RefObject<HTMLDivElement>;
  blob3Ref: React.RefObject<HTMLDivElement>;
}

export const OrganicBlob: React.FC<OrganicBlobProps> = ({
  blob1Ref,
  blob2Ref,
  blob3Ref,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* Organic Shape 1: Top-Right Irregular Morph */}
      <div
        ref={blob1Ref}
        className="absolute top-[8%] right-[15%] w-[480px] h-[440px] sm:w-[680px] sm:h-[620px] blur-[85px] sm:blur-[115px] opacity-50 pointer-events-none"
        style={{
          borderRadius: '52% 48% 63% 37% / 41% 58% 42% 59%',
          background:
            'radial-gradient(circle at 45% 45%, rgba(0, 210, 196, 0.035) 0%, rgba(0, 210, 196, 0.015) 50%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Organic Shape 2: Bottom-Left Irregular Fluid Blob */}
      <div
        ref={blob2Ref}
        className="absolute bottom-[5%] left-[8%] w-[520px] h-[480px] sm:w-[720px] sm:h-[660px] blur-[90px] sm:blur-[120px] opacity-50 pointer-events-none"
        style={{
          borderRadius: '45% 55% 38% 62% / 58% 39% 61% 42%',
          background:
            'radial-gradient(circle at 55% 55%, rgba(0, 210, 196, 0.03) 0%, rgba(120, 240, 230, 0.015) 55%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Organic Shape 3: Center Ambient Fluid Mesh */}
      <div
        ref={blob3Ref}
        className="absolute top-[42%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[390px] sm:w-[600px] sm:h-[560px] blur-[75px] sm:blur-[105px] opacity-45 pointer-events-none"
        style={{
          borderRadius: '58% 42% 48% 52% / 46% 54% 46% 54%',
          background:
            'radial-gradient(circle at 50% 50%, rgba(0, 210, 196, 0.025) 0%, transparent 65%)',
          willChange: 'transform',
        }}
      />
    </div>
  );
};

export default OrganicBlob;
