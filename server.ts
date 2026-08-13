import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './src/server/migrateAndSeed';
import { db } from './src/server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Turso DB tables & seed if empty
  try {
    await initDatabase();
  } catch (err) {
    console.error('Error initializing Turso database:', err);
  }

  // Helper for admin auth check
  const verifyAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
      return;
    }
    const token = authHeader.split(' ')[1];
    if (token !== 'admin-secret-session-token') {
      res.status(403).json({ error: 'Forbidden: Invalid token' });
      return;
    }
    next();
  };

  // --- API ROUTES ---

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'Turso (libSQL)' });
  });

  // Admin Login
  app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body;
    try {
      const result = await db.execute({
        sql: `SELECT value FROM admin_settings WHERE key = 'admin_password'`,
        args: []
      });
      const savedPass = result.rows[0]?.value || 'admin123';
      if (password === savedPass) {
        res.json({ success: true, token: 'admin-secret-session-token' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Categories API
  app.get('/api/categories', async (req, res) => {
    try {
      const catRes = await db.execute(`SELECT * FROM categories`);
      const subRes = await db.execute(`SELECT * FROM subcategories`);

      const categories = catRes.rows.map((cat: any) => {
        const subCategories = subRes.rows
          .filter((sub: any) => sub.parent_id === cat.id)
          .map((sub: any) => ({
            id: sub.id,
            name: sub.name,
            parentId: sub.parent_id,
            description: sub.description
          }));

        return {
          id: cat.id,
          name: cat.name,
          description: cat.description,
          image: cat.image,
          itemCount: cat.item_count,
          badge: cat.badge || undefined,
          subCategories
        };
      });

      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/categories', verifyAdmin, async (req, res) => {
    const { id, name, description, image, badge, subCategories } = req.body;
    try {
      await db.execute({
        sql: `INSERT OR REPLACE INTO categories (id, name, description, image, badge) VALUES (?, ?, ?, ?, ?)`,
        args: [id, name, description || '', image || '', badge || null]
      });

      if (Array.isArray(subCategories)) {
        for (const sub of subCategories) {
          await db.execute({
            sql: `INSERT OR REPLACE INTO subcategories (id, name, parent_id, description) VALUES (?, ?, ?, ?)`,
            args: [sub.id, sub.name, id, sub.description || '']
          });
        }
      }

      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/categories/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await db.execute({ sql: `DELETE FROM categories WHERE id = ?`, args: [id] });
      await db.execute({ sql: `DELETE FROM subcategories WHERE parent_id = ?`, args: [id] });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Products API
  app.get('/api/products', async (req, res) => {
    try {
      const prodRes = await db.execute(`SELECT * FROM products ORDER BY created_at DESC`);
      const catRes = await db.execute(`SELECT id, name FROM categories`);
      const catMap = new Map(catRes.rows.map((c: any) => [c.id, c.name]));

      const products = prodRes.rows.map((p: any) => ({
        id: p.id,
        name: p.name,
        subtitle: p.subtitle,
        category: p.category_id,
        categoryName: catMap.get(p.category_id) || p.category_id,
        subCategory: p.sub_category_id,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        rating: Number(p.rating || 0),
        reviewCount: Number(p.review_count || 0),
        images: p.images ? JSON.parse(p.images) : [],
        description: p.description || '',
        features: p.features ? JSON.parse(p.features) : [],
        specifications: p.specifications ? JSON.parse(p.specifications) : {},
        isBestSeller: Boolean(p.is_best_seller),
        isNewArrival: Boolean(p.is_new_arrival),
        isFeatured: Boolean(p.is_featured),
        isDeal: Boolean(p.is_deal),
        dealEndsInHours: p.deal_ends_in_hours ? Number(p.deal_ends_in_hours) : undefined,
        stock: Number(p.stock || 0),
        colors: p.colors ? JSON.parse(p.colors) : [],
        sizes: p.sizes ? JSON.parse(p.sizes) : [],
        tags: p.tags ? JSON.parse(p.tags) : []
      }));

      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/products', verifyAdmin, async (req, res) => {
    const prod = req.body;
    try {
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
          prod.stock || 10,
          JSON.stringify(prod.colors || []),
          JSON.stringify(prod.sizes || []),
          JSON.stringify(prod.tags || [])
        ]
      });

      res.json({ success: true, product: prod });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/products/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await db.execute({ sql: `DELETE FROM products WHERE id = ?`, args: [id] });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reviews API
  app.get('/api/reviews', async (req, res) => {
    try {
      const result = await db.execute(`SELECT * FROM reviews ORDER BY date DESC`);
      const reviews = result.rows.map((rev: any) => ({
        id: rev.id,
        productId: rev.product_id,
        author: rev.author,
        avatar: rev.avatar,
        rating: Number(rev.rating),
        date: rev.date,
        title: rev.title,
        comment: rev.comment,
        verified: Boolean(rev.verified),
        likes: Number(rev.likes || 0)
      }));
      res.json(reviews);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    const rev = req.body;
    try {
      await db.execute({
        sql: `INSERT OR REPLACE INTO reviews (id, product_id, author, avatar, rating, date, title, comment, verified, likes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          rev.id || `REV-${Date.now()}`,
          rev.productId,
          rev.author,
          rev.avatar || null,
          rev.rating,
          rev.date || new Date().toISOString().split('T')[0],
          rev.title || '',
          rev.comment,
          rev.verified ? 1 : 0,
          rev.likes || 0
        ]
      });

      // Update product review_count & rating in DB
      const revsRes = await db.execute({
        sql: `SELECT rating FROM reviews WHERE product_id = ?`,
        args: [rev.productId]
      });
      const count = revsRes.rows.length;
      const avg = count > 0 
        ? revsRes.rows.reduce((sum: number, r: any) => sum + Number(r.rating), 0) / count 
        : 0;

      await db.execute({
        sql: `UPDATE products SET review_count = ?, rating = ? WHERE id = ?`,
        args: [count, Number(avg.toFixed(1)), rev.productId]
      });

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // FAQs API
  app.get('/api/faqs', async (req, res) => {
    try {
      const result = await db.execute(`SELECT * FROM faqs`);
      res.json(result.rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Coupons API
  app.get('/api/coupons', async (req, res) => {
    try {
      const result = await db.execute(`SELECT * FROM coupons`);
      const coupons = result.rows.map((c: any) => ({
        code: c.code,
        discountType: c.discount_type,
        value: Number(c.value),
        minSpend: c.min_spend ? Number(c.min_spend) : undefined,
        description: c.description
      }));
      res.json(coupons);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Orders API
  app.get('/api/orders', async (req, res) => {
    try {
      const result = await db.execute(`SELECT * FROM orders ORDER BY created_at DESC`);
      const orders = result.rows.map((ord: any) => ({
        id: ord.id,
        date: ord.date,
        items: JSON.parse(ord.items),
        shippingAddress: JSON.parse(ord.shipping_address),
        paymentMethod: ord.payment_method,
        paymentStatus: ord.payment_status,
        amountPaid: Number(ord.amount_paid || 0),
        dueAmount: Number(ord.due_amount || 0),
        subtotal: Number(ord.subtotal),
        tax: Number(ord.tax),
        shippingFee: Number(ord.shipping_fee),
        discount: Number(ord.discount),
        total: Number(ord.total),
        status: ord.status,
        estimatedDelivery: ord.estimated_delivery
      }));
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/orders', async (req, res) => {
    const ord = req.body;
    try {
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

      res.json({ success: true, id: ord.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/orders/:id/status', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      await db.execute({
        sql: `UPDATE orders SET status = ? WHERE id = ?`,
        args: [status, id]
      });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
