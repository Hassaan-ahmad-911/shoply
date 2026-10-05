import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const size = searchParams.get('size') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const sort = searchParams.get('sort') || undefined;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 24;

    const data = getProducts({
      search,
      category,
      brand,
      size,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.price || !body.category_id) {
      return NextResponse.json({ error: 'Name, price and category are required' }, { status: 400 });
    }

    const newProduct = createProduct({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: body.description || '',
      specifications: body.specifications || {},
      price: Number(body.price),
      sale_price: body.sale_price ? Number(body.sale_price) : undefined,
      category_id: body.category_id,
      category_name: body.category_name || 'General',
      category_slug: body.category_slug || 'general',
      brand: body.brand || 'Shoply',
      stock: Number(body.stock ?? 10),
      images: body.images && body.images.length > 0 ? body.images : [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
      ],
      sizes: body.sizes || ['Standard'],
      colors: body.colors || [{ name: 'Black', hex: '#111111' }],
      is_featured: Boolean(body.is_featured),
      is_trending: Boolean(body.is_trending),
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

