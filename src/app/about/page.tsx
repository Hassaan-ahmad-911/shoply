import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  ArrowRight,
  ShieldCheck,
  Leaf,
  Sparkles,
  HeartHandshake,
  Award,
  Globe,
  CheckCircle,
  Truck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Shoply | Curated Essentials for Modern Living',
  description: 'Learn about Shoply’s commitment to timeless design, ethical manufacturing, and radical price transparency.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      {/* Editorial Header */}
      <section className="bg-white border-b border-[#E7E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <nav className="flex items-center gap-2 text-xs text-[#888888] mb-6">
            <Link href="/" className="hover:text-[#171717] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#171717] font-semibold">About Us</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F6F1] border border-[#E7E5E0] text-xs font-bold uppercase tracking-wider text-[#C27847]">
              The Shoply Manifesto
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#171717] leading-[1.05]">
              Curated Essentials for Intentional Living
            </h1>
            <p className="text-base sm:text-xl text-[#666666] leading-relaxed font-normal">
              We reject transient micro-trends. Instead, we craft and curate daily essentials rooted in architectural minimalism, honest craftsmanship, and enduring quality.
            </p>
          </div>
        </div>
      </section>

      {/* Split Story Section: Philosophy & Imagery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C27847]">
                Our Beginning
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#171717]">
                Stripping away the noise to discover what truly matters.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
              Shoply was founded on a simple observation: modern e-commerce is overwhelmed by cluttered storefronts, disposable fast fashion, and artificial discounts. Finding items that embody genuine tactile elegance and lasting durability was exhausting.
            </p>

            <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
              We partnered directly with boutique textile mills, independent ceramic studios, and specialist audio labs across the globe. By removing unnecessary distributors and retail middlemen, we deliver heirloom-grade craftsmanship at accessible, honest prices.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E7E5E0]">
                <div className="text-2xl sm:text-3xl font-black text-[#171717]">100%</div>
                <div className="text-xs text-[#777777] mt-0.5">Ethical partner sourcing</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E7E5E0]">
                <div className="text-2xl sm:text-3xl font-black text-[#171717]">Zero</div>
                <div className="text-xs text-[#777777] mt-0.5">Single-use plastic packing</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-6">
            <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-card border border-[#E7E5E0]">
              <Image
                src="/images/hero_lifestyle_clean.png"
                alt="Shoply interior craftsmanship"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-sm font-medium tracking-wide">
                  "Simplicity is not the lack of clutter, that's simply the consequence of simplicity."
                </p>
                <span className="text-xs text-white/70 mt-1 block">— Shoply Design Atelier</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Pillars & Values */}
      <section className="bg-white border-y border-[#E7E5E0] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C27847]">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
              What we stand for every day
            </h2>
            <p className="text-sm sm:text-base text-[#666666]">
              Four non-negotiable promises that guide every collection we introduce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-8 rounded-3xl bg-[#F8F6F1] border border-[#E7E5E0] space-y-4 hover:shadow-card transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#171717] shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#171717]">Uncompromising Materiality</h3>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                From long-staple organic cotton to anodized aluminum and full-grain leather, every material is vetted for resilience and tactile bliss.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-3xl bg-[#F8F6F1] border border-[#E7E5E0] space-y-4 hover:shadow-card transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#171717] shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#171717]">Radical Price Transparency</h3>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                We eliminate department store markups. Our direct-to-patron model ensures fair compensation for makers and authentic value for you.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-3xl bg-[#F8F6F1] border border-[#E7E5E0] space-y-4 hover:shadow-card transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#171717] shadow-sm">
                <Leaf className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-[#171717]">Sustainable Footprint</h3>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                100% recyclable kraft unboxing, biodegradable mailers, and carbon-neutral transit partnerships that respect our planet.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-8 rounded-3xl bg-[#F8F6F1] border border-[#E7E5E0] space-y-4 hover:shadow-card transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#171717] shadow-sm">
                <HeartHandshake className="w-6 h-6 text-[#C27847]" />
              </div>
              <h3 className="text-lg font-bold text-[#171717]">Patron First Care</h3>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                30-day in-home trial, hassle-free returns, and an empathetic concierge desk ready to resolve questions 7 days a week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Numbers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-[#171717] text-white rounded-3xl p-10 sm:p-14 lg:p-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="pt-4 md:pt-0">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">18,000+</div>
              <div className="text-xs sm:text-sm text-neutral-400 mt-2 font-medium">Orders Delivered</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">4.9 / 5</div>
              <div className="text-xs sm:text-sm text-neutral-400 mt-2 font-medium">Customer Rating</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">30 Days</div>
              <div className="text-xs sm:text-sm text-neutral-400 mt-2 font-medium">In-Home Trial</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">99.2%</div>
              <div className="text-xs sm:text-sm text-neutral-400 mt-2 font-medium">Satisfaction Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Catalog CTA Banner */}
      <section className="bg-white border-t border-[#E7E5E0] py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C27847]">
            Begin Your Curation
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#171717]">
            Ready to elevate your daily routine?
          </h2>
          <p className="text-sm sm:text-base text-[#666666] max-w-xl mx-auto leading-relaxed">
            Explore our curated catalog of apparel, electronics, and home goods designed to bring quiet beauty to everyday spaces.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#171717] text-white text-sm font-semibold hover:bg-neutral-800 transition shadow-subtle group"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#F8F6F1] text-[#171717] text-sm font-semibold hover:bg-[#EBE7DF] border border-[#E7E5E0] transition"
            >
              Browse All Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
