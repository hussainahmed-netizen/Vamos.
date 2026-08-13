import { db } from './db';
import { CATEGORIES, PRODUCTS, REVIEWS, FAQS, COUPONS, MOCK_ORDERS } from '../data/mockData';

export async function initDatabase() {
  console.log('Initializing Turso Database Tables...');

  // 1. Categories Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT,
      item_count INTEGER DEFAULT 0,
      badge TEXT
    )
  `);

  // 2. Subcategories Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS subcategories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      parent_id TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);

  // 3. Products Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subtitle TEXT,
      category_id TEXT NOT NULL,
      sub_category_id TEXT,
      price REAL NOT NULL,
      original_price REAL,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      images TEXT NOT NULL,
      description TEXT,
      features TEXT,
      specifications TEXT,
      is_best_seller INTEGER DEFAULT 0,
      is_new_arrival INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      is_deal INTEGER DEFAULT 0,
      deal_ends_in_hours INTEGER,
      stock INTEGER DEFAULT 10,
      colors TEXT,
      sizes TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4. Reviews Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      author TEXT NOT NULL,
      avatar TEXT,
      rating INTEGER NOT NULL,
      date TEXT,
      title TEXT,
      comment TEXT,
      verified INTEGER DEFAULT 1,
      likes INTEGER DEFAULT 0
    )
  `);

  // 5. FAQs Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL
    )
  `);

  // 6. Coupons Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      discount_type TEXT NOT NULL,
      value REAL NOT NULL,
      min_spend REAL,
      description TEXT
    )
  `);

  // 7. Orders Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      date TEXT,
      items TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      payment_method TEXT,
      payment_status TEXT,
      amount_paid REAL DEFAULT 0,
      due_amount REAL DEFAULT 0,
      subtotal REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      shipping_fee REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      total REAL DEFAULT 0,
      status TEXT DEFAULT 'Processing',
      estimated_delivery TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 8. Admin Settings Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  console.log('Database tables created/verified.');

  // Check if categories table is empty
  const catRes = await db.execute('SELECT COUNT(*) as count FROM categories');
  const catCount = Number(catRes.rows[0]?.count || 0);

  if (catCount === 0) {
    console.log('Seeding initial data into Turso...');

    for (const cat of CATEGORIES) {
      await db.execute({
        sql: `INSERT OR REPLACE INTO categories (id, name, description, image, item_count, badge) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [cat.id, cat.name, cat.description || '', cat.image, cat.itemCount || 0, cat.badge || null]
      });

      if (cat.subCategories && cat.subCategories.length > 0) {
        for (const sub of cat.subCategories) {
          await db.execute({
            sql: `INSERT OR REPLACE INTO subcategories (id, name, parent_id, description) VALUES (?, ?, ?, ?)`,
            args: [sub.id, sub.name, cat.id, sub.description || '']
          });
        }
      }
    }

    for (const prod of PRODUCTS) {
      await db.execute({
        sql: `INSERT OR REPLACE INTO products (
          id, name, subtitle, category_id, sub_category_id, price, original_price,
          rating, review_count, images, description, features, specifications,
          is_best_seller, is_new_arrival, is_featured, is_deal, deal_ends_in_hours,
          stock, colors, sizes, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          prod.id,
          prod.name,
          prod.subtitle || null,
          prod.category,
          prod.subCategory || null,
          prod.price,
          prod.originalPrice || null,
          prod.rating || 0,
          prod.reviewCount || 0,
          JSON.stringify(prod.images || []),
          prod.description || '',
          JSON.stringify(prod.features || []),
          JSON.stringify(prod.specifications || {}),
          prod.isBestSeller ? 1 : 0,
          prod.isNewArrival ? 1 : 0,
          prod.isFeatured ? 1 : 0,
          prod.isDeal ? 1 : 0,
          prod.dealEndsInHours || null,
          prod.stock || 20,
          JSON.stringify(prod.colors || []),
          JSON.stringify(prod.sizes || []),
          JSON.stringify(prod.tags || [])
        ]
      });
    }

    for (const rev of REVIEWS) {
      await db.execute({
        sql: `INSERT OR REPLACE INTO reviews (id, product_id, author, avatar, rating, date, title, comment, verified, likes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          rev.id,
          rev.productId,
          rev.author,
          rev.avatar || null,
          rev.rating,
          rev.date || new Date().toISOString(),
          rev.title || '',
          rev.comment,
          rev.verified ? 1 : 0,
          rev.likes || 0
        ]
      });
    }

    for (const faq of FAQS) {
      await db.execute({
        sql: `INSERT INTO faqs (category, question, answer) VALUES (?, ?, ?)`,
        args: [faq.category, faq.question, faq.answer]
      });
    }

    for (const c of COUPONS) {
      await db.execute({
        sql: `INSERT OR REPLACE INTO coupons (code, discount_type, value, min_spend, description) VALUES (?, ?, ?, ?, ?)`,
        args: [c.code, c.discountType, c.value, c.minSpend || null, c.description || '']
      });
    }

    for (const ord of MOCK_ORDERS) {
      await db.execute({
        sql: `INSERT OR REPLACE INTO orders (
          id, date, items, shipping_address, payment_method, payment_status,
          amount_paid, due_amount, subtotal, tax, shipping_fee, discount, total, status, estimated_delivery
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          ord.id,
          ord.date,
          JSON.stringify(ord.items),
          JSON.stringify(ord.shippingAddress),
          ord.paymentMethod,
          ord.paymentStatus,
          ord.amountPaid || 0,
          ord.dueAmount || 0,
          ord.subtotal,
          ord.tax,
          ord.shippingFee,
          ord.discount,
          ord.total,
          ord.status,
          ord.estimatedDelivery
        ]
      });
    }

    await db.execute({
      sql: `INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_password', 'admin123')`,
      args: []
    });

    console.log('Successfully seeded initial data into Turso DB!');
  }
}
