'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ArrowRight, ChevronDown } from 'lucide-react';

interface HeroBookingBarProps {
  onSearch?: (service: string, location: string) => void;
}

export default function HeroBookingBar({ onSearch }: HeroBookingBarProps) {
  const [location, setLocation] = useState('Kundrathur, Chennai');
  const [serviceQuery, setServiceQuery] = useState('');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    };
    if (isLocationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocationOpen]);

  const popularLocations = [
    'Kundrathur, Chennai',
    'Avadi, Chennai',
    'Egmore, Chennai',
    'T. Nagar, Chennai',
    'Anna Nagar, Chennai',
    'Velachery, Chennai',
    'Adyar, Chennai',
    'Porur, Chennai',
    'Tambaram, Chennai',
    'Nungambakkam, Chennai',
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(serviceQuery, location);
    } else {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full max-w-[760px] mx-auto relative z-30">
      <form
        onSubmit={handleBookingSubmit}
        className="group/bar relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white/95 backdrop-blur-md rounded-[20px] p-2.5 sm:p-2 sm:pl-5 sm:pr-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.45)] hover:scale-[1.01] transition-all duration-300 border border-white/60"
        role="search"
        aria-label="Search and book household helpers"
      >
        {/* Left: Location Selector */}
        <div ref={locationRef} className="relative flex items-center gap-2.5 py-2 px-2 sm:py-0 sm:px-0 shrink-0 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#00D2C4]/15 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-[#00D2C4]" />
          </div>
          <div
            className="flex items-center gap-1.5"
            onClick={() => setIsLocationOpen(!isLocationOpen)}
          >
            <div className="text-left">
              <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider leading-none">
                Location
              </span>
              <span className="text-sm font-semibold text-slate-800 tracking-tight block truncate max-w-[140px] sm:max-w-[160px]">
                {location}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Location Dropdown */}
          {isLocationOpen && (
            <div className="absolute top-full left-0 mt-3 w-60 sm:w-64 max-h-64 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider sticky top-0 bg-white border-b border-slate-50">
                Select Area (Chennai)
              </p>
              {popularLocations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setLocation(loc);
                    setIsLocationOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs sm:text-sm transition-colors flex items-center gap-2 hover:bg-[#00D2C4]/10 hover:text-[#008f86] ${
                    location === loc ? 'font-semibold text-[#00D2C4] bg-[#00D2C4]/5' : 'text-slate-700'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0 opacity-60 text-[#00D2C4]" />
                  <span className="truncate">{loc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vertical Divider (Hidden on mobile) */}
        <div className="hidden sm:block h-8 w-px bg-slate-200 mx-3 shrink-0" aria-hidden="true" />

        {/* Divider on mobile */}
        <div className="block sm:hidden h-px w-full bg-slate-100 my-1" aria-hidden="true" />

        {/* Center / Right: Help search input */}
        <div className="flex-1 flex items-center gap-2.5 px-2 sm:px-0 min-w-0">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1 sm:ml-0" />
          <input
            type="text"
            value={serviceQuery}
            onChange={(e) => setServiceQuery(e.target.value)}
            placeholder="What household help do you need?"
            className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder:text-slate-400 font-normal focus:outline-none py-2"
            aria-label="What household help do you need?"
          />
        </div>

        {/* Far Right: Turquoise CTA Arrow Button */}
        <button
          type="submit"
          className="group/btn relative shrink-0 mt-1 sm:mt-0 w-full sm:w-14 h-11 sm:h-13 bg-[#00D2C4] hover:bg-[#00bdae] text-[#071313] font-bold rounded-xl sm:rounded-[15px] flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-[#00D2C4]/25 hover:shadow-lg hover:shadow-[#00D2C4]/35 active:scale-95 cursor-pointer"
          aria-label="Book household help now"
        >
          <span className="sm:hidden text-sm font-semibold text-[#071313]">Book a Helper</span>
          <ArrowRight className="w-5 h-5 text-[#071313] group-hover/btn:translate-x-1 transition-transform duration-200" />
        </button>
      </form>
    </div>
  );
}
