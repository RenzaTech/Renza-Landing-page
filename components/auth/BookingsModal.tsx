'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, User as UserIcon } from 'lucide-react';
import { User } from '@/lib/auth';

interface BookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const SAMPLE_CUSTOMER_BOOKINGS = [
  {
    id: 'BK-7891',
    service: 'House Cleaning',
    date: 'Today, 10:00 AM',
    duration: '3 hours',
    rate: '₹597',
    status: 'Helper Assigned',
    helperName: 'Suresh Kumar',
    location: 'Kundrathur, Chennai',
    isActive: true,
  },
  {
    id: 'BK-6542',
    service: 'Kitchen Cleaning & Vessel Washing',
    date: 'Yesterday, 02:00 PM',
    duration: '2 hours',
    rate: '₹398',
    status: 'Completed',
    helperName: 'Anitha V.',
    location: 'Kundrathur, Chennai',
    isActive: false,
  },
];

const SAMPLE_HELPER_JOBS = [
  {
    id: 'JOB-4120',
    service: 'House Cleaning & Mopping',
    date: 'Today, 10:00 AM',
    duration: '3 hours',
    rate: '₹450 Payout',
    status: 'Confirmed Job',
    customerName: 'Aswin K.',
    location: 'Kundrathur, Chennai',
    isActive: true,
  },
  {
    id: 'JOB-3891',
    service: 'Kitchen Degreasing & Vessels',
    date: '24 Sep, 03:00 PM',
    duration: '2 hours',
    rate: '₹300 Payout',
    status: 'Completed · 5.0 ★',
    customerName: 'Meena R.',
    location: 'Porur, Chennai',
    isActive: false,
  },
];

export default function BookingsModal({ isOpen, onClose, user }: BookingsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !user || !mounted) return null;

  const isCustomer = user.role === 'customer';
  const items = isCustomer ? SAMPLE_CUSTOMER_BOOKINGS : SAMPLE_HELPER_JOBS;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-200 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bookings-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0C1818] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-white max-h-[85vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#00D2C4]/15 text-[#00D2C4] flex items-center justify-center font-bold">
            {isCustomer ? <Calendar className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h2 id="bookings-modal-title" className="text-lg sm:text-xl font-bold tracking-tight">
              {isCustomer ? 'My Bookings' : 'My Assigned Jobs'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.name} · {user.phone} ({isCustomer ? 'Customer' : 'Helper Partner'})
            </p>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.isActive
                  ? 'border-[#00D2C4]/60 bg-[#00D2C4]/5 dark:bg-[#00D2C4]/10 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#071313]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.id}
                  </span>
                  <h3 className="text-sm font-bold mt-1 text-slate-900 dark:text-white">
                    {item.service}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#00D2C4]">{item.rate}</span>
                  <div className="mt-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.isActive
                          ? 'bg-[#00D2C4] text-[#071313]'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.date}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#00D2C4] shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {isCustomer ? `Helper: ${(item as typeof SAMPLE_CUSTOMER_BOOKINGS[0]).helperName}` : `Customer: ${(item as typeof SAMPLE_HELPER_JOBS[0]).customerName}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400">Need support? Dial 1800-RENZA</p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
