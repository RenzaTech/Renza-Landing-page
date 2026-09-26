'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Shirt, Smartphone, Star } from 'lucide-react';
import { HeroSceneData } from './heroData';

interface HeroBadgeProps {
  badgeTitle: string;
  badgeSubtitle: string;
  badgeType: HeroSceneData['badgeType'];
  className?: string;
}

export const HeroBadge: React.FC<HeroBadgeProps> = ({
  badgeTitle,
  badgeSubtitle,
  badgeType,
  className = '',
}) => {
  const getIcon = () => {
    switch (badgeType) {
      case 'verified':
        return <ShieldCheck className="w-5 h-5 text-[#00D2C4] flex-shrink-0" />;
      case 'kitchen':
        return <Sparkles className="w-5 h-5 text-[#00D2C4] flex-shrink-0" />;
      case 'laundry':
        return <Shirt className="w-5 h-5 text-[#00D2C4] flex-shrink-0" />;
      case 'booking':
        return <Smartphone className="w-5 h-5 text-[#00D2C4] flex-shrink-0" />;
      case 'rating':
        return <Star className="w-5 h-5 text-amber-400 fill-amber-400 flex-shrink-0" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#00D2C4] flex-shrink-0" />;
    }
  };

  return (
    <div
      className={`hero-badge-card inline-flex items-center gap-3 px-4 py-3 bg-white/90 dark:bg-[#0D1B1B]/90 backdrop-blur-md border border-white/60 dark:border-[#1E2E2E] rounded-2xl shadow-xl shadow-black/5 pointer-events-none transition-all duration-300 ${className}`}
    >
      <div className="w-9 h-9 rounded-xl bg-[#00D2C4]/10 dark:bg-[#00D2C4]/20 flex items-center justify-center flex-shrink-0">
        {getIcon()}
      </div>
      <div>
        <p className="text-xs sm:text-sm font-semibold text-[#071313] dark:text-white leading-snug">
          {badgeTitle}
        </p>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-tight">
          {badgeSubtitle}
        </p>
      </div>
    </div>
  );
};

export default HeroBadge;
