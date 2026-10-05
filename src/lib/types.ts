export interface ProductColor {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  specifications: Record<string, string>;
  price: number;
  sale_price?: number;
  category_id: string;
  category_name: string;
  category_slug: string;
  brand: string;
  stock: number;
  images: string[];
  rating: number;
  reviews_count: number;
  sizes: string[];
  colors: ProductColor[];
  is_featured?: boolean;
  is_trending?: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  product_count: number;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  selected_size: string;
  selected_color: string;
  price: number;
  product: Product;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  selected_size: string;
  selected_color: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  coupon_code?: string;
  payment_method: 'cod' | 'card';
  payment_status: 'pending' | 'completed' | 'failed';
  status: OrderStatus;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  created_at: string;
}

export interface Coupon {
  code: string;
  discount_percent?: number;
  discount_amount?: number;
  min_order: number;
  description: string;
}

