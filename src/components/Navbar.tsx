'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Shield,
  LogOut,
  Package,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'Deals', href: '/shop?sale=true' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      {/* FULL-WIDTH MODERN HEADER (Height: 76px) */}
      <header
        className={`sticky top-0 z-50 w-full h-[76px] transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F6F1]/95 backdrop-blur-md border-b border-[#E7E5E0] shadow-subtle'
            : 'bg-[#F8F6F1] border-b border-[#E7E5E0]/60'
        }`}
      >
        <div className="w-full h-full px-6 sm:px-10 lg:px-14 xl:px-16 flex items-center justify-between">
          {/* ================= LEFT: SHOPLY LOGO ================= */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link
              href="/"
              className="text-2xl sm:text-[26px] font-black tracking-tight text-[#171717] hover:opacity-90 transition font-sans"
            >
              Shoply
            </Link>

            {/* Quick Admin Indicator if logged in as admin */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-[#171717] text-white hover:bg-neutral-800 transition"
              >
                <Shield className="w-3 h-3" />
                Admin
              </Link>
            )}
          </div>

          {/* ================= CENTER: MODERN NAVIGATION LINKS ================= */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' &&
                  pathname.startsWith(link.href) &&
                  !link.href.includes('#') &&
                  !link.href.includes('?'));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative text-sm tracking-normal py-1.5 transition-colors duration-200 group ${
                    isActive
                      ? 'text-[#171717] font-semibold'
                      : 'text-[#666666] hover:text-[#171717] font-medium'
                  }`}
                >
                  {link.label}
                  {/* Subtle active underline indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#171717] rounded-full transition-all" />
                  )}
                  {!isActive && (
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#171717] rounded-full transition-all duration-200 group-hover:w-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ================= RIGHT: THIN-LINE ACTIONS ================= */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Icon */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-[#171717] hover:text-[#666666] rounded-full hover:bg-black/5 transition duration-150"
              aria-label="Search catalog"
              title="Search"
            >
              <Search className="w-5 h-5 stroke-[1.6]" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-2.5 text-[#171717] hover:text-[#666666] rounded-full hover:bg-black/5 transition duration-150"
              aria-label="View Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.6]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full animate-in zoom-in-75">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2.5 text-[#171717] hover:text-[#666666] rounded-full hover:bg-black/5 transition duration-150"
              aria-label="Shopping Cart"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-[#171717] rounded-full animate-in zoom-in-75">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account Icon & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="p-2.5 text-[#171717] hover:text-[#666666] rounded-full hover:bg-black/5 transition duration-150 flex items-center"
                aria-label="Account Menu"
                title="Account"
              >
                <UserIcon className="w-5 h-5 stroke-[1.6]" />
              </button>

              {isUserDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-elevated border border-[#E7E5E0] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {user ? (
                      <>
                        <div className="px-3.5 py-2.5 border-b border-[#E7E5E0] mb-1.5">
                          <p className="text-sm font-bold text-[#171717] truncate">{user.name}</p>
                          <p className="text-xs text-[#666666] truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#171717] hover:bg-neutral-100 rounded-xl transition"
                        >
                          <Package className="w-4 h-4 text-[#666666]" />
                          My Orders & Account
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#171717] hover:bg-neutral-100 rounded-xl transition"
                          >
                            <Shield className="w-4 h-4 text-[#666666]" />
                            Admin Console
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition text-left mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <div className="p-1 space-y-2">
                        <Link
                          href="/login"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block w-full text-center px-4 py-2.5 text-xs font-semibold text-white bg-[#171717] rounded-xl hover:bg-neutral-800 transition"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block w-full text-center px-4 py-2.5 text-xs font-semibold text-[#171717] border border-[#E7E5E0] rounded-xl hover:bg-neutral-50 transition"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-[#171717] hover:text-[#666666] rounded-xl transition ml-1"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 stroke-[1.6]" /> : <Menu className="w-6 h-6 stroke-[1.6]" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#F8F6F1] border-b border-[#E7E5E0] px-6 py-5 space-y-3 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3.5 py-2.5 text-sm font-semibold text-[#171717] hover:bg-black/5 rounded-xl transition"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-[#E7E5E0] space-y-2">
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold text-[#171717] hover:bg-black/5 rounded-xl"
                >
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold text-[#171717] hover:bg-black/5 rounded-xl"
                >
                  <span>Cart</span>
                  <span className="text-xs bg-[#171717] text-white px-2 py-0.5 rounded-full font-bold">
                    {itemCount}
                  </span>
                </Link>
                <Link
                  href="/account"
                  className="block px-3.5 py-2.5 text-sm font-semibold text-[#171717] hover:bg-black/5 rounded-xl"
                >
                  My Account
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Global Live Search Interface Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
