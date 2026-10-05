'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toastError('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await register({ name, email, password, phone });
    setLoading(false);

    if (res.success) {
      success('Account created successfully! Welcome to Shoply.');
      router.push('/account');
    } else {
      toastError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-shoply-border overflow-hidden shadow-card grid grid-cols-1 md:grid-cols-2">
        {/* Left: Editorial Banner */}
        <div className="relative hidden md:block min-h-[580px]">
          <Image
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
            alt="Join Shoply"
            fill
            className="object-cover object-center"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8 lg:p-12 text-white">
            <h2 className="text-3xl font-extrabold tracking-tight">Join Shoply</h2>
            <p className="text-sm text-neutral-200 mt-2 font-light leading-relaxed">
              Create an account to save favorite items, track shipments in real-time, and access seasonal rewards.
            </p>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-shoply-text font-sans">
              Create Account
            </h1>
            <p className="text-xs text-shoply-mutedText mt-1">
              Already have an account?{' '}
              <Link href="/login" className="text-shoply-text font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-shoply-text mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ayesha Siddiqui"
                className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-white text-shoply-text focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-shoply-text mb-1">
                Email Address *
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
              <label className="block text-xs font-semibold text-shoply-text mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 0000000"
                className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-white text-shoply-text focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-shoply-text mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-white text-shoply-text focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-shoply-text mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-white text-shoply-text focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-shoply-accent text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition shadow-subtle flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

