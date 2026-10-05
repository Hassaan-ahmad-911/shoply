import { NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/db';

export async function GET() {
  try {
    const data = getAnalytics();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch analytics' }, { status: 500 });
  }
}

