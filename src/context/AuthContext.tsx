import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Order, ShippingAddress } from '../types/order';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  orders: Order[];
  login: (email: string, name?: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
  addOrder: (order: Order) => void;
  updateAddress: (address: ShippingAddress) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'don_streetwear_user';
const ORDERS_STORAGE_KEY = 'don_streetwear_orders';

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-8831',
    orderNumber: 'DON-2026-8831',
    createdAt: '2026-03-01T14:20:00Z',
    status: 'delivered',
    trackingNumber: 'BLUEDART-88219318',
    carrier: 'BlueDart Air Express',
    items: [],
    subtotal: 5498,
    discount: 0,
    shippingFee: 0,
    total: 5498,
    shippingAddress: {
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
    paymentMethod: 'upi',
    paymentStatus: 'paid',
  },
];

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

  const login = (email: string, name?: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0].toUpperCase(),
      email,
      memberTier: 'INNER CIRCLE',
      joinedDate: new Date().toISOString().split('T')[0],
      savedAddresses: [],
    };
    setUser(newUser);
    showToast('AUTHENTICATED', `Welcome back, ${newUser.name}`, 'success');
  };

  const register = (name: string, email: string) => {
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
    setUser(null);
    showToast('SIGNED OUT', 'Session terminated', 'info');
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateAddress = (address: ShippingAddress) => {
    if (!user) return;
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
