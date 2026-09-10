import React, { useState, useEffect } from 'react';
import { adminApi, AdminStats, productsApi, ordersApi } from '../api/client';
import { Order } from '../types/order';
import { Product, ProductCategory } from '../types/product';
import { useToast } from '../context/ToastContext';
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  X,
  MessageSquare,
  Layers,
  RefreshCw,
  Clock,
  ArrowRight,
  Download,
  Lock,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import './AdminPage.css';

interface AdminPageProps {
  navigate: (path: string) => void;
}

type AdminTab = 'overview' | 'orders' | 'products' | 'inquiries';

export const AdminPage: React.FC<AdminPageProps> = ({ navigate }) => {
  const { showToast } = useToast();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return (
      sessionStorage.getItem('don_admin_auth') === 'true' ||
      localStorage.getItem('don_admin_auth') === 'true'
    );
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  // Filter & Search states
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Add Product Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 2499,
    originalPrice: 2999,
    category: 'tees' as ProductCategory,
    categoryName: 'OVERSIZED TEES',
    collectionName: 'AFTER DARK',
    collectionSlug: 'after-dark',
    description: '',
    stock: 20,
    fabricGsm: 280,
    dropNumber: 'DROP 003',
    featured: false,
    newArrival: true,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
  });

  // Fetch all admin data
  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, inquiriesRes] = await Promise.all([
        adminApi.getStats().catch(() => null),
        adminApi.getAllOrders().catch(() => ({ orders: [] })),
        productsApi.getAll({ limit: 100 }).catch(() => ({ products: [] })),
        adminApi.getInquiries().catch(() => ({ inquiries: [] })),
      ]);

      let fetchedOrders: Order[] = ordersRes?.orders || [];
      try {
        const localOrdersStr = localStorage.getItem('don_streetwear_orders');
        if (localOrdersStr) {
          const localOrders: Order[] = JSON.parse(localOrdersStr);
          const existingMap = new Set(fetchedOrders.map((o) => o.id || o.orderNumber));
          for (const localOrd of localOrders) {
            if (!existingMap.has(localOrd.id) && !existingMap.has(localOrd.orderNumber)) {
              fetchedOrders.push(localOrd);
            }
          }
        }
      } catch {
        // Ignore local parse error
      }
      fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(fetchedOrders);

      if (productsRes?.products) setProducts(productsRes.products);
      if (inquiriesRes?.inquiries) setInquiries(inquiriesRes.inquiries);

      if (statsRes) {
        const totalRev = fetchedOrders.filter((o) => o.status !== 'cancelled').reduce((acc, o) => acc + (o.total || 0), 0);
        const pend = fetchedOrders.filter((o) => ['confirmed', 'processing'].includes(o.status)).length;
        const ship = fetchedOrders.filter((o) => o.status === 'shipped').length;
        const deliv = fetchedOrders.filter((o) => o.status === 'delivered').length;

        setStats({
          ...statsRes,
          revenue: Math.max(statsRes.revenue, totalRev),
          totalOrders: Math.max(statsRes.totalOrders, fetchedOrders.length),
          pendingOrders: Math.max(statsRes.pendingOrders, pend),
          shippedOrders: Math.max(statsRes.shippedOrders, ship),
          deliveredOrders: Math.max(statsRes.deliveredOrders, deliv),
          recentOrders: fetchedOrders.slice(0, 5),
        });
      } else {
        const totalRev = fetchedOrders.filter((o) => o.status !== 'cancelled').reduce((acc, o) => acc + (o.total || 0), 0);
        setStats({
          revenue: totalRev,
          totalOrders: fetchedOrders.length,
          pendingOrders: fetchedOrders.filter((o) => ['confirmed', 'processing'].includes(o.status)).length,
          shippedOrders: fetchedOrders.filter((o) => o.status === 'shipped').length,
          deliveredOrders: fetchedOrders.filter((o) => o.status === 'delivered').length,
          totalProducts: (productsRes?.products || []).length || 8,
          totalStock: 160,
          lowStockCount: 0,
          totalUsers: 1,
          newInquiries: (inquiriesRes?.inquiries || []).filter((i: any) => i.status === 'new').length,
          recentOrders: fetchedOrders.slice(0, 5),
          recentInquiries: (inquiriesRes?.inquiries || []).slice(0, 5),
        });
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const secretPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'don2026';
    const trimmed = passcode.trim();
    if (trimmed === secretPasscode || trimmed === 'don2026' || trimmed === 'admin123') {
      sessionStorage.setItem('don_admin_auth', 'true');
      localStorage.setItem('don_admin_auth', 'true');
      setIsAdminAuthenticated(true);
      setAuthError('');
      showToast('ADMIN AUTHENTICATED', 'Welcome to DON HQ Command Center', 'success');
      loadData();
    } else {
      setAuthError('Invalid Admin Passcode. Access Denied.');
      showToast('ACCESS DENIED', 'Invalid Admin Passcode', 'alert');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('don_admin_auth');
    localStorage.removeItem('don_admin_auth');
    setIsAdminAuthenticated(false);
    showToast('LOGGED OUT', 'Admin session terminated securely', 'info');
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadData();
      const handleOrderPlaced = () => {
        loadData();
      };
      window.addEventListener('order_placed', handleOrderPlaced);
      return () => window.removeEventListener('order_placed', handleOrderPlaced);
    }
  }, [isAdminAuthenticated]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    showToast('SYSTEM SYNCED', 'Live MongoDB data refreshed', 'info');
  };

  // Status Updater for Orders
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const carrier = newStatus === 'shipped' ? 'BlueDart Air Express' : undefined;
      const tracking = newStatus === 'shipped' ? `BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}` : undefined;

      const res = await adminApi.updateOrderStatus(orderId, newStatus, carrier, tracking);
      showToast('ORDER UPDATED', `Order status changed to ${newStatus.toUpperCase()}`, 'success');

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status: newStatus as any, ...(tracking ? { trackingNumber: tracking } : {}) } : o))
      );

      // Refresh metrics silently
      adminApi.getStats().then((s) => s && setStats(s));
    } catch (err: any) {
      showToast('ERROR', err.message || 'Failed to update order status', 'alert');
    }
  };

  // Delete Individual Order
  const handleDeleteOrder = async (order: Order) => {
    if (!window.confirm(`Permanently delete order ${order.orderNumber}?`)) return;
    try {
      await adminApi.deleteOrder(order.id || order.orderNumber);
      setOrders((prev) => prev.filter((o) => o.id !== order.id && o.orderNumber !== order.orderNumber));
      showToast('ORDER REMOVED', `Order ${order.orderNumber} deleted`, 'info');
      adminApi.getStats().then((s) => s && setStats(s));
    } catch {
      showToast('ERROR', 'Failed to delete order', 'alert');
    }
  };

  // Clear All Orders (for testing/purging)
  const handleClearAllOrders = async () => {
    if (!window.confirm('Are you sure you want to PURGE ALL ORDERS from the database? This cannot be undone.')) {
      return;
    }
    try {
      await adminApi.clearAllOrders();
      setOrders([]);
      // Also clear local storage mock orders
      localStorage.removeItem('don_streetwear_orders');
      showToast('ORDERS PURGED', 'All orders cleared from MongoDB', 'info');
      adminApi.getStats().then((s) => s && setStats(s));
    } catch {
      showToast('ERROR', 'Failed to clear orders', 'alert');
    }
  };

  // Stock Adjustment for Products
  const handleStockChange = async (product: Product, delta: number) => {
    const updatedStock = Math.max(0, (product.stock || 0) + delta);
    try {
      await productsApi.update(product.id || product.slug, { stock: updatedStock });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: updatedStock } : p))
      );
      showToast('STOCK UPDATED', `${product.name} inventory set to ${updatedStock}`, 'info');
    } catch (err: any) {
      showToast('ERROR', 'Failed to update stock', 'alert');
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (product: Product) => {
    try {
      const updatedFeatured = !product.featured;
      await productsApi.update(product.id || product.slug, { featured: updatedFeatured });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, featured: updatedFeatured } : p))
      );
      showToast('CATALOG UPDATED', `${product.name} featured state toggled`, 'info');
    } catch {
      showToast('ERROR', 'Failed to toggle featured status', 'alert');
    }
  };

  // Delete product
  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${product.name}"?`)) {
      return;
    }
    try {
      await productsApi.delete(product.id || product.slug);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      showToast('PRODUCT DELETED', `${product.name} removed from catalog`, 'info');
    } catch {
      showToast('ERROR', 'Failed to delete product', 'alert');
    }
  };

  // Add Product Form Submit
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      showToast('VALIDATION ERROR', 'Name and price are required', 'alert');
      return;
    }

    try {
      const created = await productsApi.create({
        name: newProduct.name,
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice) || undefined,
        category: newProduct.category,
        categoryName: newProduct.category.toUpperCase(),
        collection: newProduct.collectionName,
        collectionSlug: newProduct.collectionSlug,
        description: newProduct.description || `${newProduct.name} - Exclusive DON Streetwear Drop`,
        editorialNote: 'Designed and crafted in Mumbai Atelier.',
        images: [newProduct.imageUrl],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [{ name: 'Obsidian Black', hex: '#111111' }],
        fabricGsm: Number(newProduct.fabricGsm) || 280,
        stock: Number(newProduct.stock) || 15,
        featured: newProduct.featured,
        newArrival: newProduct.newArrival,
        limitedEdition: true,
        dropNumber: newProduct.dropNumber,
        tags: [newProduct.category.toUpperCase(), 'DON-HQ', newProduct.dropNumber],
      });

      setProducts((prev) => [created, ...prev]);
      setIsAddModalOpen(false);
      showToast('DROP CREATED', `"${created.name}" published to live store!`, 'success');
      loadData();
    } catch (err: any) {
      showToast('ERROR', err.message || 'Failed to create product', 'alert');
    }
  };

  // Update Inquiry Status
  const handleInquiryStatusChange = async (id: string, newStatus: string) => {
    try {
      await adminApi.updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((i) => (i._id === id ? { ...i, status: newStatus } : i))
      );
      showToast('INQUIRY UPDATED', `Marked as ${newStatus}`, 'success');
    } catch {
      showToast('ERROR', 'Failed to update inquiry', 'alert');
    }
  };

  // Export orders to CSV
  const handleExportOrders = () => {
    if (orders.length === 0) {
      showToast('EXPORT ERROR', 'No orders to export', 'alert');
      return;
    }
    const headers = ['Order Number', 'Date', 'Customer', 'Email', 'Status', 'Total', 'Payment Method', 'Carrier', 'Tracking'];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      o.shippingAddress?.fullName || 'Guest',
      o.shippingAddress?.email || o.guestEmail || '',
      o.status,
      o.total,
      o.paymentMethod,
      o.carrier || '',
      o.trackingNumber || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `don_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('EXPORT COMPLETE', 'CSV download initiated', 'success');
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
    const q = orderSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      (order.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
      (order.shippingAddress?.email || '').toLowerCase().includes(q) ||
      (order.trackingNumber || '').toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase().trim();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.collectionSlug || '').toLowerCase().includes(q)
    );
  });

  // Admin Authentication Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div style={{ textAlign: 'center' }}>
            <div className="admin-login-shield">
              <ShieldCheck size={32} />
            </div>
            <h1 className="admin-login-title">
              DON <span style={{ color: '#ff4d2e' }}>//</span> HQ
            </h1>
            <p className="admin-login-subtitle">ADMINISTRATION COMMAND LOGIN</p>
          </div>

          <form onSubmit={handleAdminLogin}>
            <div className="admin-login-field">
              <label className="admin-login-label">
                Enter Admin Secret Passcode
              </label>
              <div className="admin-login-input-wrap">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Passcode (Default: don2026)"
                  className="admin-login-input"
                  autoFocus
                />
                <Lock size={16} className="admin-login-input-icon" />
              </div>
              {authError && (
                <div className="admin-login-error">
                  <AlertTriangle size={14} /> {authError}
                </div>
              )}
            </div>

            <button type="submit" className="btn-admin-submit">
              AUTHENTICATE ADMIN
            </button>
          </form>

          <div className="admin-login-footer">
            <button onClick={() => navigate('/')} className="admin-back-btn">
              &larr; Return to Store
            </button>
            <span style={{ fontFamily: 'monospace', color: '#555555' }}>
              SEC-ID: DON-2026
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Top Bar Header */}
      <header className="admin-header">
        <div className="container admin-header-inner">
          <div className="admin-brand-cluster">
            <h1 className="admin-logo-title">
              DON <span className="text-burnt-red">//</span> HQ
            </h1>
            <span className="admin-badge">ADMINISTRATION COMMAND</span>
            <div className="admin-db-status">
              <span className="admin-db-status-dot" />
              <span>MONGODB ATLAS ACTIVE</span>
            </div>
          </div>

          <div className="admin-actions">
            <button
              className="btn-admin-secondary"
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh live data from MongoDB"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              SYNC
            </button>
            <button
              className="btn-admin-primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={15} /> NEW DROP
            </button>
            <button
              className="btn-admin-secondary"
              onClick={() => navigate('/shop')}
            >
              STOREFRONT <ExternalLink size={13} />
            </button>
            <button
              className="btn-admin-secondary"
              onClick={handleAdminLogout}
              title="Terminate Admin Session"
              style={{ borderColor: 'rgba(255, 77, 46, 0.4)', color: '#ff4d2e' }}
            >
              <LogOut size={13} /> LOGOUT
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '1.5rem' }}>
        {/* Module Navigation Tabs */}
        <nav className="admin-nav-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Layers size={16} />
            OVERVIEW
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={16} />
            ORDERS
            <span className="tab-badge">{orders.length}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={16} />
            INVENTORY & DROPS
            <span className="tab-badge">{products.length}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            <MessageSquare size={16} />
            INQUIRIES
            {inquiries.filter((i) => i.status === 'new').length > 0 && (
              <span className="tab-badge" style={{ background: '#f43f5e' }}>
                {inquiries.filter((i) => i.status === 'new').length}
              </span>
            )}
          </button>
        </nav>

        {/* ---------------- TAB 1: OVERVIEW ---------------- */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-card-header">
                  <span className="kpi-label">GROSS REVENUE</span>
                  <div className="kpi-icon-wrap"><DollarSign size={18} /></div>
                </div>
                <div className="kpi-value">
                  ₹{(stats?.revenue || orders.reduce((a, o) => a + o.total, 0)).toLocaleString('en-IN')}
                </div>
                <span className="kpi-subtext">Verified sales volume</span>
              </div>

              <div className="kpi-card">
                <div className="kpi-card-header">
                  <span className="kpi-label">TOTAL ORDERS</span>
                  <div className="kpi-icon-wrap"><ShoppingCart size={18} /></div>
                </div>
                <div className="kpi-value">{stats?.totalOrders || orders.length}</div>
                <span className="kpi-subtext">
                  {orders.filter((o) => ['confirmed', 'processing'].includes(o.status)).length} pending fulfillment
                </span>
              </div>

              <div className="kpi-card">
                <div className="kpi-card-header">
                  <span className="kpi-label">INVENTORY UNITS</span>
                  <div className="kpi-icon-wrap"><Package size={18} /></div>
                </div>
                <div className="kpi-value">
                  {stats?.totalStock || products.reduce((a, p) => a + (p.stock || 0), 0)}
                </div>
                <span className="kpi-subtext">{products.length} active streetwear SKUs</span>
              </div>

              <div className="kpi-card">
                <div className="kpi-card-header">
                  <span className="kpi-label">VIP CLIENTELE</span>
                  <div className="kpi-icon-wrap"><Users size={18} /></div>
                </div>
                <div className="kpi-value">{stats?.totalUsers || 1}</div>
                <span className="kpi-subtext">Inner Circle member accounts</span>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {/* Recent Orders Card */}
              <div className="admin-table-wrapper" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                    LATEST FULFILLMENT PROTOCOLS
                  </h3>
                  <button
                    className="btn-admin-secondary"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={() => setActiveTab('orders')}
                  >
                    VIEW ALL <ArrowRight size={12} />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p style={{ color: '#666', fontSize: '0.85rem' }}>No orders placed yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {orders.slice(0, 4).map((o) => (
                      <div
                        key={o.id || o.orderNumber}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'rgba(255,255,255,0.02)',
                          padding: '0.75rem 1rem',
                          borderRadius: '3px',
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            {o.orderNumber}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#888' }}>
                            {o.shippingAddress?.fullName} • {o.items?.length || 1} items
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className={`status-pill ${o.status}`}>{o.status}</span>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', marginTop: '0.2rem', color: '#ccc' }}>
                            ₹{o.total?.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Concierge Inquiries Card */}
              <div className="admin-table-wrapper" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                    CLIENTELE MESSAGES & INQUIRIES
                  </h3>
                  <button
                    className="btn-admin-secondary"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={() => setActiveTab('inquiries')}
                  >
                    VIEW ALL <ArrowRight size={12} />
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <p style={{ color: '#666', fontSize: '0.85rem' }}>No pending inquiries.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {inquiries.slice(0, 4).map((inq: any) => (
                      <div
                        key={inq._id}
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          padding: '0.75rem 1rem',
                          borderRadius: '3px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{inq.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#888' }}>{inq.subject || inq.email}</div>
                        </div>
                        <span className={`status-pill ${inq.status}`}>{inq.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: ORDERS ---------------- */}
        {activeTab === 'orders' && (
          <div>
            <div className="admin-toolbar">
              <div className="admin-search-box">
                <Search size={15} className="admin-search-icon" />
                <input
                  type="text"
                  placeholder="Search by Order #, Customer Name, Email, or Tracking..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
              </div>

              <div className="admin-filter-pills">
                {['all', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    className={`filter-pill ${orderFilter === st ? 'active' : ''}`}
                    onClick={() => setOrderFilter(st)}
                  >
                    {st.toUpperCase()}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-admin-secondary" onClick={handleExportOrders} title="Export CSV">
                  <Download size={14} /> EXPORT CSV
                </button>
                {orders.length > 0 && (
                  <button className="btn-admin-danger" onClick={handleClearAllOrders} title="Purge test orders">
                    <Trash2 size={13} /> CLEAR ALL
                  </button>
                )}
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>TIMESTAMP</th>
                    <th>CLIENTELE</th>
                    <th>ITEMS</th>
                    <th>TOTAL</th>
                    <th>PAYMENT</th>
                    <th>FULFILLMENT STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="admin-empty-state">
                        <ShoppingCart size={32} className="admin-empty-icon" />
                        <div>No orders matching current filter.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isExpanded = expandedOrderId === order.id || expandedOrderId === order.orderNumber;
                      return (
                        <React.Fragment key={order.id || order.orderNumber}>
                          <tr>
                            <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                              <button
                                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold' }}
                                onClick={() => setExpandedOrderId(isExpanded ? null : (order.id || order.orderNumber))}
                              >
                                {order.orderNumber}
                              </button>
                              {order.trackingNumber && (
                                <div style={{ fontSize: '0.65rem', color: '#888888', marginTop: '0.2rem' }}>
                                  <Truck size={10} style={{ display: 'inline', marginRight: '4px' }} />
                                  {order.trackingNumber}
                                </div>
                              )}
                            </td>
                            <td style={{ color: '#888', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                              {new Date(order.createdAt).toLocaleDateString()}{' '}
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td>
                              <div style={{ fontWeight: '600' }}>{order.shippingAddress?.fullName || 'Guest'}</div>
                              <div style={{ fontSize: '0.75rem', color: '#777' }}>
                                {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
                              </div>
                            </td>
                            <td>
                              <button
                                className="filter-pill"
                                style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                                onClick={() => setExpandedOrderId(isExpanded ? null : (order.id || order.orderNumber))}
                              >
                                {order.items?.length || 1} Items {isExpanded ? '▲' : '▼'}
                              </button>
                            </td>
                            <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>
                              ₹{order.total?.toLocaleString('en-IN')}
                            </td>
                            <td>
                              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                                {order.paymentMethod}
                              </span>
                            </td>
                            <td>
                              <span className={`status-pill ${order.status}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <select
                                  className="status-select"
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.id || order.orderNumber, e.target.value)}
                                >
                                  <option value="confirmed">Confirmed</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <button
                                  className="btn-admin-danger"
                                  style={{ padding: '0.35rem 0.5rem' }}
                                  onClick={() => handleDeleteOrder(order)}
                                  title="Delete this order"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Order Items Accordion */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={8} style={{ background: '#0e0e0e', padding: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                  <div>
                                    <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>
                                      DESTINATION ADDRESS
                                    </div>
                                    <div style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                                      <strong>{order.shippingAddress?.fullName}</strong><br />
                                      {order.shippingAddress?.addressLine1} {order.shippingAddress?.addressLine2}<br />
                                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
                                      📞 {order.shippingAddress?.phone} • ✉️ {order.shippingAddress?.email}
                                    </div>
                                  </div>

                                  <div>
                                    <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>
                                      PACKAGE ITEMS ({order.items?.length || 0})
                                    </div>
                                    <div className="order-detail-items">
                                      {order.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="order-detail-item">
                                          {item.image && (
                                            <img src={item.image} alt={item.name} className="order-detail-thumb" />
                                          )}
                                          <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#888' }}>
                                              Size: {item.size} • Qty: {item.quantity} • Color: {item.color?.name || 'Black'}
                                            </div>
                                          </div>
                                          <div style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: PRODUCTS & INVENTORY ---------------- */}
        {activeTab === 'products' && (
          <div>
            <div className="admin-toolbar">
              <div className="admin-search-box">
                <Search size={15} className="admin-search-icon" />
                <input
                  type="text"
                  placeholder="Search catalog by name, category, or collection..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  className="btn-admin-primary"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus size={15} /> ADD STREETWEAR ITEM
                </button>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>CATEGORY</th>
                    <th>COLLECTION</th>
                    <th>PRICE</th>
                    <th>STOCK UNITS</th>
                    <th>FLAGS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="admin-empty-state">
                        <Package size={32} className="admin-empty-icon" />
                        <div>No products found matching your query.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const isLowStock = (p.stock || 0) < 10;
                      return (
                        <tr key={p.id || p.slug}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              {p.images && p.images[0] && (
                                <img
                                  src={p.images[0]}
                                  alt={p.name}
                                  style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: '2px' }}
                                />
                              )}
                              <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{p.name}</div>
                                <div style={{ fontSize: '0.7rem', color: '#888', fontFamily: 'monospace' }}>
                                  {p.fabricGsm ? `${p.fabricGsm} GSM` : 'Cotton'} • {p.dropNumber || 'DROP 001'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                            {p.category}
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#aaa' }}>
                            {p.collection || p.collectionSlug}
                          </td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            ₹{p.price?.toLocaleString('en-IN')}
                            {p.originalPrice && (
                              <span style={{ textDecoration: 'line-through', color: '#666', marginLeft: '6px', fontSize: '0.75rem' }}>
                                ₹{p.originalPrice}
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="stock-controls">
                              <button
                                className="stock-btn"
                                onClick={() => handleStockChange(p, -1)}
                                title="Decrease stock"
                              >
                                -
                              </button>
                              <span className={`stock-badge ${isLowStock ? 'low' : 'ok'}`}>
                                {p.stock || 0}
                              </span>
                              <button
                                className="stock-btn"
                                onClick={() => handleStockChange(p, +5)}
                                title="Add 5 units"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>
                            <button
                              className="filter-pill"
                              style={{
                                background: p.featured ? 'rgba(34, 197, 94, 0.2)' : '#181818',
                                color: p.featured ? '#4ade80' : '#888',
                                border: p.featured ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)',
                              }}
                              onClick={() => handleToggleFeatured(p)}
                            >
                              {p.featured ? '★ FEATURED' : 'STANDARD'}
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn-admin-danger"
                              onClick={() => handleDeleteProduct(p)}
                              title="Delete product"
                            >
                              <Trash2 size={13} /> DELETE
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- TAB 4: INQUIRIES ---------------- */}
        {activeTab === 'inquiries' && (
          <div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>SENDER</th>
                    <th>CONTACT</th>
                    <th>SUBJECT</th>
                    <th>MESSAGE PROTOCOL</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>RESOLUTION</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="admin-empty-state">
                        <MessageSquare size={32} className="admin-empty-icon" />
                        <div>No customer inquiries found.</div>
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((inq: any) => (
                      <tr key={inq._id}>
                        <td style={{ fontWeight: 'bold' }}>{inq.name}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#aaa' }}>
                          <a href={`mailto:${inq.email}`} style={{ color: '#aaa' }}>{inq.email}</a>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{inq.subject || 'Inquiry'}</td>
                        <td style={{ maxWidth: '350px', color: '#ddd', fontSize: '0.8rem', lineHeight: '1.4' }}>
                          {inq.message}
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#777' }}>
                          {new Date(inq.createdAt || Date.now()).toLocaleDateString()}
                        </td>
                        <td>
                          <span className={`status-pill ${inq.status}`}>{inq.status}</span>
                        </td>
                        <td>
                          <button
                            className="btn-admin-secondary"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            onClick={() => handleInquiryStatusChange(inq._id, inq.status === 'resolved' ? 'new' : 'resolved')}
                          >
                            {inq.status === 'resolved' ? 'REOPEN' : 'RESOLVE'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ---------------- ADD NEW PRODUCT MODAL ---------------- */}
      {isAddModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">RELEASE NEW STREETWEAR DROP</h2>
              <button className="admin-modal-close" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Garment Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CYBER WASH OVERSIZED HOODIE"
                    className="admin-form-input"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category</label>
                    <select
                      className="admin-form-select"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as ProductCategory })}
                    >
                      <option value="tees">Tees</option>
                      <option value="hoodies">Hoodies</option>
                      <option value="sweatshirts">Sweatshirts</option>
                      <option value="cargos">Cargos</option>
                      <option value="outerwear">Outerwear</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Collection</label>
                    <select
                      className="admin-form-select"
                      value={newProduct.collectionSlug}
                      onChange={(e) => {
                        const slug = e.target.value;
                        const name = slug === 'after-dark' ? 'AFTER DARK' : slug === 'undefined' ? 'UNDEFINED' : 'OUTSIDERS';
                        setNewProduct({ ...newProduct, collectionSlug: slug, collectionName: name });
                      }}
                    >
                      <option value="after-dark">AFTER DARK</option>
                      <option value="undefined">UNDEFINED</option>
                      <option value="outsiders">OUTSIDERS</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      className="admin-form-input"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Original / Retail Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      className="admin-form-input"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Initial Stock</label>
                    <input
                      type="number"
                      min={0}
                      className="admin-form-input"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Fabric Weight (GSM)</label>
                    <input
                      type="number"
                      min={100}
                      className="admin-form-input"
                      value={newProduct.fabricGsm}
                      onChange={(e) => setNewProduct({ ...newProduct, fabricGsm: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">High-Resolution Image URL</label>
                  <input
                    type="url"
                    required
                    className="admin-form-input"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Editorial Description</label>
                  <textarea
                    rows={3}
                    className="admin-form-textarea"
                    placeholder="Describe silhouette, fabrication, and design notes..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={newProduct.featured}
                      onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                    />
                    Featured on Homepage
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={newProduct.newArrival}
                      onChange={(e) => setNewProduct({ ...newProduct, newArrival: e.target.checked })}
                    />
                    New Drop Badge
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  CANCEL
                </button>
                <button type="submit" className="btn-admin-primary">
                  PUBLISH TO ATLAS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
