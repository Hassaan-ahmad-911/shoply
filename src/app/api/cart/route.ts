import { NextRequest, NextResponse } from 'next/server';
import { getCart, addToCart, updateCartItemQuantity, removeCartItem, clearCart } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-hassaan';
    const items = getCart(userId);
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user-hassaan';
    const { product_id, quantity = 1, selected_size, selected_color } = body;

    if (!product_id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const items = addToCart(userId, {
      product_id,
      quantity,
      selected_size,
      selected_color,
    });

    return NextResponse.json({ items, message: 'Item added to cart' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add to cart' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user-hassaan';
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json({ error: 'Item ID and quantity are required' }, { status: 400 });
    }

    const items = updateCartItemQuantity(userId, itemId, Number(quantity));
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-hassaan';
    const itemId = searchParams.get('itemId');
    const isClear = searchParams.get('clear') === 'true';

    if (isClear) {
      clearCart(userId);
      return NextResponse.json({ items: [], message: 'Cart cleared' });
    }

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const items = removeCartItem(userId, itemId);
    return NextResponse.json({ items, message: 'Item removed from cart' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to remove cart item' }, { status: 500 });
  }
}

