'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div
      className="w-full bg-primary/10 border-b border-primary/20 py-2 px-4"
      role="banner"
      aria-label="Announcement"
    >
      <div className="container-renza flex items-center justify-center gap-3">
        {/* Pulsing dot */}
        <span className="relative flex items-center justify-center w-4 h-4">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
        </span>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-primary">
          <Sparkles size={13} className="shrink-0" aria-hidden="true" />
          <span>
            Household help when you need it
            <span className="mx-2 opacity-40">•</span>
            <span className="font-semibold">Starting at ₹199/hour</span>
          </span>
        </div>

        {/* Badge */}
        <span className="hidden sm:inline-flex items-center bg-primary text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
          Now Available
        </span>
      </div>
    </div>
  );
}
