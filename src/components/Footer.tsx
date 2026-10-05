'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function Footer() {
  const { success } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      success('Thank you for subscribing to Shoply updates!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-shoply-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="text-2xl font-bold tracking-tight text-shoply-text font-sans">
              Shoply
            </Link>
            <p className="text-sm text-shoply-mutedText max-w-sm leading-relaxed">
              Curated essentials for modern living. Elevating your lifestyle through minimal design, premium craft, and honest quality.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-shoply-bg text-shoply-text hover:bg-neutral-900 hover:text-white transition"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-shoply-bg text-shoply-text hover:bg-neutral-900 hover:text-white transition"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-shoply-bg text-shoply-text hover:bg-neutral-900 hover:text-white transition"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-shoply-text tracking-wide uppercase text-xs">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-shoply-mutedText hover:text-shoply-text transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=newest" className="text-shoply-mutedText hover:text-shoply-text transition">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=popular" className="text-shoply-mutedText hover:text-shoply-text transition">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/shop?sale=true" className="text-shoply-mutedText hover:text-shoply-text transition">
                  Deals & Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-shoply-text tracking-wide uppercase text-xs">
              Explore & Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-shoply-mutedText hover:text-shoply-text transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-shoply-mutedText hover:text-shoply-text transition">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-shoply-mutedText hover:text-shoply-text transition">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-shoply-mutedText hover:text-shoply-text transition">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-shoply-text tracking-wide uppercase text-xs">
              Stay in the loop
            </h4>
            <p className="text-xs text-shoply-mutedText leading-relaxed">
              Subscribe to receive weekly early access to new collections and seasonal private sales.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-shoply-border bg-shoply-bg text-shoply-text placeholder:text-shoply-lightText focus:outline-none focus:border-shoply-accent transition"
                />
              </div>
              <button
                type="submit"
                className="w-full text-xs font-semibold py-2.5 px-4 bg-shoply-accent text-white rounded-lg hover:bg-neutral-800 transition flex items-center justify-center gap-1.5"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Subscribed
                  </>
                ) : (
                  <>
                    Subscribe <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-shoply-border flex flex-col sm:flex-row items-center justify-between text-xs text-shoply-mutedText gap-4">
          <p>© {new Date().getFullYear()} Shoply Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/#about" className="hover:text-shoply-text transition">
              Privacy Policy
            </Link>
            <Link href="/#about" className="hover:text-shoply-text transition">
              Terms & Conditions
            </Link>
            <Link href="/admin" className="hover:text-shoply-text transition text-neutral-400">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

