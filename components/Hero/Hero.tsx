'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO_SCENES } from './heroData';
import HeroBookingBar from './HeroBookingBar';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Main Section & Layers Refs
  const heroRef = useRef<HTMLElement>(null);
  const bgLayersRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<HTMLDivElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);

  // Scene Slides & Images Refs
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Center Elements Refs (for initial entrance animation)
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const bookingBarRef = useRef<HTMLDivElement>(null);

  // Animation Handlers & State Refs
  const autoPlayCallRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);
  const continuousZoomTweenRef = useRef<gsap.core.Tween | null>(null);
  const isReducedMotion = useRef(false);

  // Stable reference to scene transition to prevent circular dependencies
  const transitionToSceneRef = useRef<(index: number) => void>(() => {});

  // Parallax quickTo instances
  const mouseQuickToRef = useRef<{
    bgX?: ReturnType<typeof gsap.quickTo>;
    bgY?: ReturnType<typeof gsap.quickTo>;
    overlayX?: ReturnType<typeof gsap.quickTo>;
    overlayY?: ReturnType<typeof gsap.quickTo>;
    lightsX?: ReturnType<typeof gsap.quickTo>;
    lightsY?: ReturnType<typeof gsap.quickTo>;
  }>({});

  const SCENE_DURATION = 5.5; // 5.5 seconds per scene

  // Ken-Burns Continuous Zoom on Active Slide Image
  const startContinuousZoom = useCallback((index: number) => {
    if (continuousZoomTweenRef.current) continuousZoomTweenRef.current.kill();
    const activeImgContainer = imageRefs.current[index];
    if (!activeImgContainer || isReducedMotion.current) return;

    gsap.set(activeImgContainer, { scale: 1.0 });
    continuousZoomTweenRef.current = gsap.to(activeImgContainer, {
      scale: 1.04,
      duration: SCENE_DURATION,
      ease: 'sine.out',
    });
  }, [SCENE_DURATION]);

  // Auto-advance Timer Scheduler
  const startAutoPlayScheduler = useCallback(
    (activeIdx: number) => {
      if (autoPlayCallRef.current) autoPlayCallRef.current.kill();

      autoPlayCallRef.current = gsap.delayedCall(SCENE_DURATION, () => {
        const nextIdx = (activeIdx + 1) % HERO_SCENES.length;
        transitionToSceneRef.current(nextIdx);
      });
    },
    [SCENE_DURATION]
  );

  // Main Scene Transition Logic (GSAP Cinematic Wipe + Ken-Burns Pan)
  const transitionToScene = useCallback(
    (targetIndex: number) => {
      if (isAnimating || targetIndex === currentIndex) return;

      setIsAnimating(true);
      const prevIndex = currentIndex;
      const prevSlide = slideRefs.current[prevIndex];
      const prevImg = imageRefs.current[prevIndex];
      const nextSlide = slideRefs.current[targetIndex];
      const nextImg = imageRefs.current[targetIndex];

      // Cancel current timer and zoom tween
      if (autoPlayCallRef.current) autoPlayCallRef.current.kill();
      if (continuousZoomTweenRef.current) continuousZoomTweenRef.current.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentIndex(targetIndex);
          setIsAnimating(false);
          startContinuousZoom(targetIndex);
          startAutoPlayScheduler(targetIndex);
        },
      });

      // Prepare target slide z-index
      if (nextSlide) {
        gsap.set(nextSlide, { zIndex: 20, opacity: 1, pointerEvents: 'auto' });
      }
      if (prevSlide) {
        gsap.set(prevSlide, { zIndex: 10, pointerEvents: 'none' });
      }

      if (isReducedMotion.current) {
        // Fallback for reduced motion
        tl.to(prevSlide, { opacity: 0, duration: 0.6 });
        tl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '<');
      } else {
        // Outgoing Slide Animation
        if (prevImg) {
          tl.to(
            prevImg,
            {
              scale: 1.05,
              x: -30,
              duration: 1.4,
              ease: 'power3.inOut',
            },
            0
          );
        }
        if (prevSlide) {
          tl.to(
            prevSlide,
            {
              opacity: 0,
              duration: 1.3,
              ease: 'power3.inOut',
            },
            0.15
          );
        }

        // Incoming Slide Cinematic Reveal (Clip-Path Wipe + Zoom In + Pan In)
        if (nextSlide) {
          tl.fromTo(
            nextSlide,
            {
              clipPath: 'inset(0% 0% 0% 100%)',
              opacity: 1,
            },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              opacity: 1,
              duration: 1.5,
              ease: 'power4.inOut',
            },
            0
          );
        }

        if (nextImg) {
          tl.fromTo(
            nextImg,
            {
              scale: 1.08,
              x: 40,
              opacity: 0.8,
            },
            {
              scale: 1.0,
              x: 0,
              opacity: 1,
              duration: 1.5,
              ease: 'power3.out',
            },
            0
          );
        }
      }
    },
    [currentIndex, isAnimating, startContinuousZoom, startAutoPlayScheduler]
  );

  useEffect(() => {
    transitionToSceneRef.current = transitionToScene;
  }, [transitionToScene]);

  // Initial Mount Animation, Mouse Parallax & ScrollTrigger Context
  useEffect(() => {
    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isFirstVisit =
      typeof window !== 'undefined' && !sessionStorage.getItem('renza_intro_seen');

    const ctx = gsap.context(() => {
      // 1. Initial Hero Mount Animation Timeline
      const initTl = gsap.timeline({ paused: isFirstVisit });

      // Animate background fade-in
      initTl
        .fromTo(
          bgLayersRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.9, ease: 'power2.out' }
        )
        .fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.7, ease: 'power2.out' },
          '-=0.6'
        )
        .fromTo(
          headlineRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          '-=0.35'
        )
        .fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          bookingBarRef.current,
          { y: 25, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' },
          '-=0.35'
        );

      // Splash Screen Synchronisation
      if (isFirstVisit) {
        const handleReveal = () => {
          if (initTl.paused()) initTl.play();
        };
        window.addEventListener('renza_splash_reveal', handleReveal, { once: true });
        // Fallback safety timeout if splash doesn't trigger
        setTimeout(() => {
          if (initTl.paused()) initTl.play();
        }, 2200);
      }

      // Start initial Ken-Burns & Auto-play scheduler
      startContinuousZoom(0);
      startAutoPlayScheduler(0);

      // 2. Subtle Moving Turquoise Atmosphere Lights (15-25s slow ambient drift)
      const lightElements = lightsRef.current?.children;
      if (lightElements && lightElements.length > 0 && !isReducedMotion.current) {
        gsap.to(lightElements[0], {
          x: 40,
          y: 30,
          scale: 1.1,
          opacity: 0.14,
          duration: 18,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        if (lightElements[1]) {
          gsap.to(lightElements[1], {
            x: -50,
            y: -25,
            scale: 0.9,
            opacity: 0.12,
            duration: 22,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
      }

      // 3. Desktop Mouse Parallax using GSAP quickTo (Desktop Only, Pointer Fine)
      if (
        typeof window !== 'undefined' &&
        window.innerWidth >= 1024 &&
        window.matchMedia('(pointer: fine)').matches &&
        !isReducedMotion.current
      ) {
        mouseQuickToRef.current = {
          bgX: gsap.quickTo(bgLayersRef.current, 'x', { duration: 0.8, ease: 'power2.out' }),
          bgY: gsap.quickTo(bgLayersRef.current, 'y', { duration: 0.8, ease: 'power2.out' }),
          overlayX: gsap.quickTo(overlayRef.current, 'x', { duration: 1.0, ease: 'power2.out' }),
          overlayY: gsap.quickTo(overlayRef.current, 'y', { duration: 1.0, ease: 'power2.out' }),
          lightsX: gsap.quickTo(lightsRef.current, 'x', { duration: 1.4, ease: 'power2.out' }),
          lightsY: gsap.quickTo(lightsRef.current, 'y', { duration: 1.4, ease: 'power2.out' }),
        };

        const handleMouseMove = (e: MouseEvent) => {
          if (!heroRef.current) return;
          const rect = heroRef.current.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;

          // Parallax displacements:
          // Background photo: ±8px
          // Dark Overlay: ±4px
          // Atmosphere lights: ±2px
          mouseQuickToRef.current.bgX?.(relX * 16);
          mouseQuickToRef.current.bgY?.(relX * 16);
          mouseQuickToRef.current.overlayX?.(relX * 8);
          mouseQuickToRef.current.overlayY?.(relY * 8);
          mouseQuickToRef.current.lightsX?.(relX * 4);
          mouseQuickToRef.current.lightsY?.(relY * 4);
        };

        const heroEl = heroRef.current;
        heroEl?.addEventListener('mousemove', handleMouseMove);

        return () => {
          heroEl?.removeEventListener('mousemove', handleMouseMove);
        };
      }

      // 4. Hero Parallax ScrollTrigger
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress;
          if (centerContentRef.current) {
            gsap.set(centerContentRef.current, {
              y: -50 * p,
              opacity: 1 - 0.75 * p,
            });
          }
          if (bgLayersRef.current) {
            gsap.set(bgLayersRef.current, {
              scale: 1 + 0.05 * p,
            });
          }
        },
      });
    }, heroRef);

    return () => {
      ctx.revert();
      if (autoPlayCallRef.current) autoPlayCallRef.current.kill();
      if (continuousZoomTweenRef.current) continuousZoomTweenRef.current.kill();
    };
  }, [startContinuousZoom, startAutoPlayScheduler]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full min-h-screen h-[100svh] min-h-[680px] flex flex-col justify-center items-center text-center overflow-hidden bg-[#071313] select-none pt-20 sm:pt-24 pb-8 sm:pb-12"
      aria-label="RENZA On-Demand Household Help"
    >
      {/* ============================================================ */}
      {/* LAYER 1: Full-Bleed Photographic Carousel Scenes              */}
      {/* ============================================================ */}
      <div
        ref={bgLayersRef}
        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform scale-[1.02]"
        aria-hidden="true"
      >
        {HERO_SCENES.map((scene, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={scene.id}
              ref={(el) => {
                slideRefs.current[idx] = el;
              }}
              className={`absolute inset-0 w-full h-full will-change-transform ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div
                ref={(el) => {
                  imageRefs.current[idx] = el;
                }}
                className="relative w-full h-full will-change-transform origin-center"
              >
                <Image
                  src={scene.image}
                  alt={scene.alt}
                  fill
                  priority={idx < 2}
                  sizes="100vw"
                  quality={88}
                  className="object-cover object-center"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* LAYER 2: Subtle Moving Turquoise Atmospheric Lighting         */}
      {/* ============================================================ */}
      <div
        ref={lightsRef}
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10 will-change-transform"
        aria-hidden="true"
      >
        {/* Top-Left Ambient Orb */}
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-[#00D2C4]/[0.08] blur-[130px]" />
        {/* Bottom-Right Ambient Orb */}
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#00D2C4]/[0.07] blur-[140px]" />
        {/* Center-Top Ambient Orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-[#00D2C4]/[0.05] blur-[110px]" />
      </div>

      {/* ============================================================ */}
      {/* LAYER 3: Dark Overlays & Readability Gradients               */}
      {/* ============================================================ */}
      <div
        ref={overlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-15 will-change-transform"
        aria-hidden="true"
      >
        {/* Top-to-Bottom Linear Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071313]/75 via-[#071313]/55 to-[#071313]/85" />
        {/* Center Radial Readability Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 48%, rgba(7, 19, 19, 0.35) 0%, rgba(7, 19, 19, 0.78) 100%)',
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* LAYER 4: Centered Hero Content                                */}
      {/* ============================================================ */}
      <div
        ref={centerContentRef}
        className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center my-auto"
      >
        {/* Large Centered Headline */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] xl:text-[78px] font-bold text-white tracking-tight leading-[1.04] max-w-[900px] mb-5 sm:mb-6 drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]"
        >
          Household help,
          <br />
          <span className="text-[#00D2C4]">whenever you need it.</span>
        </h1>

        {/* Supporting Description */}
        <p
          ref={descRef}
          className="text-base sm:text-lg md:text-xl text-white/90 max-w-[700px] mx-auto mb-7 sm:mb-9 leading-relaxed font-normal drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]"
        >
          Book a trained and verified RENZA Helper for cleaning, laundry, kitchen work and everyday
          household tasks.
        </p>

        {/* Main Central Booking Bar */}
        <div ref={bookingBarRef} className="w-full">
          <HeroBookingBar />
        </div>
      </div>
    </section>
  );
}
