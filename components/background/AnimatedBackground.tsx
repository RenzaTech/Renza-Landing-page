'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LightBackground from './LightBackground';
import DarkBackground from './DarkBackground';
import TurquoiseBackground from './TurquoiseBackground';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type BackgroundTheme = 'dark' | 'light' | 'turquoise' | 'footer';
export type BackgroundVariant = BackgroundTheme | 'cta' | 'trust' | 'hero';

export interface AnimatedBackgroundProps {
  theme?: BackgroundTheme;
  variant?: BackgroundVariant;
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  theme,
  variant,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Layer Refs (Layer 1: ±4px, Layer 2: ±8px, Layer 3: ±12px)
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  // Light / Soft Turquoise Light Source Refs
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const glow3Ref = useRef<HTMLDivElement>(null);

  // Organic Blob Refs
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  // Flowing SVG Path Refs
  const pathGroup1Ref = useRef<SVGGElement>(null);
  const pathGroup2Ref = useRef<SVGGElement>(null);

  // Floating Orbs & Light Points Refs
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lightPointRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Dark fallback references
  const darkOrb1Ref = useRef<HTMLDivElement>(null);
  const darkOrb2Ref = useRef<HTMLDivElement>(null);
  const darkParticleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Dark mode tracking for automatic adaptation
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Determine effective theme
  let effectiveTheme: BackgroundTheme = 'light';
  if (theme === 'footer' || variant === 'footer') {
    effectiveTheme = 'footer';
  } else if (theme === 'turquoise' || variant === 'cta') {
    effectiveTheme = 'turquoise';
  } else if (theme === 'dark' || variant === 'dark' || variant === 'trust') {
    effectiveTheme = 'dark';
  } else if (theme === 'light' || variant === 'light' || variant === 'hero') {
    effectiveTheme = isDarkMode ? 'dark' : 'light';
  } else {
    effectiveTheme = isDarkMode ? 'dark' : 'light';
  }

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // ══════════════════════════════════════════════════════════════════════
      // LIGHT THEME ANIMATIONS
      // ══════════════════════════════════════════════════════════════════════
      if (effectiveTheme === 'light') {
        // ── 1. Soft Turquoise Light Drift ───────────────────────────────────
        // Light 1 (left: 10%, top: 30%): x: -60px → 60px, y: 20px → -30px
        if (glow1Ref.current) {
          gsap.set(glow1Ref.current, { x: -60, y: 20 });
          gsap.to(glow1Ref.current, {
            x: 60,
            y: -30,
            duration: 22,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }

        // Light 2 (right: 10%, top: 35%): x: 60px → -60px, y: -30px → 40px
        if (glow2Ref.current) {
          gsap.set(glow2Ref.current, { x: 60, y: -30 });
          gsap.to(glow2Ref.current, {
            x: -60,
            y: 40,
            duration: 26,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }

        // Light 3 (bottom: -10%, left: 40%): scale: 0.95 → 1.08 → 0.95
        if (glow3Ref.current) {
          gsap.set(glow3Ref.current, { scale: 0.95 });
          gsap.to(glow3Ref.current, {
            scale: 1.08,
            duration: 20,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }

        // ── 2. Organic Light Blobs Movement ─────────────────────────────────
        // Blob 1: x: -80px → 80px, y: -50px → 50px, rotation: -3deg → 3deg
        if (blob1Ref.current) {
          gsap.set(blob1Ref.current, { x: -80, y: -50, rotation: -3 });
          gsap.to(blob1Ref.current, {
            x: 80,
            y: 50,
            rotation: 3,
            duration: 23,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }

        // Blob 2: x: 70px → -70px, y: 40px → -40px, rotation: 2deg → -2deg
        if (blob2Ref.current) {
          gsap.set(blob2Ref.current, { x: 70, y: 40, rotation: 2 });
          gsap.to(blob2Ref.current, {
            x: -70,
            y: -40,
            rotation: -2,
            duration: 27,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }

        // Blob 3: scale: 0.92 → 1.08, rotation: -2deg → 2deg
        if (blob3Ref.current) {
          gsap.set(blob3Ref.current, { scale: 0.92, rotation: -2 });
          gsap.to(blob3Ref.current, {
            scale: 1.08,
            rotation: 2,
            duration: 31,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }

        // ── 3. Flowing Curved Paths Animation ───────────────────────────────
        // Path Group 1: x: 0 → 40px, y: 0 → -20px, rotation: 0 → 1deg
        if (pathGroup1Ref.current) {
          gsap.to(pathGroup1Ref.current, {
            x: 40,
            y: -20,
            rotation: 1,
            duration: 28,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }

        // Path Group 2: x: 0 → -35px, y: 0 → 18px, rotation: 0 → -0.8deg
        if (pathGroup2Ref.current) {
          gsap.to(pathGroup2Ref.current, {
            x: -35,
            y: 18,
            rotation: -0.8,
            duration: 34,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }

        // ── 4. Floating Orbs & Light Points ─────────────────────────────────
        orbRefs.current.forEach((orb, i) => {
          if (!orb) return;
          const xDrift = (i % 2 === 0 ? 1 : -1) * (20 + (i * 4) % 15);
          const yDrift = (i % 2 === 0 ? -1 : 1) * (25 + (i * 5) % 25);
          gsap.to(orb, {
            x: xDrift,
            y: yDrift,
            duration: 11 + (i % 5) * 1.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: (i % 4) * 0.6,
          });
        });

        lightPointRefs.current.forEach((pt, i) => {
          if (!pt) return;
          gsap.to(pt, {
            y: -(15 + (i * 3) % 15),
            x: (i % 2 === 0 ? 10 : -10),
            opacity: 0.16,
            duration: 7 + (i % 4) * 1.4,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: (i % 3) * 0.7,
          });
        });
      }

      // ══════════════════════════════════════════════════════════════════════
      // DARK / FOOTER / TURQUOISE THEME ANIMATIONS
      // ══════════════════════════════════════════════════════════════════════
      if (effectiveTheme === 'dark' || effectiveTheme === 'footer') {
        if (glow1Ref.current) {
          gsap.set(glow1Ref.current, { x: -80, y: 0 });
          gsap.to(glow1Ref.current, {
            x: 100,
            y: 60,
            duration: 19,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
        if (glow2Ref.current) {
          gsap.set(glow2Ref.current, { x: 80, y: 40 });
          gsap.to(glow2Ref.current, {
            x: -80,
            y: -40,
            duration: 23,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
        if (glow3Ref.current) {
          gsap.to(glow3Ref.current, {
            scale: 1.15,
            x: 40,
            duration: 26,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
        if (darkOrb1Ref.current) {
          gsap.to(darkOrb1Ref.current, {
            x: 35,
            y: -30,
            duration: 25,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
        if (darkOrb2Ref.current) {
          gsap.to(darkOrb2Ref.current, {
            x: -30,
            y: 35,
            duration: 31,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
        if (pathGroup1Ref.current) {
          gsap.to(pathGroup1Ref.current, {
            x: 40,
            rotation: 2,
            duration: 26,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
        if (pathGroup2Ref.current) {
          gsap.to(pathGroup2Ref.current, {
            x: -35,
            rotation: -1.5,
            duration: 33,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
        darkParticleRefs.current.forEach((p, i) => {
          if (!p) return;
          const xOffset = (i % 2 === 0 ? 1 : -1) * (20 + (i * 3) % 25);
          const yOffset = -(25 + (i * 4) % 35);
          gsap.to(p, {
            x: xOffset,
            y: yOffset,
            duration: 8 + (i % 7) * 1.3,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: (i % 6) * 0.4,
          });
        });
      } else if (effectiveTheme === 'turquoise') {
        if (glow1Ref.current) {
          gsap.to(glow1Ref.current, {
            x: 100,
            y: -50,
            duration: 20,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
        if (glow2Ref.current) {
          gsap.to(glow2Ref.current, {
            x: -80,
            y: 60,
            duration: 24,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
        if (glow3Ref.current) {
          gsap.to(glow3Ref.current, {
            scale: 1.1,
            duration: 22,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
      }

      // ══════════════════════════════════════════════════════════════════════
      // SCROLL PARALLAX (GSAP ScrollTrigger)
      // ══════════════════════════════════════════════════════════════════════
      // Background glows: y: 0 → -100px
      if (layer1Ref.current) {
        gsap.to(layer1Ref.current, {
          y: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // Organic blobs: y: 0 → -150px
      if (layer2Ref.current) {
        gsap.to(layer2Ref.current, {
          y: -150,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // Curves: y: 0 → -80px
      if (layer3Ref.current) {
        gsap.to(layer3Ref.current, {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // ══════════════════════════════════════════════════════════════════════
      // MOUSE PARALLAX (Desktop only, via gsap.quickTo)
      // Glow: ±4px | Blob: ±8px | Curves: ±12px
      // ══════════════════════════════════════════════════════════════════════
      if (
        typeof window !== 'undefined' &&
        window.innerWidth >= 1024 &&
        layer1Ref.current &&
        layer2Ref.current &&
        layer3Ref.current
      ) {
        const quickL1X = gsap.quickTo(layer1Ref.current, 'x', {
          duration: 1.2,
          ease: 'power2.out',
        });
        const quickL1Y = gsap.quickTo(layer1Ref.current, 'y', {
          duration: 1.2,
          ease: 'power2.out',
        });
        const quickL2X = gsap.quickTo(layer2Ref.current, 'x', {
          duration: 1.5,
          ease: 'power2.out',
        });
        const quickL2Y = gsap.quickTo(layer2Ref.current, 'y', {
          duration: 1.5,
          ease: 'power2.out',
        });
        const quickL3X = gsap.quickTo(layer3Ref.current, 'x', {
          duration: 1.8,
          ease: 'power2.out',
        });
        const quickL3Y = gsap.quickTo(layer3Ref.current, 'y', {
          duration: 1.8,
          ease: 'power2.out',
        });

        const handleMouseMove = (e: MouseEvent) => {
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          const dx = (e.clientX - cx) / cx;
          const dy = (e.clientY - cy) / cy;

          // Glow: ±4px, Blob: ±8px, Curves: ±12px
          quickL1X(dx * 4);
          quickL1Y(dy * 4);
          quickL2X(dx * 8);
          quickL2Y(dy * 8);
          quickL3X(dx * 12);
          quickL3Y(dy * 12);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
        };
      }
    }, containerRef);

    return () => ctx.revert();
  }, [effectiveTheme]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {effectiveTheme === 'turquoise' ? (
        <TurquoiseBackground
          layer1Ref={layer1Ref}
          layer2Ref={layer2Ref}
          layer3Ref={layer3Ref}
          glow1Ref={glow1Ref}
          glow2Ref={glow2Ref}
          glow3Ref={glow3Ref}
          orb1Ref={darkOrb1Ref}
          orb2Ref={darkOrb2Ref}
          path1Ref={pathGroup1Ref}
          path2Ref={pathGroup2Ref}
        />
      ) : effectiveTheme === 'dark' || effectiveTheme === 'footer' ? (
        <DarkBackground
          theme={effectiveTheme}
          layer1Ref={layer1Ref}
          layer2Ref={layer2Ref}
          layer3Ref={layer3Ref}
          glow1Ref={glow1Ref}
          glow2Ref={glow2Ref}
          glow3Ref={glow3Ref}
          orb1Ref={darkOrb1Ref}
          orb2Ref={darkOrb2Ref}
          path1Ref={pathGroup1Ref}
          path2Ref={pathGroup2Ref}
          particleRefs={darkParticleRefs}
        />
      ) : (
        <LightBackground
          layer1Ref={layer1Ref}
          layer2Ref={layer2Ref}
          layer3Ref={layer3Ref}
          glow1Ref={glow1Ref}
          glow2Ref={glow2Ref}
          glow3Ref={glow3Ref}
          blob1Ref={blob1Ref}
          blob2Ref={blob2Ref}
          blob3Ref={blob3Ref}
          pathGroup1Ref={pathGroup1Ref}
          pathGroup2Ref={pathGroup2Ref}
          orbRefs={orbRefs}
          lightPointRefs={lightPointRefs}
        />
      )}
    </div>
  );
};

export default AnimatedBackground;
