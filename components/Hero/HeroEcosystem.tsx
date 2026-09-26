'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Home, CheckCircle, MapPin, Calendar, Sparkles, Clock } from 'lucide-react';
import Image from 'next/image';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface PersonNode {
  id: string;
  imageSrc: string;
  label: string;
  role: string;
  angle: number;       // Starting angle on orbit (degrees)
  orbitRadius: number;
  size: number;        // Avatar size px
  orbitDuration: number;
  direction: 1 | -1;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const PEOPLE: PersonNode[] = [
  {
    id: 'customer',
    imageSrc: '/images/renza-customer-1.jpg',
    label: 'Customer',
    role: 'Book a helper',
    angle: 75,
    orbitRadius: 195,
    size: 88,
    orbitDuration: 26,
    direction: 1,
  },
  {
    id: 'helper1',
    imageSrc: '/images/renza-helper-1.jpg',
    label: 'RENZA Helper',
    role: '✓ Verified',
    angle: 210,
    orbitRadius: 195,
    size: 88,
    orbitDuration: 26,
    direction: 1,
  },
  {
    id: 'helper2',
    imageSrc: '/images/renza-helper-2.jpg',
    label: 'RENZA Helper',
    role: '✓ Available',
    angle: 330,
    orbitRadius: 195,
    size: 80,
    orbitDuration: 38,
    direction: -1,
  },
];

const FLOAT_ICONS = [
  { Icon: Home,         top: '12%', left: '14%',  size: 14, delay: 0 },
  { Icon: CheckCircle,  top: '20%', right: '10%', size: 12, delay: 1.5 },
  { Icon: MapPin,       bottom: '22%', left: '10%', size: 12, delay: 0.7 },
  { Icon: Calendar,     bottom: '14%', right: '12%', size: 13, delay: 2.2 },
  { Icon: Sparkles,     top: '50%', left: '6%',   size: 11, delay: 1 },
  { Icon: Clock,        top: '45%', right: '7%',  size: 11, delay: 3 },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function degToRad(d: number) { return (d * Math.PI) / 180; }

function posOnCircle(angleDeg: number, radius: number) {
  const rad = degToRad(angleDeg);
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Single avatar + label rendered at a fixed pixel offset from center */
function PersonAvatar({ person }: { person: PersonNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Initial position
  const pos = posOnCircle(person.angle, person.orbitRadius);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!wrapRef.current || !imgRef.current) return;

    const wrap = wrapRef.current;
    const img  = imgRef.current;
    const badge = badgeRef.current;

    // Set initial position based on orbit
    gsap.set(wrap, { x: pos.x, y: pos.y });

    if (prefersReduced) return;

    // ── Continuous orbit ──────────────────────────────────────────────────
    const orbitObj = { angle: person.angle };
    const radius = person.orbitRadius;

    gsap.to(orbitObj, {
      angle: person.angle + person.direction * 360,
      duration: person.orbitDuration,
      ease: 'none',
      repeat: -1,
      onUpdate: () => {
        const p = posOnCircle(orbitObj.angle, radius);
        gsap.set(wrap, { x: p.x, y: p.y });
      },
    });

    // ── Idle float on the avatar image itself ─────────────────────────────
    if (person.id === 'customer') {
      gsap.to(img, {
        y: -10,
        duration: 5.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    } else {
      gsap.to(img, {
        x: person.id === 'helper1' ? -7 : 6,
        y: person.id === 'helper1' ? 6  : -5,
        scale: 1.025,
        duration: person.id === 'helper1' ? 6 : 7.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }

    // ── Glow pulse ────────────────────────────────────────────────────────
    gsap.to(img.querySelector('.avatar-glow') as HTMLElement, {
      opacity: 0.55,
      scale: 1.08,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 2,
    });

    // ── Mouse parallax quickTo ────────────────────────────────────────────
    const qx = gsap.quickTo(img, 'x', { duration: 0.5, ease: 'power2.out' });
    const qy = gsap.quickTo(img, 'y', { duration: 0.5, ease: 'power2.out' });

    const onMove = (e: MouseEvent) => {
      const rect = document.documentElement.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      qx(dx * 15);
      qy(dy * 15);
    };
    window.addEventListener('mousemove', onMove);

    // ── Hover interaction ─────────────────────────────────────────────────
    const onEnter = () => {
      gsap.to(img, { scale: 1.09, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      if (badge) gsap.to(badge, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.inOut', overwrite: 'auto' });
      if (badge) gsap.to(badge, { opacity: 0, y: 6, duration: 0.25, ease: 'power2.in' });
    };
    img.addEventListener('mouseenter', onEnter);
    img.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      img.removeEventListener('mouseenter', onEnter);
      img.removeEventListener('mouseleave', onLeave);
    };
  }, [person, pos.x, pos.y]);

  return (
    <div
      ref={wrapRef}
      className="person-node absolute"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transformOrigin: 'center center',
      }}
    >
      {/* Avatar wrapper */}
      <div ref={imgRef} className="relative cursor-pointer" style={{ willChange: 'transform' }}>
        {/* Glow ring */}
        <div
          className="avatar-glow absolute inset-0 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(0,210,196,0.6) 0%, transparent 70%)',
            filter: 'blur(8px)',
            transform: 'scale(1.3)',
            zIndex: 0,
          }}
        />

        {/* Avatar circle */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: person.size,
            height: person.size,
            border: '2.5px solid rgba(0,210,196,0.5)',
            boxShadow: '0 0 20px rgba(0,210,196,0.25), 0 8px 32px rgba(0,0,0,0.5)',
            zIndex: 1,
          }}
        >
          <Image
            src={person.imageSrc}
            alt={person.label}
            fill
            className="object-cover object-top"
            priority
            sizes={`${person.size}px`}
          />
        </div>

        {/* Label below avatar */}
        <div className="mt-2 text-center">
          <p
            className="text-[10px] font-bold"
            style={{ color: '#00D2C4', letterSpacing: '0.04em' }}
          >
            {person.label}
          </p>
        </div>

        {/* Hover badge */}
        <div
          ref={badgeRef}
          className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold px-2.5 py-1 rounded-full opacity-0 translate-y-1.5"
          style={{
            background: 'rgba(0,210,196,0.18)',
            border: '1px solid rgba(0,210,196,0.4)',
            color: '#00D2C4',
            backdropFilter: 'blur(8px)',
          }}
        >
          {person.role}
        </div>
      </div>
    </div>
  );
}

/** Animated booking particle that travels customer → center → helper */
function BookingParticle({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !dotRef.current) return;

    const dot = dotRef.current;
    const label = labelRef.current;

    const runCycle = () => {
      // Customer starts at ~75° on 195px orbit
      const startPos = posOnCircle(75, 195);
      const centerPos = { x: 0, y: 0 };
      const helperPos = posOnCircle(210, 195);

      const tl = gsap.timeline({ delay: 4, onComplete: () => setTimeout(runCycle, 8000) });

      tl.set(dot, { x: startPos.x, y: startPos.y, opacity: 0, scale: 0 })
        .to(dot, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' })
        // Travel to center
        .to(dot, { x: centerPos.x, y: centerPos.y, duration: 1.4, ease: 'power2.inOut' })
        // Hub flash
        .to('.renza-hub-glow', { opacity: 0.9, scale: 1.15, duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1 }, '-=0.1')
        // Travel to helper
        .to(dot, { x: helperPos.x, y: helperPos.y, duration: 1.4, ease: 'power2.inOut' })
        .to(dot, { opacity: 0, scale: 0, duration: 0.3 })
        // Show "Helper Assigned" label
        .set(label, { x: helperPos.x, y: helperPos.y - 60, opacity: 0, scale: 0.8 })
        .to(label, { opacity: 1, scale: 1, y: helperPos.y - 70, duration: 0.4, ease: 'back.out(2)' })
        .to(label, { opacity: 0, y: helperPos.y - 80, duration: 0.5, ease: 'power2.in', delay: 1.5 });
    };

    runCycle();
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="absolute pointer-events-none"
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#00D2C4',
          boxShadow: '0 0 12px 4px rgba(0,210,196,0.8)',
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
          opacity: 0,
          zIndex: 20,
        }}
      />
      <div
        ref={labelRef}
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 9,
          fontWeight: 700,
          color: '#00D2C4',
          background: 'rgba(0,210,196,0.12)',
          border: '1px solid rgba(0,210,196,0.4)',
          borderRadius: 20,
          padding: '3px 10px',
          opacity: 0,
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
          zIndex: 20,
        }}
      >
        ✓ Helper Assigned
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ECOSYSTEM COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroEcosystem() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const outerRingRef   = useRef<HTMLDivElement>(null);
  const middleRingRef  = useRef<HTMLDivElement>(null);
  const innerRingRef   = useRef<HTMLDivElement>(null);
  const hubRef         = useRef<HTMLDivElement>(null);
  const hubGlowRef     = useRef<HTMLDivElement>(null);
  const nodesRef       = useRef<HTMLDivElement>(null);
  const iconsRef       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // Just fade everything in
        gsap.to([hubRef.current, nodesRef.current, outerRingRef.current, middleRingRef.current, innerRingRef.current], {
          opacity: 1, duration: 1,
        });
        return;
      }

      // ── ENTRANCE TIMELINE ──────────────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.6 });

      // Step 1: Background glow
      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' }
      );

      // Step 2: Rings fade in staggered
      tl.fromTo(
        [outerRingRef.current, middleRingRef.current, innerRingRef.current],
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2, stagger: 0.15, ease: 'power2.out' },
        '-=0.4'
      );

      // Step 3: Hub appears
      tl.fromTo(
        hubRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.4)' },
        '-=0.6'
      );

      // Step 4-6: Person nodes appear
      const personNodes = nodesRef.current?.querySelectorAll('.person-node');
      if (personNodes) {
        tl.fromTo(
          personNodes,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.7, stagger: 0.18, ease: 'back.out(1.6)' },
          '-=0.3'
        );
      }

      // Step 7: Floating icons
      const floatIcons = iconsRef.current?.querySelectorAll('.float-icon');
      if (floatIcons) {
        tl.fromTo(
          floatIcons,
          { opacity: 0, scale: 0, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' },
          '-=0.4'
        );
      }

      // ── CONTINUOUS ANIMATIONS ──────────────────────────────────────────

      // Outer ring slow rotation
      gsap.to(outerRingRef.current, {
        rotation: 360,
        duration: 120,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      });

      // Middle ring counter-rotate
      gsap.to(middleRingRef.current, {
        rotation: -360,
        duration: 80,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      });

      // Hub glow breathe
      gsap.to(hubGlowRef.current, {
        opacity: 0.7,
        scale: 1.12,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Hub subtle float
      gsap.to(hubRef.current, {
        y: -8,
        duration: 6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Floating icons animation
      const floatEls = iconsRef.current?.querySelectorAll('.float-icon');
      if (floatEls) {
        floatEls.forEach((el, i) => {
          gsap.to(el, {
            y: -(12 + i * 4),
            x: (i % 2 === 0 ? 1 : -1) * 6,
            duration: 4 + i * 0.6,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.5,
          });
        });
      }

      // ── MOUSE PARALLAX ─────────────────────────────────────────────────
      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
      if (!isTouchDevice) {
        const qxOuter = gsap.quickTo(outerRingRef.current,  'x', { duration: 1.2, ease: 'power1.out' });
        const qyOuter = gsap.quickTo(outerRingRef.current,  'y', { duration: 1.2, ease: 'power1.out' });
        const qxMid   = gsap.quickTo(middleRingRef.current, 'x', { duration: 1, ease: 'power1.out' });
        const qyMid   = gsap.quickTo(middleRingRef.current, 'y', { duration: 1, ease: 'power1.out' });
        const qxHub   = gsap.quickTo(hubRef.current,        'x', { duration: 0.9, ease: 'power1.out' });
        const qyHub   = gsap.quickTo(hubRef.current,        'y', { duration: 0.9, ease: 'power1.out' });

        const onMove = (e: MouseEvent) => {
          const rect = document.documentElement.getBoundingClientRect();
          const cx = rect.width  / 2;
          const cy = rect.height / 2;
          const dx = (e.clientX - cx) / cx;
          const dy = (e.clientY - cy) / cy;

          qxOuter(dx * 10);  qyOuter(dy * 10);
          qxMid(dx * 14);    qyMid(dy * 14);
          qxHub(dx * 8);     qyHub(dy * 8);
        };

        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  const OUTER_R  = 290;
  const MIDDLE_R = 210;
  const INNER_R  = 130;
  const HUB_SIZE = 148;

  return (
    <div
      className="relative w-full flex items-center justify-center select-none"
      style={{ height: 540, opacity: 0 }}
      ref={containerRef}
      aria-hidden="true"
    >
      {/* ── Background deep glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0,210,196,0.09) 0%, transparent 68%)',
        }}
      />

      {/* ── Outer ring ── */}
      <div
        ref={outerRingRef}
        className="absolute rounded-full"
        style={{
          width:  OUTER_R * 2,
          height: OUTER_R * 2,
          border: '1px solid rgba(0,210,196,0.10)',
          borderTopColor: 'rgba(0,210,196,0.28)',
          opacity: 0,
        }}
      />

      {/* ── Middle ring (orbit path) ── */}
      <div
        ref={middleRingRef}
        className="absolute rounded-full"
        style={{
          width:  MIDDLE_R * 2,
          height: MIDDLE_R * 2,
          border: '1px dashed rgba(0,210,196,0.20)',
          opacity: 0,
        }}
      />

      {/* ── Inner ring ── */}
      <div
        ref={innerRingRef}
        className="absolute rounded-full"
        style={{
          width:  INNER_R * 2,
          height: INNER_R * 2,
          border: '1px solid rgba(0,210,196,0.12)',
          opacity: 0,
        }}
      />

      {/* ── Person nodes layer ── */}
      <div
        ref={nodesRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        {PEOPLE.map((p) => (
          <PersonAvatar key={p.id} person={p} />
        ))}
        {/* Booking particle */}
        <BookingParticle containerRef={containerRef} />
      </div>

      {/* ── RENZA Hub (center) ── */}
      <div
        ref={hubRef}
        className="relative flex flex-col items-center justify-center z-10"
        style={{ width: HUB_SIZE, height: HUB_SIZE, opacity: 0 }}
      >
        {/* Hub outer glow */}
        <div
          ref={hubGlowRef}
          className="renza-hub-glow absolute inset-0 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(0,210,196,0.55) 0%, transparent 70%)',
            filter: 'blur(18px)',
            transform: 'scale(1.4)',
          }}
        />

        {/* Hub disc */}
        <div
          className="relative w-full h-full rounded-full flex flex-col items-center justify-center gap-1"
          style={{
            background: 'linear-gradient(145deg, #0B1B1B 0%, #061313 100%)',
            border: '2px solid rgba(0,210,196,0.4)',
            boxShadow: '0 0 40px rgba(0,210,196,0.2), inset 0 0 30px rgba(0,210,196,0.06)',
          }}
        >
          {/* Logo */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-0.5"
            style={{ background: 'rgba(0,210,196,0.18)', border: '1px solid rgba(0,210,196,0.3)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#00D2C4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12h6v10" stroke="#00D2C4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span
            className="font-bold tracking-widest text-sm"
            style={{ color: '#00D2C4', letterSpacing: '0.12em' }}
          >
            RENZA
          </span>
          <span
            className="text-center leading-tight px-2"
            style={{ fontSize: 7, color: 'rgba(255,255,255,0.45)', maxWidth: 110 }}
          >
            Household Help, Whenever You Need It
          </span>
        </div>
      </div>

      {/* ── Floating household icons ── */}
      <div
        ref={iconsRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0 }}
      >
        {FLOAT_ICONS.map(({ Icon, size, delay, ...pos }, i) => (
          <div
            key={i}
            className="float-icon absolute flex items-center justify-center rounded-full"
            style={{
              ...pos,
              width: size + 16,
              height: size + 16,
              background: 'rgba(0,210,196,0.08)',
              border: '1px solid rgba(0,210,196,0.18)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Icon size={size} color="rgba(0,210,196,0.7)" />
          </div>
        ))}
      </div>
    </div>
  );
}
