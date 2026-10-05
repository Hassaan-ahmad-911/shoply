'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('hassaan@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      success('Welcome back!');
      if (email === 'admin@shoply.com') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } else {
      toastError(res.error || 'Failed to sign in');
    }
  };

  const handleDemoAdmin = () => {
    setEmail('admin@shoply.com');
    setPassword('admin123');
  };

  const handleDemoUser = () => {
    setEmail('hassaan@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-shoply-border overflow-hidden shadow-card grid grid-cols-1 md:grid-cols-2">
        {/* ================= LEFT: EDITORIAL BANNER (Matches Mockup) ================= */}
        <div className="relative hidden md:block min-h-[540px]">
          <Image
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80"
            alt="Welcome Back"
            fill
            className="object-cover object-center"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8 lg:p-12 text-white">
            <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
            <p className="text-sm text-neutral-200 mt-2 font-light leading-relaxed">
              Sign in to continue your shopping experience, track orders, and view your saved items.
            </p>
          </div>
        </div>

        {/* ================= RIGHT: SIGN IN FORM ================= */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-shoply-text font-sans">
              Sign In
            </h1>
            <p className="text-xs text-shoply-mutedText mt-1">
              New here?{' '}
              <Link href="/register" className="text-shoply-text font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          {/* Quick Demo Credentials Bar */}
          <div className="p-3 bg-shoply-bg rounded-xl border border-shoply-border space-y-2 text-xs">
            <p className="font-semibold text-shoply-text flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-800" /> Quick Demo Accounts:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDemoUser}
                className="flex-1 py-1 px-2 rounded-lg bg-white border border-shoply-border text-[11px] font-medium text-shoply-text hover:bg-neutral-100 transition"
              >
                Customer (Hassaan)
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="flex-1 py-1 px-2 rounded-lg bg-neutral-900 text-white text-[11px] font-medium hover:bg-neutral-800 transition"
              >
                Admin Manager
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-shoply-text mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-white text-shoply-text focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-shoply-text">
                  Password
                </label>
                <a href="#" className="text-[11px] text-shoply-mutedText hover:text-shoply-text">
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-white text-shoply-text focus:outline-none focus:border-neutral-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-shoply-accent text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition shadow-subtle flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          {/* Social Logins matching mockup */}
          <div className="space-y-3 pt-2">
            <div className="relative flex items-center justify-center">
              <hr className="w-full border-shoply-border" />
              <span className="absolute bg-white px-3 text-[11px] font-semibold text-shoply-mutedText uppercase">
                OR
              </span>
            </div>

            <button
              type="button"
              onClick={handleDemoUser}
              className="w-full py-2.5 px-4 rounded-xl border border-shoply-border bg-white text-xs font-semibold text-shoply-text hover:bg-neutral-50 transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.92H1.21v3.15C3.26 21.46 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.32 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.57H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.43l4.11-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.54 1.21 6.57l4.11 3.15c.94-2.82 3.58-4.97 6.68-4.97z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleDemoUser}
              className="w-full py-2.5 px-4 rounded-xl border border-shoply-border bg-white text-xs font-semibold text-shoply-text hover:bg-neutral-50 transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

