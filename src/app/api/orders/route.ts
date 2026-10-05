import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const isAdmin = searchParams.get('admin') === 'true';

    // If admin is requesting without a specific userId, return all orders
    const orders = getOrders(isAdmin && !userId ? undefined : (userId || 'user-hassaan'));
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id = 'user-hassaan',
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      payment_method = 'cod',
      items,
      coupon_code,
    } = body;

    if (!customer_name || !customer_email || !shipping_address || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order details (customer info, address, or items)' },
        { status: 400 }
      );
    }

    const order = createOrder({
      user_id,
      customer_name,
      customer_email,
      customer_phone: customer_phone || '',
      shipping_address,
      payment_method,
      items,
      coupon_code,
    });

    return NextResponse.json({ order, success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 400 });
  }
}

