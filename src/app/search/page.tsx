'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    async function executeSearch() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&sort=${sortBy}&limit=40`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    executeSearch();
  }, [query, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-shoply-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-shoply-mutedText uppercase tracking-wider">
            Search Results
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-shoply-text mt-1">
            {query ? `Results for “${query}”` : 'Search All Products'}
          </h1>
          <p className="text-xs text-shoply-mutedText mt-1">
            {loading ? 'Searching...' : `Found ${products.length} matching products`}
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-shoply-mutedText">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-shoply-bg border border-shoply-border rounded-xl px-3 py-2 text-xs font-semibold text-shoply-text outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="best-rated">Best Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-shoply-border p-3 space-y-3 animate-pulse">
              <div className="aspect-square bg-neutral-200 rounded-xl" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-4 bg-neutral-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-shoply-border p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-shoply-bg flex items-center justify-center mx-auto text-shoply-mutedText">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-shoply-text">No matching products found</h2>
          <p className="text-xs sm:text-sm text-shoply-mutedText max-w-sm mx-auto">
            Try searching for terms like &quot;shoes&quot;, &quot;hoodie&quot;, &quot;watch&quot;, or &quot;bag&quot;.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition"
          >
            Browse All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-sm text-shoply-mutedText">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}

