'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';

export interface ImageSlide {
  id: string;
  imageSrc: string;
  imageAlt: string;
}

const CAROUSEL_SLIDES: ImageSlide[] = [
  {
    id: 'cleaning',
    imageSrc: '/images/hero-cleaning.jpg',
    imageAlt: 'Professional RENZA cleaning helper polishing living space',
  },
  {
    id: 'kitchen',
    imageSrc: '/images/hero-kitchen.jpg',
    imageAlt: 'Friendly kitchen helper preparing fresh healthy meal',
  },
  {
    id: 'laundry',
    imageSrc: '/images/hero-laundry.jpg',
    imageAlt: 'RENZA helper ironing and organizing fresh laundry',
  },
  {
    id: 'booking',
    imageSrc: '/images/hero-booking.jpg',
    imageAlt: 'Seamless RENZA mobile booking experience with real-time helper',
  },
  {
    id: 'trust',
    imageSrc: '/images/hero-interaction.jpg',
    imageAlt: 'Happy customer welcoming trusted RENZA helper at home door',
  },
];

const AUTOPLAY_MS = 4000;

export default function HeroImageCarousel() {
  const [deck, setDeck] = useState<number[]>([0, 1, 2, 3, 4]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Calculate stack style offsets based on card position in deck
  const getStackStyle = (stackIndex: number) => {
    if (stackIndex === 0) {
      // Active Front Card
      return {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        opacity: 1,
        zIndex: 30,
      };
    } else if (stackIndex === 1) {
      // 2nd Card in Deck
      return {
        x: 22,
        y: 12,
        scale: 0.93,
        rotate: 2,
        opacity: 0.88,
        zIndex: 20,
      };
    } else if (stackIndex === 2) {
      // 3rd Card in Deck
      return {
        x: 40,
        y: 22,
        scale: 0.86,
        rotate: 4,
        opacity: 0.65,
        zIndex: 10,
      };
    } else {
      // Hidden Cards behind deck
      return {
        x: 52,
        y: 30,
        scale: 0.80,
        rotate: 6,
        opacity: 0,
        zIndex: 0,
      };
    }
  };

  // Next Card Fly-Out & Stack Bounce Animation
  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const activeIndex = deck[0];
    const activeEl = cardsRef.current[activeIndex];

    if (!activeEl) {
      setDeck((prev) => {
        const next = [...prev];
        const first = next.shift()!;
        next.push(first);
        return next;
      });
      setIsAnimating(false);
      return;
    }

    // Timeline for fly-out & scale bounce
    const tl = gsap.timeline({
      onComplete: () => {
        // Reorder deck array: move front card to end
        setDeck((prev) => {
          const next = [...prev];
          const first = next.shift()!;
          next.push(first);
          return next;
        });
        setIsAnimating(false);
      },
    });

    // 1. Front card flies out smoothly to the left & fades slightly
    tl.to(activeEl, {
      x: -360,
      y: -20,
      rotation: -14,
      opacity: 0,
      scale: 0.88,
      duration: 0.55,
      ease: 'power3.in',
    });

    // 2. Animate remaining cards up with bouncy cubic-bezier curve
    deck.slice(1).forEach((slideIndex, i) => {
      const cardEl = cardsRef.current[slideIndex];
      if (!cardEl) return;

      const targetPos = getStackStyle(i); // New position after shift

      tl.to(
        cardEl,
        {
          x: targetPos.x,
          y: targetPos.y,
          scale: targetPos.scale,
          rotation: targetPos.rotate,
          opacity: targetPos.opacity,
          zIndex: targetPos.zIndex,
          duration: 0.65,
          ease: i === 0 ? 'back.out(1.7)' : 'power3.out', // Bouncy spring curve for new front card!
        },
        '-=0.45'
      );
    });
  }, [deck, isAnimating]);

  // Previous Card Fly-In Animation
  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const lastIndex = deck[deck.length - 1];
    const lastEl = cardsRef.current[lastIndex];

    if (!lastEl) {
      setDeck((prev) => {
        const next = [...prev];
        const last = next.pop()!;
        next.unshift(last);
        return next;
      });
      setIsAnimating(false);
      return;
    }

    // Update deck state first so last card comes to index 0
    const newDeck = [...deck];
    const lastItem = newDeck.pop()!;
    newDeck.unshift(lastItem);

    // Position last card off-screen left first
    gsap.set(lastEl, {
      x: -360,
      y: -20,
      rotation: -14,
      opacity: 0,
      scale: 0.88,
      zIndex: 35,
    });

    setDeck(newDeck);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
      },
    });

    // Fly in card from left to front with bouncy ease
    tl.to(lastEl, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      scale: 1,
      zIndex: 30,
      duration: 0.65,
      ease: 'back.out(1.7)',
    });

    // Push existing cards back in deck stack
    deck.forEach((slideIndex, i) => {
      const cardEl = cardsRef.current[slideIndex];
      if (!cardEl || slideIndex === lastIndex) return;

      const targetPos = getStackStyle(i + 1);

      tl.to(
        cardEl,
        {
          x: targetPos.x,
          y: targetPos.y,
          scale: targetPos.scale,
          rotation: targetPos.rotate,
          opacity: targetPos.opacity,
          zIndex: targetPos.zIndex,
          duration: 0.55,
          ease: 'power3.out',
        },
        '-=0.55'
      );
    });
  }, [deck, isAnimating]);

  // Autoplay timer
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      handleNext();
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [isHovered, handleNext]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[540px] mx-auto select-none py-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Ambient Glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-teal-400/20 rounded-[2rem] blur-2xl opacity-60 animate-pulse pointer-events-none" />

      {/* Layered Card Deck Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[14/11] cursor-pointer group" onClick={handleNext}>
        {CAROUSEL_SLIDES.map((slide, slideIndex) => {
          const stackIndex = deck.indexOf(slideIndex);
          const style = getStackStyle(stackIndex);

          return (
            <div
              key={slide.id}
              ref={(el) => {
                cardsRef.current[slideIndex] = el;
              }}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-primary/30 bg-slate-950 transition-shadow duration-300 hover:shadow-primary/20"
              style={{
                transform: `translate(${style.x}px, ${style.y}px) scale(${style.scale}) rotate(${style.rotate}deg)`,
                opacity: style.opacity,
                zIndex: style.zIndex,
                transformOrigin: 'bottom right',
                willChange: 'transform, opacity',
              }}
            >
              {/* Lifestyle Image */}
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                priority={stackIndex === 0}
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 540px"
              />

              {/* Ambient Edge Shader */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20 pointer-events-none" />
            </div>
          );
        })}

        {/* Hover Prev / Next Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-slate-950/80 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 hover:bg-primary hover:text-slate-950 transition-all shadow-xl backdrop-blur-md"
          aria-label="Previous image"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-slate-950/80 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 hover:bg-primary hover:text-slate-950 transition-all shadow-xl backdrop-blur-md"
          aria-label="Next image"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
