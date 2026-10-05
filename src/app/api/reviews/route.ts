import { NextRequest, NextResponse } from 'next/server';
import { getReviewsByProductId, addReview } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const reviews = getReviewsByProductId(productId);
    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, user_name, rating, comment } = body;

    if (!product_id || !user_name || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    const review = addReview({
      product_id,
      user_name,
      rating: Number(rating),
      comment,
    });

    return NextResponse.json({ review, success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add review' }, { status: 500 });
  }
}

