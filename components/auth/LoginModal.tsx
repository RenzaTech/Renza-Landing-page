'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, CheckCircle2, RotateCcw, Loader2 } from 'lucide-react';
import { User, setStoredUser } from '@/lib/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'customer' | 'helper';
}

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}



export default function LoginModal({ isOpen, onClose, defaultRole = 'customer' }: LoginModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'customer' | 'helper'>(defaultRole);
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setError('');
      setIsSignUp(false);
      setPhone('');
      setName('');
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

  useEffect(() => {
    if (step !== 'otp' || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    if (error) setError('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && !name.trim()) {
      setError('Please enter your full name');
      nameInputRef.current?.focus();
      return;
    }
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      phoneInputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setResendTimer(30);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    }, 500);
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setError('');

    setTimeout(() => {
      setIsGoogleLoading(false);
      setStep('success');

      const googleUser: User = {
        id: `google_${Date.now()}`,
        name: isSignUp && name ? name : 'Aswin Kumar',
        phone: phone ? `+91 ${phone}` : '+91 98765 43210',
        role: role,
        area: 'Kundrathur, Chennai',
        totalBookings: 2,
      };

      setStoredUser(googleUser);

      setTimeout(() => {
        onClose();
      }, 700);
    }, 800);
  };

  const handleOtpChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);
    if (error) setError('');

    if (cleaned && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

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

      const userToStore: User = {
        id: `user_${Date.now()}`,
        name: name.trim() || (role === 'customer' ? 'Aswin Kumar' : 'Priya Sundaram'),
        phone: `+91 ${phone}`,
        role: role,
        area: 'Kundrathur, Chennai',
        totalBookings: 2,
      };

      setStoredUser(userToStore);

      setTimeout(() => {
        onClose();
      }, 700);
    }, 600);
  };

  // Render centered popup screen mounted directly to document.body
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-popup-title"
    >
      {/* Centered Popup Card on Landing Page */}
      <div className="relative w-full max-w-[450px] bg-white dark:bg-[#071313] text-slate-900 dark:text-white rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/60 border border-slate-200 dark:border-slate-800 my-auto animate-in zoom-in-95 duration-200">
        {/* Close 'X' Button at Top-Right */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Header Section: Title & Subtitle on Left, Circular Illustration on Right */}
        <div className="flex items-start justify-between gap-4 mb-4 pr-6">
          <div>
            <h2 id="login-popup-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {step === 'otp' ? 'Verify OTP' : isSignUp ? 'Sign up' : 'Login'}
            </h2>
            <div className="mt-1.5 text-xs sm:text-sm">
              <span className="text-slate-500 dark:text-slate-400">or </span>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setStep('form');
                }}
                className="font-bold text-[#00D2C4] hover:underline cursor-pointer"
              >
                {isSignUp ? 'login to your account' : 'create an account'}
              </button>
            </div>

            {/* Short Underline Bar like reference UI */}
            <div className="w-8 h-[2.5px] bg-slate-900 dark:bg-white mt-3" aria-hidden="true" />
          </div>
        </div>

        {/* Role Selector Pills */}
        <div className="flex gap-2 mb-5">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              role === 'customer'
                ? 'bg-[#00D2C4]/15 border-[#00D2C4] text-[#00D2C4]'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-400'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('helper')}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              role === 'helper'
                ? 'bg-[#00D2C4]/15 border-[#00D2C4] text-[#00D2C4]'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-400'
            }`}
          >
            Helper Partner
          </button>
        </div>

        {/* ======================================================= */}
        {/* STEP 1: FORM                                            */}
        {/* ======================================================= */}
        {step === 'form' && (
          <div className="space-y-4">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {isSignUp && (
                <div className="relative border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent px-3.5 pt-2 pb-1.5 transition-all focus-within:border-[#00D2C4] focus-within:ring-1 focus-within:ring-[#00D2C4]">
                  <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Your full name"
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none pt-0.5"
                  />
                </div>
              )}

              {/* Phone Number Field styled exactly like reference image */}
              <div className="relative border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent px-3.5 pt-2 pb-1.5 transition-all focus-within:border-[#00D2C4] focus-within:ring-1 focus-within:ring-[#00D2C4]">
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Phone number
                </label>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">+91</span>
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}

              {/* Big Solid Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-lg bg-[#00D2C4] hover:bg-[#00bdae] text-[#071313] font-extrabold text-sm tracking-wider uppercase shadow-md shadow-[#00D2C4]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <span>{isSignUp ? 'CONTINUE' : 'LOGIN'}</span>
                )}
              </button>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-center">
                By clicking on {isSignUp ? 'Continue' : 'Login'}, I accept the{' '}
                <strong className="text-slate-800 dark:text-slate-200">Terms &amp; Conditions</strong> &amp;{' '}
                <strong className="text-slate-800 dark:text-slate-200">Privacy Policy</strong>
              </p>
            </form>

            {/* Divider: OR */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative px-3 text-xs font-bold text-slate-400 uppercase bg-white dark:bg-[#071313]">
                OR
              </span>
            </div>

            {/* Continue with Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full py-3 px-4 bg-white dark:bg-[#0C1818] border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-lg text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow active:scale-[0.99] cursor-pointer disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#00D2C4]" />
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ======================================================= */}
        {/* STEP 2: OTP VERIFICATION                                */}
        {/* ======================================================= */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="p-3 bg-slate-50 dark:bg-[#0C1818] border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Code sent to +91 {phone}
              </span>
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setError('');
                }}
                className="font-bold text-[#00D2C4] hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
                Enter 4-Digit Code
              </label>
              <div className="flex justify-center gap-2.5 sm:gap-3" onPaste={handleOtpPaste}>
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
                    className="w-12 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent focus:outline-none focus:border-[#00D2C4] focus:ring-1 focus:ring-[#00D2C4] transition-all font-mono"
                    aria-label={`Digit ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 p-2 bg-[#00D2C4]/10 border border-[#00D2C4]/30 rounded text-center text-xs text-[#00D2C4]">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>
                Demo code: <strong className="font-mono">1234</strong> (any 4 digits will verify)
              </span>
            </div>

            {error && <p className="text-xs text-rose-500 text-center font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-lg bg-[#00D2C4] hover:bg-[#00bdae] text-[#071313] font-extrabold text-sm tracking-wider uppercase shadow-md shadow-[#00D2C4]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>VERIFYING...</span>
                </>
              ) : (
                <span>VERIFY OTP</span>
              )}
            </button>

            <div className="text-center pt-1">
              {resendTimer > 0 ? (
                <p className="text-xs text-slate-400">
                  Resend code in <span className="font-bold text-slate-700 dark:text-slate-200">{resendTimer}s</span>
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

        {/* ======================================================= */}
        {/* STEP 3: SUCCESS                                         */}
        {/* ======================================================= */}
        {step === 'success' && (
          <div className="py-8 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#00D2C4]/15 text-[#00D2C4] border-2 border-[#00D2C4] animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Logged in successfully!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Welcome to RENZA. Connecting your session...
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
