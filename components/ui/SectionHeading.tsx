'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  centered?: boolean;
  dark?: boolean;
  className?: string;
  titleClassName?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  highlight,
  description,
  centered = true,
  dark = false,
  className,
  titleClassName,
}) => {
  const getHighlightedTitle = () => {
    if (!highlight) return title;
    const parts = title.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="gradient-text">{highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      className={cn(
        'section-heading',
        centered && 'text-center',
        className
      )}
    >
      {badge && (
        <div
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4',
            dark
              ? 'bg-primary/20 text-primary'
              : 'bg-primary-light text-primary'
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          {badge}
        </div>
      )}
      <h2
        className={cn(
          'text-section font-bold tracking-tight',
          dark ? 'text-white' : 'text-text-primary',
          titleClassName
        )}
      >
        {getHighlightedTitle()}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-base leading-relaxed max-w-2xl',
            centered && 'mx-auto',
            dark ? 'text-white/60' : 'text-text-secondary'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};
