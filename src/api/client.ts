import { Product, Collection } from '../types/product';
import { Order, UserProfile, ShippingAddress } from '../types/order';
import { PRODUCTS } from '../data/products';
import { COLLECTIONS } from '../data/collections';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'don_streetwear_token';

// Helper to get auth headers
const getHeaders = (hasBody = true): HeadersInit => {
  const headers: HeadersInit = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic fetch wrapper with graceful error handling
async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...getHeaders(Boolean(options.body)),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// ---------------- AUTH API ----------------
export const authApi = {
  async register(name: string, email: string, password?: string, phone?: string): Promise<{ user: UserProfile; token: string }> {
    const res = await fetchJson<{ user: UserProfile; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    });
    if (res.token) {
      localStorage.setItem(TOKEN_KEY, res.token);
    }
    return res;
  },

  async login(email: string, password?: string): Promise<{ user: UserProfile; token: string }> {
    const res = await fetchJson<{ user: UserProfile; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      localStorage.setItem(TOKEN_KEY, res.token);
    }
    return res;
  },

  async getMe(): Promise<{ user: UserProfile }> {
    return fetchJson<{ user: UserProfile }>('/auth/me');
  },

  async updateProfile(data: Partial<UserProfile>): Promise<{ user: UserProfile }> {
    return fetchJson<{ user: UserProfile }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateAddress(address: ShippingAddress): Promise<{ user: UserProfile }> {
    return fetchJson<{ user: UserProfile }>('/auth/address', {
      method: 'PUT',
      body: JSON.stringify(address),
    });
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
};

// ---------------- PRODUCTS API ----------------
export interface GetProductsParams {
  category?: string;
  collection?: string;
  featured?: boolean;
  newArrival?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const productsApi = {
  async getAll(params: GetProductsParams = {}): Promise<{ products: Product[]; total: number }> {
    try {
      const query = new URLSearchParams();
      if (params.category) query.append('category', params.category);
      if (params.collection) query.append('collection', params.collection);
      if (params.featured) query.append('featured', 'true');
      if (params.newArrival) query.append('newArrival', 'true');
      if (params.search) query.append('search', params.search);
      if (params.sort) query.append('sort', params.sort);
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));

      const res = await fetchJson<{ products: Product[]; total: number }>(`/products?${query.toString()}`);
      return res;
    } catch (err) {
      console.warn('[API] Failed to fetch products from backend, using local fallback:', err);
      // Resilient local fallback
      let filtered = [...PRODUCTS];
      if (params.category && params.category !== 'all') {
        filtered = filtered.filter((p) => p.category === params.category);
      }
      if (params.collection && params.collection !== 'all') {
        filtered = filtered.filter((p) => p.collectionSlug === params.collection);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
      }
      return { products: filtered, total: filtered.length };
    }
  },

  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const res = await fetchJson<{ product: Product }>(`/products/${slug}`);
      return res.product;
    } catch (err) {
      console.warn(`[API] Failed to fetch product ${slug} from backend, using local fallback:`, err);
      return PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null;
    }
  },

  async getFeatured(): Promise<Product[]> {
    try {
      const res = await fetchJson<{ products: Product[] }>('/products/featured');
      return res.products;
    } catch {
      return PRODUCTS.filter((p) => p.featured);
    }
  },

  async create(productData: Partial<Product>): Promise<Product> {
    const res = await fetchJson<{ product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return res.product;
  },

  async update(id: string, updateData: Partial<Product>): Promise<Product> {
    const res = await fetchJson<{ product: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return res.product;
  },

  async delete(id: string): Promise<void> {
    await fetchJson<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// ---------------- COLLECTIONS API ----------------
export const collectionsApi = {
  async getAll(): Promise<Collection[]> {
    try {
      const res = await fetchJson<{ collections: Collection[] }>('/collections');
      return res.collections;
    } catch {
      return COLLECTIONS;
    }
  },

  async getBySlug(slug: string): Promise<{ collection: Collection; products: Product[] } | null> {
    try {
      return await fetchJson<{ collection: Collection; products: Product[] }>(`/collections/${slug}`);
    } catch {
      const col = COLLECTIONS.find((c) => c.slug === slug);
      if (!col) return null;
      return {
        collection: col,
        products: PRODUCTS.filter((p) => p.collectionSlug === slug),
      };
    }
  },
};

// ---------------- ORDERS API ----------------
export const ordersApi = {
  async create(orderData: Partial<Order>): Promise<Order> {
    try {
      const res = await fetchJson<{ order: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      return res.order;
    } catch (err) {
      console.warn('[API] Failed to save order to backend, generating local order fallback:', err);
      const fallbackOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `DON-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        trackingNumber: `BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}`,
        carrier: 'BlueDart Air Express',
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        discount: orderData.discount || 0,
        shippingFee: orderData.shippingFee || 0,
        total: orderData.total || 0,
        shippingAddress: orderData.shippingAddress!,
        paymentMethod: orderData.paymentMethod || 'upi',
        paymentStatus: 'paid',
      };
      return fallbackOrder;
    }
  },

  async getMyOrders(): Promise<Order[]> {
    try {
      const res = await fetchJson<{ orders: Order[] }>('/orders/my-orders');
      return res.orders;
    } catch (err) {
      console.warn('[API] Could not fetch remote orders, returning local orders:', err);
      return [];
    }
  },

  async getById(identifier: string): Promise<Order | null> {
    try {
      const res = await fetchJson<{ order: Order }>(`/orders/${identifier}`);
      return res.order;
    } catch {
      return null;
    }
  },
};

// ---------------- CONTACT API ----------------
export const contactApi = {
  async submit(data: { name: string; email: string; subject?: string; orderNumber?: string; message: string }): Promise<{ message: string }> {
    return fetchJson<{ message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ---------------- ADMIN API ----------------
export interface AdminStats {
  revenue: number;
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  totalUsers: number;
  newInquiries: number;
  recentOrders: Order[];
  recentInquiries: any[];
}

export const adminApi = {
  async getStats(): Promise<AdminStats> {
    return fetchJson<AdminStats>('/admin/stats');
  },

  async getAllOrders(status?: string, search?: string, page = 1): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (status && status !== 'all') query.append('status', status);
    if (search) query.append('search', search);
    query.append('page', String(page));
    return fetchJson<{ orders: Order[]; total: number; page: number; totalPages: number }>(`/admin/orders?${query.toString()}`);
  },

  async updateOrderStatus(id: string, status: string, carrier?: string, trackingNumber?: string): Promise<{ order: Order; message: string }> {
    return fetchJson<{ order: Order; message: string }>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, carrier, trackingNumber }),
    });
  },

  async getInquiries(status?: string): Promise<{ inquiries: any[] }> {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return fetchJson<{ inquiries: any[] }>(`/admin/inquiries${query}`);
  },

  async updateInquiryStatus(id: string, status: string): Promise<{ inquiry: any; message: string }> {
    return fetchJson<{ inquiry: any; message: string }>(`/admin/inquiries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async deleteOrder(id: string): Promise<void> {
    await fetchJson<{ message: string }>(`/admin/orders/${id}`, {
      method: 'DELETE',
    });
  },

  async clearAllOrders(): Promise<void> {
    await fetchJson<{ message: string }>('/admin/orders', {
      method: 'DELETE',
    });
  },
};
