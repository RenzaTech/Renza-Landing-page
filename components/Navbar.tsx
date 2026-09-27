'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sun, Moon, LogOut, Calendar, ChevronDown, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, getStoredUser, removeStoredUser, AUTH_CHANGE_EVENT, OPEN_LOGIN_EVENT } from '@/lib/auth';
import LoginModal from '@/components/auth/LoginModal';
import BookingsModal from '@/components/auth/BookingsModal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  // Listen for auth state changes & login triggers
  useEffect(() => {
    setUser(getStoredUser());

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<User | null>;
      setUser(customEvent.detail ?? getStoredUser());
    };

    const handleOpenLogin = () => {
      setIsLoginModalOpen(true);
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    window.addEventListener(OPEN_LOGIN_EVENT, handleOpenLogin);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
      window.removeEventListener(OPEN_LOGIN_EVENT, handleOpenLogin);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

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
      <div className="container-renza px-3.5 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <a
            id="renza-nav-logo"
            href="#home"
            onClick={handleLogoClick}
            className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer shrink-0"
            aria-label="RENZA Home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#00D2C4] flex items-center justify-center shadow-md shadow-[#00D2C4]/25 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <span className="text-white font-bold text-base sm:text-lg leading-none">R</span>
            </div>
            <span
              className={`text-lg sm:text-xl font-bold tracking-tight transition-colors duration-300 whitespace-nowrap shrink-0 ${
                isScrolled ? 'text-[#071313] dark:text-white' : 'text-white'
              }`}
            >
              RENZA
            </span>
          </a>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-sm shrink-0 ${
                isScrolled
                  ? 'border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-[#00D2C4] hover:text-[#00D2C4]'
                  : 'border border-white/15 bg-white/10 backdrop-blur-md text-white hover:border-[#00D2C4] hover:text-[#00D2C4]'
              }`}
            >
              {mounted && theme === 'dark' ? (
                <Sun size={16} className="text-amber-400 sm:w-[18px] sm:h-[18px]" />
              ) : (
                <Moon size={16} className={`sm:w-[18px] sm:h-[18px] ${isScrolled ? 'text-slate-700 dark:text-slate-300' : 'text-white'}`} />
              )}
            </button>

            {/* Login or User Profile */}
            {user ? (
              <div ref={profileMenuRef} className="relative shrink-0">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm ${
                    isScrolled
                      ? 'border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 hover:border-[#00D2C4]'
                      : 'border-white/20 bg-white/10 backdrop-blur-md text-white hover:border-[#00D2C4]'
                  }`}
                  aria-label="User profile menu"
                >
                  <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#00D2C4] text-[#071313] font-bold text-[10px] sm:text-xs flex items-center justify-center shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                    <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 border border-white dark:border-[#071313]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold max-w-[55px] min-[400px]:max-w-[80px] sm:max-w-[110px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                      isProfileMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#0C1818] border border-slate-200 dark:border-slate-800 shadow-xl shadow-black/25 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{user.phone}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00D2C4]/15 text-[#00D2C4]">
                          {user.role === 'customer' ? 'Customer Account' : 'Helper Partner'}
                        </span>
                        {user.area && (
                          <span className="text-[10px] text-slate-400 truncate max-w-[90px]">{user.area}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsBookingsModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <Calendar size={14} className="text-[#00D2C4]" />
                      <span>{user.role === 'customer' ? 'My Bookings' : 'My Assigned Jobs'}</span>
                      <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#00D2C4]/20 text-[#00D2C4]">
                        {user.totalBookings || 2}
                      </span>
                    </button>

                    <a
                      href="#trust-safety"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <ShieldCheck size={14} className="text-[#00D2C4]" />
                      <span>Trust & Safety</span>
                    </a>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        removeStoredUser();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className={`text-xs sm:text-sm font-semibold px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  isScrolled
                    ? 'text-slate-700 dark:text-slate-300 hover:text-[#00D2C4] hover:bg-slate-100 dark:hover:bg-slate-800'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Login to account"
              >
                Login
              </button>
            )}

            <a
              href="#footer-download"
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#00D2C4] hover:bg-[#00b8ab] text-[#071313] font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md shadow-[#00D2C4]/20 hover:shadow-[#00D2C4]/35 transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0"
              aria-label="Download Renza"
            >
              <span>
                Download<span className="hidden min-[400px]:inline"> Renza</span>
              </span>
              <ArrowRight size={14} className="sm:w-[15px] sm:h-[15px] shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Login & Bookings Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <BookingsModal isOpen={isBookingsModalOpen} onClose={() => setIsBookingsModalOpen(false)} user={user} />
    </header>
  );
}
