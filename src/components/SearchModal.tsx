'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Live search debounced
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const popularSearches = ['Nike Air Max', 'Apple Watch', 'Handbag', 'Hoodie', 'Denim Jacket', 'Sneakers'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-elevated border border-shoply-border overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center px-4 sm:px-6 py-4 border-b border-shoply-border">
          <Search className="w-5 h-5 text-shoply-mutedText mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, or categories..."
            className="w-full text-base sm:text-lg text-shoply-text placeholder:text-shoply-lightText bg-transparent outline-none font-medium"
          />
          {loading && <Loader2 className="w-5 h-5 text-shoply-mutedText animate-spin mr-2" />}
          {query && !loading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-shoply-mutedText hover:text-shoply-text mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-shoply-mutedText hover:text-shoply-text rounded-lg hover:bg-neutral-100 transition"
          >
            <span className="text-xs font-semibold px-1.5 py-0.5 border border-shoply-border rounded bg-shoply-bg hidden sm:inline">ESC</span>
            <X className="w-5 h-5 sm:hidden" />
          </button>
        </form>

        {/* Content Section */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {query.trim() === '' ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-shoply-mutedText mb-3">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                    }}
                    className="px-3.5 py-1.5 text-sm bg-shoply-bg text-shoply-text hover:bg-neutral-200 rounded-full transition font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-shoply-mutedText">
                  Products ({results.length})
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-semibold text-shoply-accent hover:underline flex items-center gap-1"
                >
                  View all results <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="divide-y divide-shoply-border">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-3 px-2 hover:bg-shoply-bg rounded-xl transition group"
                  >
                    <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-shoply-cardBg flex-shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-shoply-mutedText uppercase tracking-wider">{product.brand}</p>
                      <h4 className="text-sm font-semibold text-shoply-text truncate">{product.name}</h4>
                      <p className="text-xs text-shoply-mutedText">{product.category_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-shoply-text">{formatPrice(product.price)}</p>
                      {product.sale_price && (
                        <p className="text-xs text-shoply-lightText line-through">{formatPrice(product.sale_price)}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-base font-medium text-shoply-text">No products found for &quot;{query}&quot;</p>
              <p className="text-xs text-shoply-mutedText mt-1">Check spelling or try a broader search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

