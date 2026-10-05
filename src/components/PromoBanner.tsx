'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PromoBanner() {
  return (
    <div className="relative w-full my-8 sm:my-10">
      <Link
        href="/shop?sale=true"
        aria-label="Limited Time Offer - Up to 50% Off On Selected Items - Shop Deals"
        className="group relative block w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 bg-[#565B4A]"
      >
        <div className="relative w-full aspect-[2024/528] min-h-[180px] sm:min-h-[220px] md:min-h-[260px] lg:min-h-[300px]">
          <Image
            src="/images/promo_banner_user_exact.png"
            alt="Limited Time Offer - Up to 50% Off On Selected Items"
            fill
            priority
            className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1560px) 95vw, 1500px"
          />
        </div>
      </Link>
    </div>
  );
}
