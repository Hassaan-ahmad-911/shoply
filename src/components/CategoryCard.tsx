'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-shoply-border hover:border-neutral-300 hover:shadow-subtle transition duration-200"
    >
      {/* Category Image Box */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F4F3EE] flex items-center justify-center mb-3">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 33vw, 16vw"
        />
      </div>

      {/* Label and Subtitle */}
      <div className="space-y-0.5 w-full px-1">
        <h3 className="text-sm font-semibold text-shoply-text group-hover:text-neutral-600 transition truncate">
          {category.name}
        </h3>
        <p className="text-xs text-shoply-mutedText truncate">
          {category.description}
        </p>
      </div>
    </Link>
  );
}

