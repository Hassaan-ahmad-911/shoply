'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';

export default function BenefitBar() {
  const benefits = [
    {
      icon: Truck,
      title: 'Free Shipping',
      subtitle: 'on orders over Rs. 5,000',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      subtitle: '30-day return policy',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      subtitle: '100% secure checkout',
    },
  ];

  return (
    <div className="w-full py-8 border-y border-[#E7E5E0]/70 my-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#E7E5E0]/70">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={b.title}
              className={`flex items-center gap-4 ${
                idx !== 0 ? 'pt-4 md:pt-0 md:pl-8' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-transparent flex items-center justify-center flex-shrink-0 text-[#171717]">
                <Icon className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-bold text-[#171717]">{b.title}</h4>
                <p className="text-xs text-[#666666]">{b.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

