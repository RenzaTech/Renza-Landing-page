'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import AnimatedBackground from '@/components/background/AnimatedBackground';

function FacebookIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03.66-1.5 1.75-1.5h1.75V2.5c-.85-.12-1.7-.18-2.55-.18-2.58 0-4.45 1.57-4.45 4.58v2.6H8v4h2.5v9h3.5v-9z" />
    </svg>
  );
}

function TwitterIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function AppleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 384 512" fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function GooglePlayIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a2.37 2.37 0 0 1-.61-1.637V3.451c0-.624.23-1.196.609-1.637z" fill="#00E5FF" />
      <path d="M17.18 8.614L4.82 1.48C4.42 1.25 3.99 1.14 3.61 1.814l10.182 10.186 3.388-3.386z" fill="#FFD200" />
      <path d="M17.18 15.386l-3.388-3.386L3.61 22.186c.38.674.81.564 1.21.334l12.36-7.134z" fill="#FF334B" />
      <path d="M21.66 11.02l-4.48-2.406-3.388 3.386 3.388 3.386 4.48-2.406c1.12-.647 1.12-1.713 0-2.36z" fill="#00E676" />
    </svg>
  );
}

const footerLinks = {
  company: [
    { label: 'About RENZA', href: '#' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#' },
  ],
  support: [
    { label: 'Help Center', href: '#' },
    { label: 'FAQs', href: '#faq' },
    { label: 'Customer Support', href: '#' },
    { label: 'Safety', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Cancellation Policy', href: '#' },
  ],
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-dark text-white" role="contentinfo">
      <AnimatedBackground theme="footer" />
      {/* Main footer content */}
      <div className="container-renza relative z-10 py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-1">
            {/* Logo */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 group mb-5 cursor-pointer"
              aria-label="Go to top of page"
            >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-turquoise transition-shadow duration-300">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                RENZA
              </span>
            </button>

            {/* Tagline */}
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Household help, whenever you need it. Book trained and verified
              helpers for everyday household tasks.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/50 hover:text-primary text-sm transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ArrowRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/50 hover:text-primary text-sm transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ArrowRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/50 hover:text-primary text-sm transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ArrowRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links & App Download (Reference style) */}
          <div id="footer-download" className="scroll-mt-28">
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-3.5">
              SOCIAL LINKS
            </h3>

            {/* Circular Social Icons */}
            <div className="flex items-center gap-3 mb-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow RENZA on Facebook"
                className="w-8 h-8 rounded-full bg-black/90 hover:bg-[#00D2C4] border border-white/15 hover:border-[#00D2C4] flex items-center justify-center text-white hover:text-[#071313] transition-all duration-300 hover:scale-110 group cursor-pointer shadow-sm"
              >
                <FacebookIcon className="w-3.5 h-3.5 fill-current" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow RENZA on Twitter"
                className="w-8 h-8 rounded-full bg-black/90 hover:bg-[#00D2C4] border border-white/15 hover:border-[#00D2C4] flex items-center justify-center text-white hover:text-[#071313] transition-all duration-300 hover:scale-110 group cursor-pointer shadow-sm"
              >
                <TwitterIcon className="w-3.5 h-3.5 fill-current" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow RENZA on Instagram"
                className="w-8 h-8 rounded-full bg-black/90 hover:bg-[#00D2C4] border border-white/15 hover:border-[#00D2C4] flex items-center justify-center text-white hover:text-[#071313] transition-all duration-300 hover:scale-110 group cursor-pointer shadow-sm"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* App Store & Google Play Badges */}
            <div className="flex flex-col gap-2.5">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download RENZA on the App Store"
                className="group flex items-center gap-2.5 px-3.5 py-2 rounded-[10px] bg-[#141f2c] hover:bg-[#1a293b] border border-white/15 hover:border-[#00D2C4]/70 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-[#00D2C4]/10 hover:-translate-y-0.5 cursor-pointer w-full max-w-[155px]"
              >
                <AppleIcon className="w-5 h-5 fill-white flex-shrink-0" />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[8.5px] text-white/70 font-normal tracking-tight">Download on the</span>
                  <span className="text-[13px] font-semibold text-white tracking-tight mt-0.5 group-hover:text-[#00D2C4] transition-colors font-sans">App Store</span>
                </div>
              </a>

              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get RENZA on Google Play"
                className="group flex items-center gap-2.5 px-3.5 py-2 rounded-[10px] bg-[#141f2c] hover:bg-[#1a293b] border border-white/15 hover:border-[#00D2C4]/70 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-[#00D2C4]/10 hover:-translate-y-0.5 cursor-pointer w-full max-w-[155px]"
              >
                <GooglePlayIcon className="w-5 h-5 flex-shrink-0" />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[7.5px] uppercase tracking-wider text-white/70 font-medium">GET IT ON</span>
                  <span className="text-[13px] font-semibold text-white tracking-tight mt-0.5 group-hover:text-[#00D2C4] transition-colors font-sans">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-renza py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">
              © 2026 RENZA. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-white/20 text-xs">
              <span>Made with</span>
              <span className="text-primary">♥</span>
              <span>for households everywhere</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
