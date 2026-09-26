'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export const SplashScreen: React.FC = () => {
  const [isCompleted, setIsCompleted] = useState(false);

  // Main full-screen dark overlay container
  const overlayRef = useRef<HTMLDivElement>(null);

  // The centered traveling logo package (Icon + Wordmark)
  const logoTravelerRef = useRef<HTMLDivElement>(null);
  const logoIconRef = useRef<HTMLDivElement>(null);
  const logoGlowRef = useRef<HTMLDivElement>(null);
  const wordmarkWrapperRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Lock scrolling during splash sequence
    document.body.style.overflow = 'hidden';

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hasSeenIntro =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('renza_intro_seen') === 'true';

    const landingContent = document.getElementById('landing-page-content');

    const ctx = gsap.context(() => {
      // ══════════════════════════════════════════════════════════════════════
      // SCENARIO 1: ACCESSIBILITY — PREFERS REDUCED MOTION
      // ══════════════════════════════════════════════════════════════════════
      if (prefersReducedMotion) {
        if (wordmarkWrapperRef.current) {
          gsap.set(wordmarkWrapperRef.current, { clipPath: 'inset(0 0% 0 0)' });
        }
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.35,
          delay: 0.25,
          ease: 'power2.out',
          onComplete: () => {
            document.body.style.overflow = '';
            setIsCompleted(true);
            window.dispatchEvent(new CustomEvent('renza_splash_reveal'));
          },
        });
        return;
      }

      // ══════════════════════════════════════════════════════════════════════
      // SCENARIO 2: RETURN VISIT IN SAME SESSION (SHORT VERSION: ~0.6s)
      // ══════════════════════════════════════════════════════════════════════
      if (hasSeenIntro) {
        if (wordmarkWrapperRef.current) {
          gsap.set(wordmarkWrapperRef.current, { clipPath: 'inset(0 0% 0 0)' });
        }

        const shortTl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = '';
            setIsCompleted(true);
          },
        });

        shortTl
          .fromTo(
            logoTravelerRef.current,
            { opacity: 0, scale: 0.88, y: 15 },
            { opacity: 1, scale: 1, y: 0, duration: 0.32, ease: 'power3.out' }
          )
          .to(
            overlayRef.current,
            {
              opacity: 0,
              duration: 0.35,
              ease: 'power3.inOut',
              onStart: () => {
                window.dispatchEvent(new CustomEvent('renza_splash_reveal'));
              },
            },
            '+=0.15'
          );

        return;
      }

      // ══════════════════════════════════════════════════════════════════════
      // SCENARIO 3: FULL SIGNATURE BRAND SPLASH INTRO (~2.1s)
      // ══════════════════════════════════════════════════════════════════════
      // Initially mask the landing page behind the dark screen
      if (landingContent) {
        gsap.set(landingContent, { clipPath: 'circle(0% at 50% 50%)' });
      }

      const masterTl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          setIsCompleted(true);
          sessionStorage.setItem('renza_intro_seen', 'true');
        },
      });

      // 0.15s: SCENE 02 & 04 — Turquoise "R" Icon scales in with slight tilt
      masterTl.fromTo(
        logoIconRef.current,
        { scale: 0.72, rotation: -8, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        0.15
      );

      // 0.65s: SCENE 03 — Subtle Turquoise Brand Glow expands
      masterTl.fromTo(
        logoGlowRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1.25, opacity: 0.45, duration: 0.35, ease: 'power2.out' },
        0.65
      ).to(
        logoGlowRef.current,
        { opacity: 0, scale: 1.45, duration: 0.35, ease: 'power2.in' },
        1.0
      );

      // 0.90s: SCENE 05 — RENZA Wordmark reveals left-to-right
      masterTl.fromTo(
        wordmarkWrapperRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.45, ease: 'power3.inOut' },
        0.90
      );

      // 1.25s: SCENE 06 — Tagline appears below
      masterTl.fromTo(
        taglineRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' },
        1.25
      );

      // 1.55s: SCENE 07 & 08 — Tagline fades out rapidly
      masterTl.to(
        taglineRef.current,
        { opacity: 0, y: -6, duration: 0.2, ease: 'power2.in' },
        1.55
      );

      // 1.55s - 2.10s: LOGO TRAVELS TO NAVBAR POSITION
      masterTl.add(() => {
        const traveler = logoTravelerRef.current;
        const navLogo = document.getElementById('renza-nav-logo');

        if (traveler && navLogo) {
          const travelerRect = traveler.getBoundingClientRect();
          const targetRect = navLogo.getBoundingClientRect();

          const travelerCenterX = travelerRect.left + travelerRect.width / 2;
          const travelerCenterY = travelerRect.top + travelerRect.height / 2;
          const targetCenterX = targetRect.left + targetRect.width / 2;
          const targetCenterY = targetRect.top + targetRect.height / 2;

          const deltaX = targetCenterX - travelerCenterX;
          const deltaY = targetCenterY - travelerCenterY;
          const targetScale = targetRect.height / travelerRect.height;

          // Glide traveler to exact navbar logo position
          gsap.to(traveler, {
            x: deltaX,
            y: deltaY,
            scale: targetScale,
            duration: 0.55,
            ease: 'power4.inOut',
            onComplete: () => {
              gsap.set(traveler, { opacity: 0 });
              gsap.set(navLogo, { opacity: 1 });
            },
          });
        }
      }, 1.55);

      // 1.70s: SCENE REVEAL — Landing page reveals from center via circular expansion
      if (landingContent) {
        masterTl.to(
          landingContent,
          {
            clipPath: 'circle(150% at 50% 50%)',
            duration: 0.5,
            ease: 'power4.inOut',
            onStart: () => {
              window.dispatchEvent(new CustomEvent('renza_splash_reveal'));
            },
            onComplete: () => {
              gsap.set(landingContent, { clearProps: 'clipPath' });
            },
          },
          1.70
        );
      }

      // 2.10s - 2.20s: Overlay fades out completely
      masterTl.to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.15,
          ease: 'power2.out',
        },
        2.05
      );
    }, overlayRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, []);

  if (isCompleted) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#071313] pointer-events-auto select-none"
      aria-label="RENZA intro"
      role="dialog"
      aria-modal="true"
    >
      {/* Subtle Atmospheric Turquoise Center Ambient Glow */}
      <div
        className="absolute w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] rounded-full blur-[110px] sm:blur-[140px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(0, 210, 196, 0.22) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Center Branding Content */}
      <div className="relative flex flex-col items-center justify-center px-4">
        {/* The Traveling Logo Container (Icon + Wordmark) */}
        <div
          ref={logoTravelerRef}
          className="relative flex items-center gap-3 sm:gap-3.5 origin-center"
          style={{ willChange: 'transform' }}
        >
          {/* Subtle activation glow behind the icon */}
          <div
            ref={logoGlowRef}
            className="absolute -inset-4 rounded-3xl bg-[#00D2C4] blur-xl opacity-0 pointer-events-none"
            style={{ willChange: 'transform, opacity' }}
          />

          {/* Turquoise "R" Icon Box */}
          <div
            ref={logoIconRef}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#00D2C4] flex items-center justify-center shadow-xl shadow-[#00D2C4]/35 opacity-0"
            style={{ willChange: 'transform, opacity' }}
          >
            <span className="text-white font-bold text-2xl sm:text-3xl leading-none tracking-tight font-poppins">
              R
            </span>
          </div>

          {/* RENZA Wordmark with clip-path reveal */}
          <div
            ref={wordmarkWrapperRef}
            className="overflow-hidden"
            style={{
              clipPath: 'inset(0 100% 0 0)',
              willChange: 'clip-path',
            }}
          >
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-poppins inline-block pr-1">
              RENZA
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="mt-4 sm:mt-5 text-xs sm:text-sm text-slate-400 font-medium tracking-wide text-center opacity-0 font-poppins"
          style={{ willChange: 'transform, opacity' }}
        >
          Household help, whenever you need it.
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
