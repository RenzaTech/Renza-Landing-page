'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Phone,
  KeyRound,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  User as UserIcon,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { User, setStoredUser } from '@/lib/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'customer' | 'helper';
}

const DEMO_USERS = {
  customer: {
    id: 'cust_01',
    name: 'Aswin Kumar',
    phone: '9876543210',
    role: 'customer' as const,
    area: 'Kundrathur, Chennai',
    totalBookings: 3,
  },
  helper: {
    id: 'help_01',
    name: 'Priya Sundaram',
    phone: '9812345678',
    role: 'helper' as const,
    area: 'Porur, Chennai',
    rating: 4.9,
    totalBookings: 42,
  },
};

export default function LoginModal({ isOpen, onClose, defaultRole = 'customer' }: LoginModalProps) {
  const [role, setRole] = useState<'customer' | 'helper'>(defaultRole);
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync role when defaultRole changes
  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  // Handle modal open / close reset
  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setError('');
      setOtp(['', '', '', '']);
      setTimeout(() => phoneInputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Resend countdown timer
  useEffect(() => {
    if (step !== 'otp' || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Format 10 digit number cleanly
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    if (error) setError('');
  };

  // Quick Demo fill
  const handleQuickFill = (targetRole: 'customer' | 'helper') => {
    setRole(targetRole);
    setPhone(DEMO_USERS[targetRole].phone);
    setError('');
  };

  // Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setResendTimer(30);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    }, 600);
  };

  // OTP change handler
  const handleOtpChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);
    if (error) setError('');

    // Auto-advance
    if (cleaned && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // OTP backspace & arrow key handler
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // OTP paste handler
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasteData) return;
    const newOtp = ['', '', '', ''];
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);
    const nextIdx = Math.min(pasteData.length, 3);
    otpInputRefs.current[nextIdx]?.focus();
  };

  // Verify OTP
  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setError('Please enter the 4-digit verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      setStep('success');

      // Build User profile
      const demoMatch =
        role === 'customer'
          ? { ...DEMO_USERS.customer, phone: `+91 ${phone}` }
          : { ...DEMO_USERS.helper, phone: `+91 ${phone}` };

      const userToStore: User = {
        id: demoMatch.id,
        name: demoMatch.name,
        phone: `+91 ${phone}`,
        role: role,
        area: demoMatch.area,
        totalBookings: demoMatch.totalBookings,
      };

      setStoredUser(userToStore);

      // Close modal smoothly
      setTimeout(() => {
        onClose();
      }, 900);
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#071313]/70 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[440px] bg-white dark:bg-[#0C1818] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 text-slate-900 dark:text-white transition-all transform scale-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#00D2C4] shadow-lg shadow-[#00D2C4]/25 mb-3">
            <span className="text-white font-extrabold text-2xl leading-none">R</span>
          </div>
          <h2 id="login-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight">
            {step === 'success'
              ? 'Welcome to RENZA!'
              : step === 'otp'
              ? 'Verify Your Phone'
              : 'Log in to RENZA'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {step === 'success'
              ? 'You are now logged in and ready to book.'
              : step === 'otp'
              ? `Enter the 4-digit code sent to +91 ${phone}`
              : 'Instant on-demand household help in Chennai'}
          </p>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: PHONE NUMBER ENTRY                               */}
        {/* ======================================================== */}
        {step === 'phone' && (
          <div>
            {/* Role Switcher Tabs */}
            <div className="flex p-1 mb-5 bg-slate-100 dark:bg-[#071313] border border-slate-200 dark:border-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  role === 'customer'
                    ? 'bg-white dark:bg-[#142323] text-[#00D2C4] shadow-sm font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('helper')}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  role === 'helper'
                    ? 'bg-white dark:bg-[#142323] text-[#00D2C4] shadow-sm font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Helper Partner
              </button>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 border-r border-slate-300 dark:border-slate-700 pr-2.5">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    maxLength={10}
                    className="w-full pl-24 pr-4 py-3 bg-slate-50 dark:bg-[#071313] border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold tracking-wide focus:outline-none focus:border-[#00D2C4] focus:ring-2 focus:ring-[#00D2C4]/20 transition-all placeholder:text-slate-400"
                    aria-label="10-digit mobile number"
                  />
                  <Phone className="absolute right-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#00D2C4] hover:bg-[#00b8ab] text-[#071313] font-bold text-sm rounded-2xl shadow-md shadow-[#00D2C4]/25 hover:shadow-lg hover:shadow-[#00D2C4]/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Get Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins Helper */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#00D2C4]" />
                <span className="font-semibold uppercase tracking-wider text-[11px]">Instant Demo Login</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('customer')}
                  className="p-2 text-left bg-slate-50 dark:bg-[#071313] hover:border-[#00D2C4]/60 border border-slate-200 dark:border-slate-800 rounded-xl transition-all group cursor-pointer"
                >
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#00D2C4] flex items-center justify-between">
                    <span>Aswin (Customer)</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">+91 98765 43210</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('helper')}
                  className="p-2 text-left bg-slate-50 dark:bg-[#071313] hover:border-[#00D2C4]/60 border border-slate-200 dark:border-slate-800 rounded-xl transition-all group cursor-pointer"
                >
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#00D2C4] flex items-center justify-between">
                    <span>Priya (Helper)</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">+91 98123 45678</p>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-center text-slate-400 mt-4 leading-relaxed">
              By proceeding, you agree to RENZA&apos;s{' '}
              <a href="#footer-download" className="text-[#00D2C4] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#footer-download" className="text-[#00D2C4] hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: OTP VERIFICATION                                 */}
        {/* ======================================================== */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {/* Number recap + edit */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#071313] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                +91 {phone} ({role === 'customer' ? 'Customer' : 'Helper'})
              </span>
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setError('');
                }}
                className="text-[#00D2C4] hover:underline font-bold cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* 4 Digit Boxes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 text-center mb-3">
                Enter 4-Digit Code
              </label>
              <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-13 h-14 text-center text-xl font-bold bg-slate-50 dark:bg-[#071313] border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-[#00D2C4] focus:ring-2 focus:ring-[#00D2C4]/20 transition-all font-mono"
                    aria-label={`Digit ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Demo Hint Banner */}
            <div className="flex items-center justify-center gap-1.5 p-2 bg-[#00D2C4]/10 border border-[#00D2C4]/30 rounded-xl text-center text-xs text-[#00D2C4]">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>
                Demo Code: <strong className="font-mono">1234</strong> (any 4 digits will verify)
              </span>
            </div>

            {error && <p className="text-xs text-rose-500 text-center font-medium">{error}</p>}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#00D2C4] hover:bg-[#00b8ab] text-[#071313] font-bold text-sm rounded-2xl shadow-md shadow-[#00D2C4]/25 hover:shadow-lg hover:shadow-[#00D2C4]/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Verify &amp; Continue</span>
                </>
              )}
            </button>

            {/* Resend Action */}
            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-xs text-slate-400">
                  Resend code in <span className="font-bold text-slate-600 dark:text-slate-300">{resendTimer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setResendTimer(30);
                    setOtp(['', '', '', '']);
                    setError('');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#00D2C4] hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resend Code</span>
                </button>
              )}
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* STEP 3: SUCCESS STATE                                    */}
        {/* ======================================================== */}
        {step === 'success' && (
          <div className="py-6 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00D2C4]/15 text-[#00D2C4] border-2 border-[#00D2C4] animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Logged in successfully!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Welcome back to RENZA. Connecting your account...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
