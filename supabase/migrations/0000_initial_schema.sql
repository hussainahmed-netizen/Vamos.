-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  item_count INTEGER DEFAULT 0,
  badge TEXT
);

-- 2. SubCategories Table
CREATE TABLE sub_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT
);

-- 3. Products Table
CREATE TABLE products (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  subtitle TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  sub_category_id TEXT REFERENCES sub_categories(id) ON DELETE SET NULL,
  category_name TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  image TEXT,
  image_url TEXT,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_best_seller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_deal BOOLEAN DEFAULT false,
  deal_ends_in_hours INTEGER,
  stock INTEGER DEFAULT 0,
  colors JSONB, -- Array of { name, hex }
  sizes TEXT[],
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Reviews Table
CREATE TABLE reviews (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  avatar TEXT,
  rating INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0
);

-- 5. Orders Table
CREATE TABLE orders (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  items JSONB NOT NULL, -- Array of CartItems
  shipping_address JSONB NOT NULL, -- ShippingAddress object
  payment_method TEXT NOT NULL,
  payment_status TEXT,
  amount_paid DECIMAL(10, 2),
  due_amount DECIMAL(10, 2),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  shipping_fee DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL,
  estimated_delivery TIMESTAMP WITH TIME ZONE
);

-- 6. Wishlists Table
CREATE TABLE wishlists (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Categories: Public Read, Admin Write (For now, let's just make it public read)
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- SubCategories: Public Read
CREATE POLICY "SubCategories are viewable by everyone" ON sub_categories FOR SELECT USING (true);

-- Products: Public Read
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);

-- Reviews: Public Read, Authenticated users can insert
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Orders: Users can only see and create their own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Wishlists: Users can manage their own wishlists
CREATE POLICY "Users can view own wishlist" ON wishlists FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist" ON wishlists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from wishlist" ON wishlists FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Add some seed data to categories
INSERT INTO categories (id, name, description, image) VALUES 
('electronics', 'Electronics & Audio', 'Latest gadgets and audio devices', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800'),
('fashion', 'Fashion & Apparel', 'Trendy clothing and accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800'),
('home', 'Home & Living', 'Furniture, decor and essentials', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=800');
