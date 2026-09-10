export interface FallbackOrder {
  id: string;
  orderNumber: string;
  user?: string;
  guestEmail?: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber: string;
  carrier: string;
  items: any[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  shippingAddress: any;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface FallbackInquiry {
  id: string;
  name: string;
  email: string;
  subject?: string;
  orderNumber?: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: string;
}

class FallbackStore {
  private orders: FallbackOrder[] = [];
  private inquiries: FallbackInquiry[] = [];

  public addOrder(orderData: Partial<FallbackOrder>): FallbackOrder {
    const id = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const order: FallbackOrder = {
      id,
      orderNumber: orderData.orderNumber || `DON-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      user: orderData.user,
      guestEmail: orderData.guestEmail || orderData.shippingAddress?.email,
      status: orderData.status || 'confirmed',
      trackingNumber: orderData.trackingNumber || `BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}`,
      carrier: orderData.carrier || 'BlueDart Air Express',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      shippingFee: orderData.shippingFee || 0,
      total: orderData.total || 0,
      shippingAddress: orderData.shippingAddress || {},
      paymentMethod: orderData.paymentMethod || 'upi',
      paymentStatus: orderData.paymentStatus || 'paid',
      createdAt: now,
      updatedAt: now,
    };
    this.orders.unshift(order);
    return order;
  }

  public getOrders(): FallbackOrder[] {
    return this.orders;
  }

  public getOrderByIdOrNumber(identifier: string): FallbackOrder | undefined {
    const target = identifier.toLowerCase();
    return this.orders.find(
      (o) => o.id.toLowerCase() === target || o.orderNumber.toLowerCase() === target
    );
  }

  public updateOrderStatus(
    identifier: string,
    status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
    carrier?: string,
    trackingNumber?: string
  ): FallbackOrder | null {
    const order = this.getOrderByIdOrNumber(identifier);
    if (!order) return null;
    order.status = status;
    if (carrier !== undefined) order.carrier = carrier;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  public deleteOrder(identifier: string): boolean {
    const initialLen = this.orders.length;
    const target = identifier.toLowerCase();
    this.orders = this.orders.filter(
      (o) => o.id.toLowerCase() !== target && o.orderNumber.toLowerCase() !== target
    );
    return this.orders.length < initialLen;
  }

  public clearOrders(): void {
    this.orders = [];
  }

  public addInquiry(inquiryData: Partial<FallbackInquiry>): FallbackInquiry {
    const inquiry: FallbackInquiry = {
      id: `inq-${Date.now()}`,
      name: inquiryData.name || 'Anonymous',
      email: inquiryData.email || '',
      subject: inquiryData.subject || 'General Inquiry',
      orderNumber: inquiryData.orderNumber,
      message: inquiryData.message || '',
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    this.inquiries.unshift(inquiry);
    return inquiry;
  }

  public getInquiries(): FallbackInquiry[] {
    return this.inquiries;
  }

  public updateInquiryStatus(id: string, status: 'new' | 'read' | 'resolved'): FallbackInquiry | null {
    const inq = this.inquiries.find((i) => i.id === id);
    if (!inq) return null;
    inq.status = status;
    return inq;
  }
}

export const fallbackStore = new FallbackStore();
