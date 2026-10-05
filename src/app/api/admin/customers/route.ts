import { NextResponse } from 'next/server';
import { getAllUsers, getOrders } from '@/lib/db';

export async function GET() {
  try {
    const users = getAllUsers();
    const orders = getOrders();

    const customers = users.map((u) => {
      const userOrders = orders.filter((o) => o.user_id === u.id || o.customer_email.toLowerCase() === u.email.toLowerCase());
      const totalSpent = userOrders
        .filter((o) => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + o.total, 0);

      return {
        ...u,
        orderCount: userOrders.length,
        totalSpent,
      };
    });

    return NextResponse.json({ customers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch customers' }, { status: 500 });
  }
}

