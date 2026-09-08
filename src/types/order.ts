import { CartItem } from './cart';

export type PaymentMethod = 'upi' | 'card' | 'razorpay' | 'cod';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber: string;
  carrier: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  memberTier: 'INNER CIRCLE' | 'STANDARD';
  savedAddresses: ShippingAddress[];
  joinedDate: string;
}
