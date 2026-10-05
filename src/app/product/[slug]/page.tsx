'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  Check,
  Share2,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { Product, Review } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/format';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error: toastError, info } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Recommendations
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data: Product = await res.json();
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || 'Standard');
        setSelectedColor(data.colors?.[0]?.name || 'Standard');

        // Fetch reviews
        const revRes = await fetch(`/api/reviews?productId=${data.id}`);
        if (revRes.ok) {
          const revData = await revRes.json();
          setReviews(revData.reviews || []);
        }

        // Fetch related products
        const relRes = await fetch(`/api/products?category=${data.category_slug}&limit=4`);
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelatedProducts(relData.products.filter((p: Product) => p.id !== data.id));
        }
      } catch (err: any) {
        toastError(err.message || 'Error loading product');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-10 h-10 border-4 border-shoply-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-shoply-mutedText">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-shoply-text">Product not found</h2>
        <p className="text-sm text-shoply-mutedText">The product you are looking for does not exist or has been removed.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-shoply-accent text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const discountPercent =
    product.sale_price && product.sale_price > product.price
      ? Math.round(((product.sale_price - product.price) / product.sale_price) * 100)
      : null;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    await addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    const ok = await addToCart(product, quantity, selectedSize, selectedColor);
    if (ok) {
      router.push('/checkout');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewComment.trim()) {
      toastError('Please fill in your name and comment');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          user_name: newReviewerName.trim(),
          rating: newReviewRating,
          comment: newReviewComment.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviews([data.review, ...reviews]);
        setNewReviewerName('');
        setNewReviewComment('');
        success('Review submitted successfully!');
      } else {
        toastError('Failed to submit review');
      }
    } catch {
      toastError('Error submitting review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-shoply-mutedText mb-8">
        <Link href="/" className="hover:text-shoply-text transition">
          Home
        </Link>
        <span>&gt;</span>
        <Link href={`/shop?category=${product.category_slug}`} className="hover:text-shoply-text transition">
          {product.category_name}
        </Link>
        <span>&gt;</span>
        <span className="text-shoply-text font-medium truncate max-w-[200px] sm:max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Top Section: Gallery + Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* ================= LEFT: IMAGE GALLERY (Matches Mockup) ================= */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Vertical Thumbnail Strip */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 flex-shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F4F3EE] border-2 transition ${
                  selectedImage === idx
                    ? 'border-neutral-900 shadow-sm'
                    : 'border-transparent hover:border-neutral-300'
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="80px"
                />
              </button>
            ))}
          </div>

          {/* Large Main Product Image */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F4F3EE] border border-shoply-border flex items-center justify-center shadow-subtle">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover object-center transition-all duration-300"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            {/* Discount badge */}
            {discountPercent && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-md">
                  -{discountPercent}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT: PRODUCT DETAILS ================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title & Brand */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-shoply-mutedText uppercase tracking-wider">
              {product.brand}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-shoply-text font-sans">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-neutral-200 text-neutral-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-shoply-text">{product.rating}</span>
            <span className="text-xs text-shoply-mutedText">
              ({product.reviews_count} reviews)
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-shoply-text">
              {formatPrice(product.price)}
            </span>
            {product.sale_price && product.sale_price > product.price && (
              <>
                <span className="text-base text-shoply-lightText line-through">
                  {formatPrice(product.sale_price)}
                </span>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* Short Description */}
          <p className="text-sm text-shoply-mutedText leading-relaxed">
            {product.description}
          </p>

          <hr className="border-shoply-border" />

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-shoply-text">Color</span>
                <span className="text-shoply-mutedText font-medium">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((c) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`relative w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                        isSelected
                          ? 'ring-2 ring-neutral-900 ring-offset-2 scale-105'
                          : 'hover:scale-105 border-neutral-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={`Select color ${c.name}`}
                    >
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 ${
                            ['#FFFFFF', '#F0EBE1', '#F5F2EB', '#F4EFE6'].includes(c.hex.toUpperCase())
                              ? 'text-neutral-900'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-shoply-text">Size</span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs font-semibold text-neutral-800 underline hover:text-neutral-600"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl border transition ${
                        isSelected
                          ? 'bg-shoply-accent text-white border-shoply-accent'
                          : 'bg-white text-shoply-text border-shoply-border hover:bg-shoply-bg'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inventory Status Alert */}
          {isOutOfStock ? (
            <div className="p-3 bg-neutral-100 rounded-xl text-xs font-semibold text-neutral-600 border border-neutral-200">
              This product is currently out of stock. Check back soon!
            </div>
          ) : isLowStock ? (
            <div className="p-3 bg-amber-50 rounded-xl text-xs font-semibold text-amber-800 border border-amber-200">
              Hurry! Only {product.stock} items remaining in stock.
            </div>
          ) : (
            <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> In stock ready to dispatch
            </p>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center border border-shoply-border rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 text-shoply-text hover:bg-shoply-bg rounded-lg disabled:opacity-30 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-shoply-text">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2 text-shoply-text hover:bg-shoply-bg rounded-lg disabled:opacity-30 transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add To Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-6 rounded-xl bg-shoply-accent text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition shadow-subtle flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border border-shoply-border transition flex-shrink-0 ${
                  isFavorited
                    ? 'bg-red-50 text-red-500 border-red-200'
                    : 'bg-white text-shoply-text hover:bg-shoply-bg'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-3.5 px-6 rounded-xl border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-xs sm:text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          {/* Benefit Badges Row (Matches Mockup) */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-shoply-border text-center">
            <div className="p-3 bg-white rounded-xl border border-shoply-border space-y-1">
              <Truck className="w-4 h-4 mx-auto text-shoply-text" />
              <p className="text-[11px] font-bold text-shoply-text">Free Shipping</p>
              <p className="text-[10px] text-shoply-mutedText">Over Rs. 5,000</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-shoply-border space-y-1">
              <RotateCcw className="w-4 h-4 mx-auto text-shoply-text" />
              <p className="text-[11px] font-bold text-shoply-text">Easy Returns</p>
              <p className="text-[10px] text-shoply-mutedText">30-day policy</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-shoply-border space-y-1">
              <ShieldCheck className="w-4 h-4 mx-auto text-shoply-text" />
              <p className="text-[11px] font-bold text-shoply-text">Secure Payment</p>
              <p className="text-[10px] text-shoply-mutedText">100% secure</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABS SECTION (Description / Specs / Reviews) ================= */}
      <div className="mt-16 bg-white rounded-2xl border border-shoply-border p-6 sm:p-8 shadow-subtle">
        {/* Tab Headers */}
        <div className="flex border-b border-shoply-border gap-8 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`text-sm sm:text-base font-bold pb-3 -mb-3 transition border-b-2 ${
              activeTab === 'desc'
                ? 'border-neutral-900 text-shoply-text'
                : 'border-transparent text-shoply-mutedText hover:text-shoply-text'
            }`}
          >
            Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`text-sm sm:text-base font-bold pb-3 -mb-3 transition border-b-2 ${
              activeTab === 'specs'
                ? 'border-neutral-900 text-shoply-text'
                : 'border-transparent text-shoply-mutedText hover:text-shoply-text'
            }`}
          >
            Specifications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`text-sm sm:text-base font-bold pb-3 -mb-3 transition border-b-2 ${
              activeTab === 'reviews'
                ? 'border-neutral-900 text-shoply-text'
                : 'border-transparent text-shoply-mutedText hover:text-shoply-text'
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {activeTab === 'desc' && (
            <div className="space-y-4 text-sm text-shoply-mutedText leading-relaxed max-w-3xl">
              <p>{product.description}</p>
              <p>
                Each element has been calibrated for premium ergonomics, tactile satisfaction, and modern aesthetics.
                Crafted using sustainable processes and verified under rigorous quality control standards to deliver long-term value.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl divide-y divide-shoply-border text-sm">
              {Object.entries(product.specifications || {}).map(([key, val]) => (
                <div key={key} className="py-2.5 flex justify-between">
                  <span className="font-semibold text-shoply-text">{key}</span>
                  <span className="text-shoply-mutedText">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              {/* Add New Review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-shoply-bg p-4 sm:p-6 rounded-xl border border-shoply-border space-y-4">
                <h4 className="text-sm font-bold text-shoply-text">Write a Review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-shoply-text mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={newReviewerName}
                      onChange={(e) => setNewReviewerName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full text-xs p-2.5 rounded-lg border border-shoply-border bg-white text-shoply-text focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-shoply-text mb-1">Rating</label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-lg border border-shoply-border bg-white text-shoply-text focus:outline-none focus:border-neutral-900"
                    >
                      <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                      <option value="4">★★★★☆ (4 Stars - Great)</option>
                      <option value="3">★★★☆☆ (3 Stars - Average)</option>
                      <option value="2">★★☆☆☆ (2 Stars - Below expectations)</option>
                      <option value="1">★☆☆☆☆ (1 Star - Poor)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-shoply-text mb-1">Review Comment</label>
                  <textarea
                    required
                    rows={3}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Share your experience with fit, quality, and delivery..."
                    className="w-full text-xs p-2.5 rounded-lg border border-shoply-border bg-white text-shoply-text focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2.5 text-xs font-semibold bg-shoply-accent text-white rounded-lg hover:bg-neutral-800 transition disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-shoply-border bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-shoply-bg flex items-center justify-center text-xs font-bold text-shoply-text">
                            {rev.user_name.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-shoply-text">{rev.user_name}</span>
                        </div>
                        <span className="text-[11px] text-shoply-lightText">
                          {formatDate(rev.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-neutral-200 text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-shoply-mutedText leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-shoply-mutedText">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-shoply-text">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-shoply-border shadow-elevated">
            <div className="flex items-center justify-between pb-2 border-b border-shoply-border">
              <h3 className="text-base font-bold text-shoply-text">Standard Size Guide</h3>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className="text-xs text-shoply-mutedText hover:text-shoply-text"
              >
                Close
              </button>
            </div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-shoply-border text-shoply-mutedText">
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest / Foot (in)</th>
                  <th className="py-2">EU Equivalent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-shoply-border text-shoply-text">
                <tr><td className="py-2 font-medium">S / 7</td><td className="py-2">36 - 38 / 9.8&quot;</td><td className="py-2">40</td></tr>
                <tr><td className="py-2 font-medium">M / 8</td><td className="py-2">38 - 40 / 10.2&quot;</td><td className="py-2">41</td></tr>
                <tr><td className="py-2 font-medium">L / 9</td><td className="py-2">40 - 42 / 10.6&quot;</td><td className="py-2">42.5</td></tr>
                <tr><td className="py-2 font-medium">XL / 10</td><td className="py-2">42 - 44 / 11.0&quot;</td><td className="py-2">44</td></tr>
                <tr><td className="py-2 font-medium">11</td><td className="py-2">11.4&quot;</td><td className="py-2">45</td></tr>
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => setSizeGuideOpen(false)}
              className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

