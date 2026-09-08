import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Order, ShippingAddress } from '../types/order';
import { useToast } from './ToastContext';
import { authApi, ordersApi } from '../api/client';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  orders: Order[];
  login: (email: string, passwordOrName?: string, maybeName?: string) => Promise<void> | void;
  register: (name: string, email: string, password?: string) => Promise<void> | void;
  logout: () => void;
  addOrder: (order: Order) => void;
  updateAddress: (address: ShippingAddress) => Promise<void> | void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'don_streetwear_user';
const ORDERS_STORAGE_KEY = 'don_streetwear_orders';

const DEFAULT_ORDERS: Order[] = [];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            id: 'usr-default',
            name: 'Aarav Sharma',
            email: 'aarav.sharma@example.com',
            phone: '+91 98200 88310',
            memberTier: 'INNER CIRCLE',
            joinedDate: '2026-01-15',
            savedAddresses: [
              {
                fullName: 'Aarav Sharma',
                phone: '+91 98200 88310',
                email: 'aarav.sharma@example.com',
                addressLine1: 'Flat 402, Highline Residency',
                addressLine2: 'Bandra West',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400050',
                country: 'India',
              },
            ],
          };
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  // Sync with backend on mount
  useEffect(() => {
    const syncBackend = async () => {
      const token = authApi.getToken();
      if (token) {
        try {
          const profile = await authApi.getMe();
          if (profile?.user) {
            setUser(profile.user);
          }
          const remoteOrders = await ordersApi.getMyOrders();
          if (remoteOrders && remoteOrders.length > 0) {
            setOrders(remoteOrders);
          }
        } catch {
          // Keep local fallback
        }
      }
    };
    syncBackend();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const login = async (email: string, passwordOrName?: string, maybeName?: string) => {
    try {
      const res = await authApi.login(email, passwordOrName || 'streetwear123');
      if (res?.user) {
        setUser(res.user);
        showToast('AUTHENTICATED', `Welcome back, ${res.user.name}`, 'success');
        const remoteOrders = await ordersApi.getMyOrders();
        if (remoteOrders && remoteOrders.length > 0) {
          setOrders(remoteOrders);
        }
        return;
      }
    } catch {
      // Offline fallback
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: maybeName || passwordOrName || email.split('@')[0].toUpperCase(),
      email,
      memberTier: 'INNER CIRCLE',
      joinedDate: new Date().toISOString().split('T')[0],
      savedAddresses: [],
    };
    setUser(newUser);
    showToast('AUTHENTICATED', `Welcome back, ${newUser.name}`, 'success');
  };

  const register = async (name: string, email: string, password?: string) => {
    try {
      const res = await authApi.register(name, email, password || 'streetwear123');
      if (res?.user) {
        setUser(res.user);
        showToast('WELCOME TO INNER CIRCLE', 'Account registered with VIP access', 'success');
        return;
      }
    } catch {
      // Offline fallback
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      memberTier: 'INNER CIRCLE',
      joinedDate: new Date().toISOString().split('T')[0],
      savedAddresses: [],
    };
    setUser(newUser);
    showToast('WELCOME TO INNER CIRCLE', 'Account registered with VIP access', 'success');
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    showToast('SIGNED OUT', 'Session terminated', 'info');
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateAddress = async (address: ShippingAddress) => {
    if (!user) return;
    try {
      const res = await authApi.updateAddress(address);
      if (res?.user) {
        setUser(res.user);
        return;
      }
    } catch {
      // Offline fallback
    }

    setUser((prev) =>
      prev
        ? {
            ...prev,
            savedAddresses: [address, ...prev.savedAddresses.filter((a) => a.addressLine1 !== address.addressLine1)],
          }
        : null
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        orders,
        login,
        register,
        logout,
        addOrder,
        updateAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
