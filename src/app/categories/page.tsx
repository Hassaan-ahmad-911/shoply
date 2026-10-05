import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ArrowRight, Sparkles, Tag, Layers, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { getCategories, getProducts } from '@/lib/db';

export const metadata: Metadata = {
  title: 'All Categories | Shoply - Curated Essentials',
  description: 'Explore our curated departments: Fashion, Electronics, Home & Living, Beauty, Sports, and Bags & Accessories.',
};

export const dynamic = 'force-dynamic';

const subcategoriesMap: Record<string, string[]> = {
  fashion: ['Men’s Wear', 'Women’s Essentials', 'Outerwear', 'Knitwear', 'Footwear'],
  electronics: ['Wireless Audio', 'Smartwatches', 'Desk Tech', 'Cables & Docks', 'Speakers'],
  'home-living': ['Living Room Decor', 'Minimalist Ceramics', 'Lighting', 'Kitchenware', 'Storage'],
  beauty: ['Natural Skincare', 'Organic Botanicals', 'Daily Hydration', 'Face Serums', 'Aromatherapy'],
  sports: ['Running Footwear', 'Activewear', 'Gym Accessories', 'Hydration Flasks', 'Yoga Mats'],
  'bags-accessories': ['Leather Backpacks', 'Minimalist Totes', 'Crossbody Bags', 'Wallets', 'Cardholders'],
};

export default function CategoriesPage() {
  const categories = getCategories();
  const { products: allProducts } = getProducts({});

  // Compute live product counts per category
  const categoriesWithCounts = categories.map((cat) => {
    const matchingProducts = allProducts.filter((p) => p.category_slug === cat.slug);
    return {
      ...cat,
      liveCount: matchingProducts.length || cat.product_count,
    };
  });

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      {/* Editorial Page Header */}
      <section className="bg-white border-b border-[#E7E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#888888] mb-6">
            <Link href="/" className="hover:text-[#171717] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#171717] font-semibold">Categories</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F6F1] border border-[#E7E5E0] text-xs font-bold uppercase tracking-wider text-[#C27847]">
                <Layers className="w-3.5 h-3.5" />
                Departments Directory
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#171717]">
                Explore All Collections
              </h1>
              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                Discover our thoughtfully curated departments. Every item is handpicked for timeless design, premium materials, and effortless everyday utility.
              </p>
            </div>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#555555]">
              <span className="px-3.5 py-1.5 rounded-xl bg-[#F8F6F1] border border-[#E7E5E0] font-medium">
                <strong className="text-[#171717]">{categories.length}</strong> Curated Departments
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#F8F6F1] border border-[#E7E5E0] font-medium">
                <strong className="text-[#171717]">100%</strong> Inspected Quality
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#F8F6F1] border border-[#E7E5E0] font-medium">
                <strong className="text-[#171717]">Free</strong> Shipping &gt; Rs. 5,000
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesWithCounts.map((category) => {
            const subtags = subcategoriesMap[category.slug] || ['New Arrivals', 'Trending', 'Best Sellers'];

            return (
              <div
                key={category.id}
                className="group bg-white rounded-3xl border border-[#E7E5E0] overflow-hidden shadow-subtle hover:shadow-card hover:border-[#D6CBB9] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category Image Header */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#F0EFEA]">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Top Pill Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-[#171717] shadow-sm">
                        {category.liveCount} Products
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[11px] font-medium text-white">
                        Curated
                      </span>
                    </div>

                    {/* Bottom overlay text on image */}
                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                        {category.name}
                      </h2>
                      <p className="text-xs text-white/80 mt-0.5">{category.description}</p>
                    </div>
                  </div>

                  {/* Subcategories tags */}
                  <div className="p-6 pb-4">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-[#888888] mb-3">
                      Popular Collections
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {subtags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/shop?category=${category.slug}&search=${encodeURIComponent(tag)}`}
                          className="px-2.5 py-1 rounded-lg bg-[#F8F6F1] hover:bg-[#171717] hover:text-white text-xs text-[#555555] border border-[#E7E5E0] transition"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-6 pt-2 border-t border-[#F0EFEA] mt-2">
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#171717] text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition group/btn"
                  >
                    <span>Explore {category.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Curated Department Spotlight */}
      <section className="bg-white border-t border-[#E7E5E0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#524E44] text-white rounded-3xl p-8 sm:p-12 lg:p-14 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 z-10">
                <span className="text-xs uppercase tracking-widest font-bold text-[#D6CBB9]">
                  Category Spotlight
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Acoustics & Ambient Electronics
                </h3>
                <p className="text-xs sm:text-sm text-[#DDD4C5] leading-relaxed max-w-lg">
                  Immerse yourself in precision sound engineering and clean geometric aesthetics. From wireless over-ear noise cancellation to desktop sound stages.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/shop?category=electronics"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#171717] text-xs sm:text-sm font-bold hover:bg-neutral-100 transition shadow-subtle group"
                  >
                    <span>Browse Electronics</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-white/30 text-white text-xs sm:text-sm font-medium hover:bg-white/10 transition"
                  >
                    View All 6 Departments
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-card">
                <Image
                  src="/images/promo_banner_photo_hd.png"
                  alt="Electronics Spotlight"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E7E5E0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F6F1] flex items-center justify-center text-[#171717]">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#171717]">Complimentary Express Delivery</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              Orders exceeding Rs. 5,000 qualify for tracked door-to-door expedited delivery across all regions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7E5E0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F6F1] flex items-center justify-center text-[#171717]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#171717]">30-Day Hassle-Free Returns</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              Try your items in the comfort of your home. Easy returns and size swaps with pre-paid return labels.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7E5E0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F6F1] flex items-center justify-center text-[#171717]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#171717]">100% Authentic Guarantee</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              Every item is certified genuine with direct brand warranty and meticulous packaging.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
