import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, ShieldCheck, HeartHandshake } from 'lucide-react';
import { getCategories, getProducts } from '@/lib/db';
import BenefitBar from '@/components/BenefitBar';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import PromoBanner from '@/components/PromoBanner';
import CustomerReviews from '@/components/CustomerReviews';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const categories = getCategories();
  const { products: allTrending } = getProducts({ sort: 'popular', limit: 4 });

  return (
    <div className="w-full bg-[#F8F6F1] overflow-x-hidden">
      {/* =========================================================================
          1. 100% FULL-BLEED EDGE-TO-EDGE HERO (NO EMPTY GAPS, FITS ENTIRE PAGE)
         ========================================================================= */}
      <section className="relative w-full min-h-[calc(100vh-76px)] lg:h-[calc(100vh-76px)] max-h-[960px] flex flex-col lg:flex-row items-stretch bg-[#F8F6F1] border-b border-[#E7E5E0]/60 overflow-hidden">
        
        {/* ================= LEFT SIDE: EDITORIAL TEXT CONTENT ================= */}
        <div className="w-full lg:w-[46%] xl:w-[43%] 2xl:w-[40%] flex flex-col justify-center py-12 sm:py-16 lg:py-0 pl-6 sm:pl-12 lg:pl-16 xl:pl-24 2xl:pl-32 pr-6 lg:pr-8 z-10 space-y-6 sm:space-y-8 flex-shrink-0">
          {/* Small uppercase label with tracking */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#C27847] font-sans">
              New Collection
            </span>
          </div>

          {/* Large editorial typography heading */}
          <h1 className="text-[52px] sm:text-[68px] lg:text-[76px] xl:text-[88px] font-black tracking-[-0.035em] text-[#171717] leading-[0.98] font-sans">
            Style<br />
            For Every<br />
            Moment
          </h1>

          {/* Concise descriptive subtitle */}
          <p className="text-base sm:text-lg text-[#666666] leading-relaxed max-w-md font-normal font-sans">
            Discover the latest trends in fashion, electronics, home essentials and more — all in one place.
          </p>

          {/* Dark Charcoal CTA Button */}
          <div className="pt-2">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-3 w-[165px] h-[52px] rounded-xl bg-[#171717] text-white text-sm font-semibold tracking-wide hover:bg-neutral-800 hover:-translate-y-0.5 active:translate-y-0 shadow-subtle transition-all duration-200"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ================= RIGHT SIDE: FULL-BLEED LIFESTYLE IMAGE ================= */}
        {/* Extends all the way to the top, bottom, and right edge of the viewport with 0px margin */}
        <div className="w-full lg:flex-1 h-[420px] sm:h-[520px] lg:h-full relative overflow-hidden">
          <Image
            src="/images/hero_lifestyle_clean.png"
            alt="Modern warm minimalist interior - Style For Every Moment"
            fill
            priority
            className="object-cover object-center lg:object-right"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>

      </section>

      {/* =========================================================================
          2. REST OF THE STOREFRONT (Spacious, high-end container max-w-[1560px])
         ========================================================================= */}
      <div className="w-full max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pb-20">
        
        {/* Benefit Bar immediately below hero */}
        <section>
          <BenefitBar />
        </section>

        {/* Shop by Category */}
        <section id="categories" className="py-10 sm:py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717]">
                Shop by Category
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">
                Explore our curated collections by aesthetic department
              </p>
            </div>
            <Link
              href="/categories"
              className="text-xs sm:text-sm font-semibold text-[#171717] hover:text-[#666666] flex items-center gap-1 group transition"
            >
              View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 6 Category Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section className="py-10 sm:py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717]">
                Trending Products
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">
                Our most coveted designs this season
              </p>
            </div>
            <Link
              href="/shop?sort=popular"
              className="text-xs sm:text-sm font-semibold text-[#171717] hover:text-[#666666] flex items-center gap-1 group transition"
            >
              View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {allTrending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="py-6">
          <PromoBanner />
        </section>

        {/* Verified Customer Reviews Section */}
        <CustomerReviews />

        {/* Editorial Brand Values Section */}
        <section id="about" className="py-16 border-t border-[#E7E5E0]">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#666666]">
              Our Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
              Crafted for longevity and everyday elegance
            </h2>
            <p className="text-sm text-[#666666] leading-relaxed">
              At Shoply, we curate premium essentials designed to simplify your everyday life. We collaborate with responsible manufacturers to deliver timeless quality at honest prices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E7E5E0] space-y-3 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-[#F8F6F1] flex items-center justify-center text-[#171717]">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#171717]">Verified Quality</h3>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                Every garment, gadget, and home piece undergoes comprehensive material testing before entering our catalog.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E7E5E0] space-y-3 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-[#F8F6F1] flex items-center justify-center text-[#171717]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#171717]">Transparent Pricing</h3>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                No hidden checkout surcharges. Straightforward pricing, free shipping thresholds, and transparent courier tracking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E7E5E0] space-y-3 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-[#F8F6F1] flex items-center justify-center text-[#171717]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#171717]">Customer First Care</h3>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                Enjoy 30 days hassle-free returns and an empathetic customer support desk ready to resolve questions 7 days a week.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
