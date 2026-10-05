'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, CheckCircle, ThumbsUp, ShieldCheck, MessageSquare, ArrowRight } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  product: string;
  productSlug: string;
  verified: boolean;
  helpfulCount: number;
  avatarBg: string;
  initials: string;
}

const reviewsData: Review[] = [
  {
    id: 'rev-1',
    name: 'Sophia Al-Mansoor',
    location: 'Dubai, UAE',
    rating: 5,
    date: '2 days ago',
    title: 'Flawless build quality & unbelievable sound',
    content: 'The over-ear studio headphones arrived in under 48 hours. Packaging was impeccable, with zero plastic waste. The acoustic depth and ambient noise isolation are easily on par with flagship gear costing twice as much.',
    product: 'Studio Wireless Headphones',
    productSlug: 'apple-watch-series-9',
    verified: true,
    helpfulCount: 38,
    avatarBg: 'bg-[#D6CBB9]',
    initials: 'SA',
  },
  {
    id: 'rev-2',
    name: 'Marcus Vance',
    location: 'Melbourne, AU',
    rating: 5,
    date: '4 days ago',
    title: 'Minimalist aesthetic done with perfection',
    content: 'Finding brands that balance modern architectural aesthetics with robust durability is rare. Shoply nailed every detail — stitching on the leather goods is pristine, and the ceramic pieces have this tactile matte finish I adore.',
    product: 'Craft Ceramic Living Set',
    productSlug: 'womens-handbag',
    verified: true,
    helpfulCount: 24,
    avatarBg: 'bg-[#C27847]',
    initials: 'MV',
  },
  {
    id: 'rev-3',
    name: 'Amina Tariq',
    location: 'Lahore, PK',
    rating: 5,
    date: '1 week ago',
    title: 'Exceptional customer service and true sizing',
    content: 'I had a sizing inquiry prior to placing my order and the support team responded within 10 minutes on a Sunday! The linen blend shirts fit like custom tailoring. Will definitely be a regular customer.',
    product: 'Relaxed Tailored Cotton Hoodie',
    productSlug: 'mens-hoodie',
    verified: true,
    helpfulCount: 19,
    avatarBg: 'bg-[#171717]',
    initials: 'AT',
  },
  {
    id: 'rev-4',
    name: 'Julian Mercer',
    location: 'London, UK',
    rating: 5,
    date: '2 weeks ago',
    title: 'Everyday carry upgrade of the year',
    content: 'Ordered the leather commuter backpack. The zippers glide effortlessly, the laptop compartment has genuine shock absorption, and the leather smells rich and authentic. Worth every single penny.',
    product: 'Minimalist Travel Backpack',
    productSlug: 'nike-air-max-270',
    verified: true,
    helpfulCount: 31,
    avatarBg: 'bg-[#524E44]',
    initials: 'JM',
  },
];

export default function CustomerReviews() {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({});

  const handleHelpful = (id: string) => {
    setHelpfulClicked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const displayedReviews = filterRating
    ? reviewsData.filter((r) => r.rating === filterRating)
    : reviewsData;

  return (
    <section className="py-16 sm:py-20 border-t border-[#E7E5E0]">
      {/* Top Header & Trust Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7E5E0] text-xs font-semibold text-[#171717] tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Customer Reviews
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717]">
            Loved by over 18,000+ satisfied customers
          </h2>
          <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
            Real experiences from design enthusiasts and discerning shoppers who trust Shoply for their daily essentials.
          </p>
        </div>

        {/* Aggregate Ratings Card */}
        <div className="flex items-center gap-6 bg-white p-5 sm:p-6 rounded-2xl border border-[#E7E5E0] shadow-subtle">
          <div className="text-center pr-6 border-r border-[#E7E5E0]">
            <div className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
              4.9
            </div>
            <div className="flex items-center justify-center gap-0.5 text-amber-500 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              ))}
            </div>
            <div className="text-[11px] text-[#888888] font-medium">3,420+ ratings</div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-medium text-[#171717]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Verified Purchases</span>
            </div>
            <div className="flex items-center gap-2 text-[#666666]">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>99.2% On-Time Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-[#666666]">
              <MessageSquare className="w-4 h-4 text-[#C27847]" />
              <span>24/7 Concierge Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedReviews.map((rev) => {
          const isMarked = helpfulClicked[rev.id];
          const count = rev.helpfulCount + (isMarked ? 1 : 0);

          return (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E7E5E0] shadow-subtle hover:border-[#D6CBB9] transition-all flex flex-col justify-between"
            >
              {/* Review Header: Stars, Verified Badge, Date */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>

                  <span className="text-xs text-[#888888] font-normal">{rev.date}</span>
                </div>

                {/* Review Title */}
                <h3 className="text-base sm:text-lg font-bold text-[#171717] mb-2 leading-snug">
                  "{rev.title}"
                </h3>

                {/* Review Body */}
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-6 font-normal">
                  {rev.content}
                </p>
              </div>

              {/* Review Footer: Product Tag & Customer Info */}
              <div className="pt-4 border-t border-[#F0EFEA] space-y-4">
                {/* Purchased product pill */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#888888] truncate max-w-[240px]">
                    Item: <span className="text-[#171717] font-medium">{rev.product}</span>
                  </span>
                  
                  <button
                    onClick={() => handleHelpful(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                      isMarked
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-[#666666] hover:bg-[#F8F6F1] hover:text-[#171717]'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isMarked ? 'fill-emerald-600' : ''}`} />
                    <span>Helpful ({count})</span>
                  </button>
                </div>

                {/* Reviewer Details */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full ${rev.avatarBg} text-white flex items-center justify-center text-xs font-bold tracking-wider`}
                  >
                    {rev.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#171717]">{rev.name}</span>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#888888]">{rev.location}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review CTA Banner */}
      <div className="mt-10 bg-white rounded-2xl p-6 sm:p-8 border border-[#E7E5E0] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-[#171717]">
            Have you ordered with Shoply recently?
          </h4>
          <p className="text-xs sm:text-sm text-[#666666]">
            Share your feedback and receive Rs. 500 store credit toward your next curation.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171717] text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
