export type CategoryId = 'all' | 'electronics' | 'fashion' | 'home' | 'beauty' | 'accessories' | 'gadgets';

export interface SubCategory {
  id: string;
  name: string;
  parentId: CategoryId;
  description?: string;
}

export interface CategoryItem {
  id: CategoryId;
  name: string;
  description: string;
  image: string;
  itemCount: number;
  badge?: string;
  subCategories: SubCategory[];
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: CategoryId;
  subCategory?: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  image?: string;
  imageUrl?: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isDeal?: boolean;
  dealEndsInHours?: number;
  stock: number;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  tags: string[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  likes: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
  description: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes?: string;
}

export type PaymentMethod = 'card' | 'cod' | 'paypal' | 'mobile_wallet';
export type PaymentStatus = 'cod' | 'online_paid' | 'half_paid' | 'delivery_charge_paid';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  amountPaid?: number;
  dueAmount?: number;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'Order Placed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
}

export type ViewMode = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'order-success' | 'wishlist' | 'account' | 'admin';

export type AccountTab = 'overview' | 'orders' | 'reviews' | 'returns';

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  shipping_address: string | null;
  city_district: string | null;
  secondary_phone: string | null;
  delivery_instructions: string | null;
}
