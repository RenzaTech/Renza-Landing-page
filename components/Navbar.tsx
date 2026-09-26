'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Initialize theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('renza-theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('renza-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const isFirstVisit =
      typeof window !== 'undefined' &&
      !sessionStorage.getItem('renza_intro_seen');

    const animateNavIn = () => {
      gsap.fromTo(
        navRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );
    };

    if (isFirstVisit) {
      gsap.set(navRef.current, { y: -60, opacity: 0 });
      const handleReveal = () => animateNavIn();
      window.addEventListener('renza_splash_reveal', handleReveal, { once: true });
      const fallback = setTimeout(animateNavIn, 2200);

      const st = ScrollTrigger.create({
        start: 'top -40',
        onUpdate: (self) => {
          setIsScrolled(self.scroll() > 40);
        },
      });

      return () => {
        window.removeEventListener('renza_splash_reveal', handleReveal);
        clearTimeout(fallback);
        st.kill();
      };
    } else {
      animateNavIn();
      const st = ScrollTrigger.create({
        start: 'top -40',
        onUpdate: (self) => {
          setIsScrolled(self.scroll() > 40);
        },
      });

      return () => st.kill();
    }
  }, []);

  useEffect(() => {
    if (mobileMenuRef.current && isMobileMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isMobileMenuOpen]);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#071313]/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800/80 py-3'
          : 'bg-[#071313]/[0.18] backdrop-blur-[8px] border-b border-white/10 py-4 sm:py-5'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-renza">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            id="renza-nav-logo"
            href="#home"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group cursor-pointer"
            aria-label="RENZA Home"
          >
            <div className="w-9 h-9 rounded-xl bg-[#00D2C4] flex items-center justify-center shadow-md shadow-[#00D2C4]/25 group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-lg leading-none">R</span>
            </div>
            <span
              className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                isScrolled ? 'text-[#071313] dark:text-white' : 'text-white'
              }`}
            >
              RENZA
            </span>
          </a>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-sm ${
                isScrolled
                  ? 'border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-[#00D2C4] hover:text-[#00D2C4]'
                  : 'border border-white/15 bg-white/10 backdrop-blur-md text-white hover:border-[#00D2C4] hover:text-[#00D2C4]'
              }`}
            >
              {mounted && theme === 'dark' ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className={isScrolled ? 'text-slate-700 dark:text-slate-300' : 'text-white'} />
              )}
            </button>

            <button
              className={`text-sm font-semibold px-3.5 sm:px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer ${
                isScrolled
                  ? 'text-slate-700 dark:text-slate-300 hover:text-[#00D2C4] hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Login to account"
            >
              Login
            </button>

            <a
              href="#footer-download"
              className="inline-flex items-center gap-2 bg-[#00D2C4] hover:bg-[#00b8ab] text-[#071313] font-semibold text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-[#00D2C4]/20 hover:shadow-[#00D2C4]/35 transition-all duration-300 cursor-pointer"
              aria-label="Download Renza"
            >
              <span>Download Renza</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
