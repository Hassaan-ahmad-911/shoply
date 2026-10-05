import { NextRequest, NextResponse } from 'next/server';
import { getWishlist, toggleWishlist } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-hassaan';
    const wishlist = getWishlist(userId);
    return NextResponse.json({ wishlist });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user-hassaan';
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const result = toggleWishlist(userId, productId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update wishlist' }, { status: 500 });
  }
}

