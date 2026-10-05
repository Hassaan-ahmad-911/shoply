import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const result = validateCoupon(code, Number(subtotal || 0));
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to validate coupon' }, { status: 500 });
  }
}

