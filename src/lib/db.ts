import fs from 'fs';
import path from 'path';
import {
  Product,
  Category,
  CartItem,
  Order,
  Review,
  User,
  Coupon,
  OrderStatus,
} from './types';
import {
  initialCategories,
  initialProducts,
  initialReviews,
  initialUsers,
  initialOrders,
  initialCoupons,
} from './seedData';

interface UserRecord extends User {
  passwordHash: string;
}

interface CartStore {
  [userId: string]: CartItem[];
}

interface WishlistStore {
  [userId: string]: string[]; // productIds
}

interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  reviews: Review[];
  users: UserRecord[];
  orders: Order[];
  coupons: Coupon[];
  carts: CartStore;
  wishlists: WishlistStore;
}

const DB_DIR = path.join(process.cwd(), 'src', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Initial default carts matching the mockup:
// In the mockup: Nike Air Max 270, Men's Hoodie, Women Handbag
const initialCarts: CartStore = {
  'user-hassaan': [
    {
      id: 'cart-item-1',
      product_id: 'prod-1',
      quantity: 1,
      selected_size: '9',
      selected_color: 'Pure White',
      price: 24000,
      product: initialProducts[0],
    },
    {
      id: 'cart-item-2',
      product_id: 'prod-4',
      quantity: 1,
      selected_size: 'L',
      selected_color: 'Pitch Black',
      price: 8000,
      product: initialProducts[3],
    },
    {
      id: 'cart-item-3',
      product_id: 'prod-3',
      quantity: 1,
      selected_size: 'Standard',
      selected_color: 'Caramel Tan',
      price: 12500,
      product: initialProducts[2],
    },
  ],
};

const initialWishlists: WishlistStore = {
  'user-hassaan': ['prod-1', 'prod-2', 'prod-10'],
};

function ensureDbFile(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseSchema = {
        categories: initialCategories,
        products: initialProducts,
        reviews: initialReviews,
        users: initialUsers,
        orders: initialOrders,
        coupons: initialCoupons,
        carts: initialCarts,
        wishlists: initialWishlists,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }

    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data) as DatabaseSchema;
  } catch (error) {
    console.error('Error reading/initializing database file:', error);
    return {
      categories: initialCategories,
      products: initialProducts,
      reviews: initialReviews,
      users: initialUsers,
      orders: initialOrders,
      coupons: initialCoupons,
      carts: initialCarts,
      wishlists: initialWishlists,
    };
  }
}

function writeDb(db: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database file:', error);
  }
}

// ==================== PRODUCTS ====================

export function getProducts(options?: {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): { products: Product[]; total: number; totalPages: number } {
  const db = ensureDbFile();
  let list = [...db.products];

  if (options?.category && options.category !== 'all' && options.category !== 'All Fashion') {
    const catLower = options.category.toLowerCase();
    list = list.filter(
      (p) =>
        p.category_slug.toLowerCase() === catLower ||
        p.category_name.toLowerCase() === catLower ||
        (catLower === 'fashion' && (p.category_slug === 'fashion' || p.brand === "Levi's" || p.brand === 'Zara' || p.brand === 'H&M'))
    );
  }

  if (options?.brand) {
    const brands = options.brand.split(',').map((b) => b.trim().toLowerCase());
    list = list.filter((p) => brands.includes(p.brand.toLowerCase()));
  }

  if (options?.size) {
    const sizes = options.size.split(',').map((s) => s.trim().toUpperCase());
    list = list.filter((p) => p.sizes.some((sz) => sizes.includes(sz.toUpperCase())));
  }

  if (options?.minPrice !== undefined && !isNaN(options.minPrice)) {
    list = list.filter((p) => p.price >= (options.minPrice || 0));
  }

  if (options?.maxPrice !== undefined && !isNaN(options.maxPrice) && options.maxPrice > 0) {
    list = list.filter((p) => p.price <= (options.maxPrice || Infinity));
  }

  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q)
    );
  }

  // Sorting
  switch (options?.sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
    case 'best-rated':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'popular':
    case 'most-popular':
      list.sort((a, b) => b.reviews_count - a.reviews_count);
      break;
    case 'newest':
    default:
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
  }

  const total = list.length;
  const page = options?.page || 1;
  const limit = options?.limit || 24;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(total / limit);

  return {
    products: paginated,
    total,
    totalPages,
  };
}

export function getProductByIdOrSlug(idOrSlug: string): Product | null {
  const db = ensureDbFile();
  return (
    db.products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null
  );
}

export function createProduct(productData: Omit<Product, 'id' | 'created_at' | 'rating' | 'reviews_count'>): Product {
  const db = ensureDbFile();
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
    rating: 5.0,
    reviews_count: 0,
    created_at: new Date().toISOString(),
  };

  db.products.unshift(newProduct);

  // Update category product count
  const cat = db.categories.find((c) => c.id === newProduct.category_id || c.slug === newProduct.category_slug);
  if (cat) {
    cat.product_count = (cat.product_count || 0) + 1;
  }

  writeDb(db);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const db = ensureDbFile();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...updates,
  };

  writeDb(db);
  return db.products[index];
}

export function deleteProduct(id: string): boolean {
  const db = ensureDbFile();
  const initialLength = db.products.length;
  const product = db.products.find((p) => p.id === id);
  db.products = db.products.filter((p) => p.id !== id);

  if (product) {
    const cat = db.categories.find((c) => c.id === product.category_id || c.slug === product.category_slug);
    if (cat && cat.product_count > 0) {
      cat.product_count -= 1;
    }
  }

  writeDb(db);
  return db.products.length < initialLength;
}

export function updateProductStock(id: string, delta: number): Product | null {
  const db = ensureDbFile();
  const product = db.products.find((p) => p.id === id);
  if (!product) return null;

  product.stock = Math.max(0, product.stock + delta);
  writeDb(db);
  return product;
}

// ==================== CATEGORIES ====================

export function getCategories(): Category[] {
  const db = ensureDbFile();
  return db.categories;
}

export function createCategory(cat: Omit<Category, 'id' | 'product_count'>): Category {
  const db = ensureDbFile();
  const newCat: Category = {
    ...cat,
    id: `cat-${Date.now()}`,
    product_count: 0,
  };
  db.categories.push(newCat);
  writeDb(db);
  return newCat;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const db = ensureDbFile();
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) return null;

  db.categories[index] = {
    ...db.categories[index],
    ...updates,
  };

  writeDb(db);
  return db.categories[index];
}

export function deleteCategory(id: string): boolean {
  const db = ensureDbFile();
  const len = db.categories.length;
  db.categories = db.categories.filter((c) => c.id !== id);
  writeDb(db);
  return db.categories.length < len;
}

// ==================== CART ====================

export function getCart(userId: string): CartItem[] {
  const db = ensureDbFile();
  const items = db.carts[userId] || [];
  // Ensure each cart item has the latest product information and stock
  return items.map((item) => {
    const prod = db.products.find((p) => p.id === item.product_id) || item.product;
    return {
      ...item,
      product: prod,
      price: prod ? prod.price : item.price,
    };
  });
}

export function addToCart(
  userId: string,
  data: {
    product_id: string;
    quantity: number;
    selected_size?: string;
    selected_color?: string;
  }
): CartItem[] {
  const db = ensureDbFile();
  if (!db.carts[userId]) {
    db.carts[userId] = [];
  }

  const product = db.products.find((p) => p.id === data.product_id);
  if (!product) throw new Error('Product not found');
  if (product.stock <= 0) throw new Error('Product is out of stock');

  const selectedSize = data.selected_size || (product.sizes?.[0] ?? 'Standard');
  const selectedColor = data.selected_color || (product.colors?.[0]?.name ?? 'Default');

  // Check if same item already exists with same size & color
  const existingIndex = db.carts[userId].findIndex(
    (item) =>
      item.product_id === data.product_id &&
      item.selected_size === selectedSize &&
      item.selected_color === selectedColor
  );

  if (existingIndex > -1) {
    const current = db.carts[userId][existingIndex];
    const newQty = Math.min(product.stock, current.quantity + (data.quantity || 1));
    db.carts[userId][existingIndex].quantity = newQty;
  } else {
    const newItem: CartItem = {
      id: `cart-item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      product_id: product.id,
      quantity: Math.min(product.stock, data.quantity || 1),
      selected_size: selectedSize,
      selected_color: selectedColor,
      price: product.price,
      product,
    };
    db.carts[userId].unshift(newItem);
  }

  writeDb(db);
  return getCart(userId);
}

export function updateCartItemQuantity(
  userId: string,
  itemId: string,
  quantity: number
): CartItem[] {
  const db = ensureDbFile();
  if (!db.carts[userId]) return [];

  if (quantity <= 0) {
    db.carts[userId] = db.carts[userId].filter((i) => i.id !== itemId);
  } else {
    const item = db.carts[userId].find((i) => i.id === itemId);
    if (item) {
      const product = db.products.find((p) => p.id === item.product_id);
      const maxStock = product ? product.stock : 99;
      item.quantity = Math.min(maxStock, quantity);
    }
  }

  writeDb(db);
  return getCart(userId);
}

export function removeCartItem(userId: string, itemId: string): CartItem[] {
  const db = ensureDbFile();
  if (!db.carts[userId]) return [];

  db.carts[userId] = db.carts[userId].filter((i) => i.id !== itemId);
  writeDb(db);
  return getCart(userId);
}

export function clearCart(userId: string): void {
  const db = ensureDbFile();
  db.carts[userId] = [];
  writeDb(db);
}

// ==================== WISHLIST ====================

export function getWishlist(userId: string): Product[] {
  const db = ensureDbFile();
  const productIds = db.wishlists[userId] || [];
  return db.products.filter((p) => productIds.includes(p.id));
}

export function toggleWishlist(userId: string, productId: string): { inWishlist: boolean; wishlist: Product[] } {
  const db = ensureDbFile();
  if (!db.wishlists[userId]) {
    db.wishlists[userId] = [];
  }

  const exists = db.wishlists[userId].includes(productId);
  if (exists) {
    db.wishlists[userId] = db.wishlists[userId].filter((id) => id !== productId);
  } else {
    db.wishlists[userId].push(productId);
  }

  writeDb(db);
  return {
    inWishlist: !exists,
    wishlist: getWishlist(userId),
  };
}

// ==================== ORDERS & INVENTORY ====================

export function getOrders(userId?: string): Order[] {
  const db = ensureDbFile();
  let orders = [...db.orders];
  if (userId) {
    orders = orders.filter((o) => o.user_id === userId);
  }
  return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getOrderById(orderIdOrNumber: string): Order | null {
  const db = ensureDbFile();
  return (
    db.orders.find(
      (o) => o.id === orderIdOrNumber || o.order_number === orderIdOrNumber
    ) || null
  );
}

export function createOrder(data: {
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  payment_method: 'cod' | 'card';
  items: CartItem[];
  coupon_code?: string;
}): Order {
  const db = ensureDbFile();

  if (!data.items || data.items.length === 0) {
    throw new Error('Cannot create an empty order');
  }

  // 1. Verify and decrement stock automatically
  for (const item of data.items) {
    const product = db.products.find((p) => p.id === item.product_id);
    if (!product) {
      throw new Error(`Product ${item.product?.name || item.product_id} no longer exists`);
    }
    if (product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for "${product.name}". Only ${product.stock} available.`
      );
    }
  }

  // Decrement inventory
  for (const item of data.items) {
    const product = db.products.find((p) => p.id === item.product_id);
    if (product) {
      product.stock -= item.quantity;
    }
  }

  // Calculate pricing
  const subtotal = data.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 500; // Free shipping over Rs. 5000 as per design!

  let discount = 0;
  if (data.coupon_code) {
    const coupon = db.coupons.find(
      (c) => c.code.toUpperCase() === data.coupon_code?.toUpperCase()
    );
    if (coupon && subtotal >= coupon.min_order) {
      if (coupon.discount_percent) {
        discount = Math.round((subtotal * coupon.discount_percent) / 100);
      } else if (coupon.discount_amount) {
        discount = coupon.discount_amount;
      }
    }
  }

  const total = Math.max(0, subtotal + shipping - discount);
  const randomOrderNum = Math.floor(10000 + Math.random() * 90000).toString();

  const newOrder: Order = {
    id: `order-${Date.now()}`,
    order_number: randomOrderNum,
    user_id: data.user_id,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    customer_phone: data.customer_phone,
    total,
    subtotal,
    shipping,
    discount,
    coupon_code: data.coupon_code,
    payment_method: data.payment_method,
    payment_status: data.payment_method === 'card' ? 'completed' : 'pending',
    status: 'Processing',
    shipping_address: data.shipping_address,
    items: data.items.map((i) => ({
      id: `order-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      product_id: i.product_id,
      name: i.product.name,
      image: i.product.images[0],
      quantity: i.quantity,
      price: i.price,
      selected_size: i.selected_size,
      selected_color: i.selected_color,
    })),
    created_at: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);

  // Clear user cart upon successful order
  if (data.user_id) {
    db.carts[data.user_id] = [];
  }

  writeDb(db);
  return newOrder;
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const db = ensureDbFile();
  const order = db.orders.find((o) => o.id === id || o.order_number === id);
  if (!order) return null;

  order.status = status;
  if (status === 'Delivered') {
    order.payment_status = 'completed';
  } else if (status === 'Cancelled') {
    // Return stock on cancel
    for (const item of order.items) {
      const p = db.products.find((prod) => prod.id === item.product_id);
      if (p) {
        p.stock += item.quantity;
      }
    }
  }

  writeDb(db);
  return order;
}

// ==================== REVIEWS ====================

export function getReviewsByProductId(productId: string): Review[] {
  const db = ensureDbFile();
  return db.reviews
    .filter((r) => r.product_id === productId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function addReview(data: {
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
}): Review {
  const db = ensureDbFile();
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    product_id: data.product_id,
    user_name: data.user_name,
    rating: data.rating,
    comment: data.comment,
    created_at: new Date().toISOString(),
  };

  db.reviews.unshift(newReview);

  // Recalculate product rating
  const prodReviews = db.reviews.filter((r) => r.product_id === data.product_id);
  const avg =
    prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;

  const product = db.products.find((p) => p.id === data.product_id);
  if (product) {
    product.rating = Math.round(avg * 10) / 10;
    product.reviews_count = prodReviews.length;
  }

  writeDb(db);
  return newReview;
}

// ==================== AUTH & USERS ====================

export function getUserByEmail(email: string): UserRecord | null {
  const db = ensureDbFile();
  return (
    db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  );
}

export function getUserById(id: string): User | null {
  const db = ensureDbFile();
  const user = db.users.find((u) => u.id === id);
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

export function getAllUsers(): User[] {
  const db = ensureDbFile();
  return db.users.map(({ passwordHash, ...u }) => u);
}

export function createUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'user' | 'admin';
}): User {
  const db = ensureDbFile();
  const existing = db.users.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase()
  );
  if (existing) {
    throw new Error('An account with this email already exists');
  }

  const newUser: UserRecord = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    passwordHash: data.password, // demo simple hash
    phone: data.phone || '',
    role: data.role || 'user',
    created_at: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDb(db);

  const { passwordHash, ...safeUser } = newUser;
  return safeUser;
}

// ==================== COUPONS ====================

export function validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
  const db = ensureDbFile();
  const coupon = db.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase().trim());

  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid coupon code' };
  }

  if (subtotal < coupon.min_order) {
    return {
      valid: false,
      discount: 0,
      message: `Coupon requires a minimum order of Rs. ${coupon.min_order.toLocaleString()}`,
    };
  }

  let discount = 0;
  if (coupon.discount_percent) {
    discount = Math.round((subtotal * coupon.discount_percent) / 100);
  } else if (coupon.discount_amount) {
    discount = coupon.discount_amount;
  }

  return {
    valid: true,
    discount,
    message: `Coupon applied: ${coupon.description}`,
    coupon,
  };
}

// ==================== ANALYTICS ====================

export function getAnalytics() {
  const db = ensureDbFile();

  const totalSales = db.orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = db.orders.length;
  const totalProducts = db.products.length;
  const totalCustomers = db.users.filter((u) => u.role === 'user').length;

  // Best selling products
  const productSalesMap: { [prodId: string]: { name: string; salesCount: number; revenue: number; image: string } } = {};
  for (const order of db.orders) {
    if (order.status === 'Cancelled') continue;
    for (const item of order.items) {
      if (!productSalesMap[item.product_id]) {
        productSalesMap[item.product_id] = {
          name: item.name,
          salesCount: 0,
          revenue: 0,
          image: item.image,
        };
      }
      productSalesMap[item.product_id].salesCount += item.quantity;
      productSalesMap[item.product_id].revenue += item.price * item.quantity;
    }
  }

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Recent 6 orders
  const recentOrders = [...db.orders].slice(0, 6);

  // Low stock products alert
  const lowStockProducts = db.products.filter((p) => p.stock <= 5);

  return {
    totalSales,
    totalOrders,
    totalProducts,
    totalCustomers,
    topProducts,
    recentOrders,
    lowStockProducts,
  };
}

