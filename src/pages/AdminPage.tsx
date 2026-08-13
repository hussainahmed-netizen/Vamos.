import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, CategoryItem, Order } from '../types';
import { compressAndUploadImage } from '../lib/cloudinary';
import { 
  Lock, 
  Plus, 
  Trash2, 
  Edit, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  Package, 
  Grid, 
  ShoppingBag, 
  Database, 
  Image as ImageIcon,
  LogOut,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Store,
  ArrowLeft
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { products, categories, ordersHistory, refreshData, showToast, setView } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_token') === 'admin-secret-session-token';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'system'>('products');

  // Products state
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Upload state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadInfo, setUploadInfo] = useState<{ orig: number; comp: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Inject noindex meta tag for Admin Panel
  useEffect(() => {
    let meta = document.querySelector("meta[name='robots']");
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');

    return () => {
      meta?.setAttribute('content', 'index, follow');
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();

      if (data.success && data.token) {
        sessionStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        showToast('Admin Authentication Successful!', 'success');
      } else {
        setLoginError(data.message || 'Invalid Password');
      }
    } catch {
      setLoginError('Failed to connect to authentication API');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    showToast('Logged out of Admin Panel', 'info');
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'product' | 'category') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadInfo(null);

    try {
      const res = await compressAndUploadImage(file, (p) => setUploadProgress(p));
      setUploadInfo({ orig: res.originalSizeKB, comp: res.compressedSizeKB });

      if (targetField === 'product' && editingProduct) {
        const updatedImages = [...(editingProduct.images || []), res.url];
        setEditingProduct({ ...editingProduct, images: updatedImages });
      }

      showToast(`Uploaded & compressed (${res.originalSizeKB}KB → ${res.compressedSizeKB}KB)`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Product Save/Delete
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.category) {
      showToast('Please fill required fields (Name, Price, Category)', 'error');
      return;
    }

    const prodData: Product = {
      id: editingProduct.id || `prod-${Date.now()}`,
      name: editingProduct.name,
      subtitle: editingProduct.subtitle || '',
      category: editingProduct.category,
      categoryName: categories.find(c => c.id === editingProduct.category)?.name || editingProduct.category,
      subCategory: editingProduct.subCategory || '',
      price: Number(editingProduct.price),
      originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
      rating: editingProduct.rating || 5.0,
      reviewCount: editingProduct.reviewCount || 1,
      images: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
      description: editingProduct.description || '',
      features: Array.isArray(editingProduct.features) ? editingProduct.features : [],
      specifications: editingProduct.specifications || {},
      isBestSeller: editingProduct.isBestSeller || false,
      isNewArrival: editingProduct.isNewArrival || false,
      isFeatured: editingProduct.isFeatured || false,
      isDeal: editingProduct.isDeal || false,
      dealEndsInHours: editingProduct.dealEndsInHours || 24,
      stock: Number(editingProduct.stock || 10),
      colors: editingProduct.colors || [],
      sizes: editingProduct.sizes || [],
      tags: editingProduct.tags || ['featured']
    };

    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(prodData)
      });

      if (res.ok) {
        showToast('Product saved to Turso database!', 'success');
        setIsProductModalOpen(false);
        setEditingProduct(null);
        refreshData();
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to save product', 'error');
      }
    } catch {
      showToast('Error saving product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product from Turso DB?')) return;
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Product deleted', 'success');
        refreshData();
      }
    } catch {
      showToast('Failed to delete product', 'error');
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`Order status updated to ${newStatus}`, 'success');
        refreshData();
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  // If NOT authenticated, show Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#2B080C] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-[#2C3539]">Admin Portal Access</h1>
            <p className="text-xs text-slate-500">
              Protected authentication required to manage Turso DB & Cloudinary
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Admin Security Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password (default: admin123)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2B080C] focus:bg-white outline-none transition-all"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-[#2B080C] hover:bg-[#380B0F] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Unlock Admin Dashboard
                </>
              )}
            </button>
          </form>

          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] text-amber-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Default password is <strong>admin123</strong> (stored securely in Turso DB settings).</span>
          </div>

          <button
            onClick={() => setView('home')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </button>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Bar */}
      <div className="bg-[#2C3539] text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] uppercase rounded-md tracking-wider border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Turso Database
            </span>
            <span className="px-2.5 py-1 bg-sky-500/20 text-sky-300 font-extrabold text-[10px] uppercase rounded-md tracking-wider border border-sky-500/30 flex items-center gap-1">
              Cloudinary Unsigned Upload
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black mt-2">Dynamic Store Administration</h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time CRUD management backed by Turso libSQL Edge DB and Cloudinary image optimization
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setView('home')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <Store className="w-4 h-4" /> Storefront
          </button>
          <button
            onClick={() => refreshData()}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Sync Turso
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'products', label: 'Products Catalog', icon: Package, count: products.length },
          { id: 'categories', label: 'Categories', icon: Grid, count: categories.length },
          { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, count: ordersHistory.length },
          { id: 'system', label: 'Database & Cloudinary', icon: Database }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-t-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white border-t-2 border-[#2B080C] text-[#2B080C] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-[#2B080C] text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRODUCTS CATALOG */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products in Turso DB..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#2B080C] outline-none"
              />
            </div>

            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  price: 0,
                  category: categories[0]?.id || 'electronics',
                  stock: 15,
                  images: [],
                  description: '',
                  features: []
                });
                setIsProductModalOpen(true);
              }}
              className="px-5 py-2.5 bg-[#2B080C] hover:bg-[#380B0F] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase">
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Badges</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || 'https://via.placeholder.com/80'}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#2C3539]">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-600 capitalize">
                        {p.category}
                      </td>
                      <td className="p-4 font-extrabold text-[#2C3539]">
                        ৳{p.price.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${p.stock > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {p.isBestSeller && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[9px]">Best Seller</span>}
                          {p.isNewArrival && <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded font-bold text-[9px]">New</span>}
                          {p.isFeatured && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded font-bold text-[9px]">Featured</span>}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsProductModalOpen(true);
                            }}
                            className="p-2 text-slate-600 hover:text-[#2B080C] hover:bg-slate-100 rounded-lg transition-all"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="h-32 rounded-xl overflow-hidden relative">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                {cat.badge && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#2B080C] text-white font-extrabold text-[10px] rounded">
                    {cat.badge}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-[#2C3539]">{cat.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-semibold border-t border-slate-100">
                <span>Subcategories: {cat.subCategories.length}</span>
                <span>{cat.itemCount} Items</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CUSTOMER ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {ordersHistory.map((ord) => (
            <div key={ord.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-[#2C3539]">{ord.id}</span>
                    <span className="text-xs text-slate-400">({ord.date})</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Customer: {ord.shippingAddress?.fullName} | {ord.shippingAddress?.phone}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">Status:</span>
                  <select
                    value={ord.status}
                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#2C3539] outline-none"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-500">Items Count: <strong>{ord.items?.length || 0}</strong></p>
                  <p className="text-slate-500">Payment Method: <strong className="uppercase">{ord.paymentMethod}</strong></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total Paid / Due</p>
                  <p className="text-lg font-black text-[#2B080C]">৳{ord.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: SYSTEM CONFIG & STATUS */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-emerald-600 font-bold">
              <Database className="w-6 h-6" />
              <h2 className="text-lg text-[#2C3539]">Turso Edge Database (libSQL)</h2>
            </div>
            <div className="space-y-2 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700">
              <p><strong>DB Engine:</strong> @libsql/client</p>
              <p><strong>Database URL:</strong> turso://vamos-demo-e-commerce-hussain-ahmed.aws-ap-south-1.turso.io</p>
              <p><strong>Status:</strong> Connected & Parameterized</p>
              <p><strong>Location:</strong> AWS AP South 1 (Mumbai Edge)</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-sky-600 font-bold">
              <ImageIcon className="w-6 h-6" />
              <h2 className="text-lg text-[#2C3539]">Cloudinary Image Hosting</h2>
            </div>
            <div className="space-y-2 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700">
              <p><strong>Upload Mode:</strong> Client-side Unsigned</p>
              <p><strong>Cloud Name:</strong> kgo9phri</p>
              <p><strong>Upload Preset:</strong> vamos-demo-e-commerce</p>
              <p><strong>Auto Compression:</strong> browser-image-compression (&lt;100KB target)</p>
              <p><strong>URL Optimization:</strong> f_auto, q_auto parameters enabled</p>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE PRODUCT MODAL */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-[#2C3539]">
                {editingProduct.id ? 'Edit Product' : 'Add New Product to Turso DB'}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#2B080C] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <select
                    value={editingProduct.category || categories[0]?.id}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#2B080C] outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price (৳) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#2B080C] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#2B080C] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#2B080C] outline-none"
                  />
                </div>
              </div>

              {/* Cloudinary Compressed Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product Image (Auto-compressed &lt;100KB to Cloudinary)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-[#2B080C] transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'product')}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-1">
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-[#2C3539]">Click or Drag image here to Upload</p>
                    <p className="text-[10px] text-slate-400">Browser compression executes before upload to Cloudinary Unsigned Preset</p>
                  </div>
                </div>

                {uploadProgress !== null && (
                  <div className="mt-2 space-y-1">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#2B080C] h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono text-center">Uploading... {uploadProgress}%</p>
                  </div>
                )}

                {uploadInfo && (
                  <div className="mt-2 p-2 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-mono flex items-center justify-between">
                    <span>Original Size: {uploadInfo.orig} KB</span>
                    <span className="font-bold">Compressed Size: {uploadInfo.comp} KB (&lt;100KB Target)</span>
                  </div>
                )}

                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {editingProduct.images.map((img, idx) => (
                      <div key={idx} className="relative group shrink-0">
                        <img src={img} alt="Product" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingProduct.images?.filter((_, i) => i !== idx);
                            setEditingProduct({ ...editingProduct, images: updated });
                          }}
                          className="absolute -top-1 -right-1 bg-rose-600 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#2B080C] outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestSeller || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="rounded accent-[#2B080C]"
                  /> Best Seller
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNewArrival || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                    className="rounded accent-[#2B080C]"
                  /> New Arrival
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="rounded accent-[#2B080C]"
                  /> Featured
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2B080C] hover:bg-[#380B0F] text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Save to Turso DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
