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

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
