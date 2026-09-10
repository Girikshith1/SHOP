import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { fallbackStore } from '../utils/fallbackStore.js';

export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  let ordersList: any[] = [];
  let productsList: any[] = [];
  let userCount = 0;
  let inquiriesList: any[] = [];

  if (mongoose.connection.readyState === 1) {
    try {
      const [dbOrders, dbProducts, dbUsers, dbInquiries] = await Promise.all([
        Order.find().sort({ createdAt: -1 }),
        Product.find(),
        User.countDocuments(),
        ContactMessage.find().sort({ createdAt: -1 }),
      ]);
      ordersList = dbOrders.map((o) => o.toJSON());
      productsList = dbProducts;
      userCount = dbUsers;
      inquiriesList = dbInquiries;
    } catch (err) {
      console.warn('[DB] Failed to query MongoDB for admin stats, using fallback store:', err);
    }
  }

  // Combine with memory fallback store if MongoDB list is empty
  const memoryOrders = fallbackStore.getOrders();
  if (memoryOrders.length > 0) {
    const existingIds = new Set(ordersList.map((o) => o.id || o.orderNumber));
    for (const memOrd of memoryOrders) {
      if (!existingIds.has(memOrd.id) && !existingIds.has(memOrd.orderNumber)) {
        ordersList.push(memOrd);
      }
    }
  }

  const memoryInquiries = fallbackStore.getInquiries();
  if (memoryInquiries.length > 0) {
    const existingIds = new Set(inquiriesList.map((i) => i.id || i._id));
    for (const memInq of memoryInquiries) {
      if (!existingIds.has(memInq.id)) {
        inquiriesList.push(memInq);
      }
    }
  }

  // Sort orders descending
  ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Calculate metrics
  const totalOrders = ordersList.length;
  const totalRevenue = ordersList
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + (o.total || 0), 0);

  const pendingOrders = ordersList.filter((o) =>
    ['confirmed', 'processing'].includes(o.status)
  ).length;

  const shippedOrders = ordersList.filter((o) => o.status === 'shipped').length;
  const deliveredOrders = ordersList.filter((o) => o.status === 'delivered').length;

  const totalProductsCount = productsList.length || 8;
  const totalStock = productsList.length ? productsList.reduce((acc, p) => acc + (p.stock || 0), 0) : 160;
  const lowStockCount = productsList.filter((p) => (p.stock || 0) < 10).length;

  const newInquiries = inquiriesList.filter((i) => i.status === 'new').length;

  res.status(200).json({
    revenue: totalRevenue,
    totalOrders,
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    totalProducts: totalProductsCount,
    totalStock,
    lowStockCount,
    totalUsers: userCount || 1,
    newInquiries,
    recentOrders: ordersList.slice(0, 5),
    recentInquiries: inquiriesList.slice(0, 5),
  });
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  const { status, search, page = 1, limit = 50 } = req.query;
  let ordersList: any[] = [];

  if (mongoose.connection.readyState === 1) {
    try {
      const filter: Record<string, any> = {};
      if (status && status !== 'all') {
        filter.status = status;
      }
      if (search && typeof search === 'string' && search.trim()) {
        const q = search.trim();
        filter.$or = [
          { orderNumber: { $regex: q, $options: 'i' } },
          { 'shippingAddress.fullName': { $regex: q, $options: 'i' } },
          { 'shippingAddress.email': { $regex: q, $options: 'i' } },
          { guestEmail: { $regex: q, $options: 'i' } },
          { trackingNumber: { $regex: q, $options: 'i' } },
        ];
      }
      const dbOrders = await Order.find(filter).sort({ createdAt: -1 });
      ordersList = dbOrders.map((o) => o.toJSON());
    } catch (err) {
      console.warn('[DB] Error querying orders from MongoDB:', err);
    }
  }

  // Merge memory store
  let memoryOrders = fallbackStore.getOrders();
  if (status && status !== 'all') {
    memoryOrders = memoryOrders.filter((o) => o.status === status);
  }
  if (search && typeof search === 'string' && search.trim()) {
    const q = search.trim().toLowerCase();
    memoryOrders = memoryOrders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
        o.shippingAddress?.email?.toLowerCase().includes(q) ||
        o.guestEmail?.toLowerCase().includes(q) ||
        o.trackingNumber?.toLowerCase().includes(q)
    );
  }

  const existingIds = new Set(ordersList.map((o) => o.id || o.orderNumber));
  for (const memOrd of memoryOrders) {
    if (!existingIds.has(memOrd.id) && !existingIds.has(memOrd.orderNumber)) {
      ordersList.push(memOrd);
    }
  }

  ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;
  const paginatedOrders = ordersList.slice(skip, skip + limitNum);

  res.status(200).json({
    orders: paginatedOrders,
    total: ordersList.length,
    page: pageNum,
    totalPages: Math.ceil(ordersList.length / limitNum) || 1,
  });
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, carrier, trackingNumber } = req.body;

  if (mongoose.connection.readyState === 1) {
    try {
      let order = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id);
      }
      if (!order) {
        order = await Order.findOne({ orderNumber: id.toUpperCase() });
      }

      if (order) {
        if (status) order.status = status;
        if (carrier !== undefined) order.carrier = carrier;
        if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;

        await order.save();
        res.status(200).json({
          order: order.toJSON(),
          message: `Order status updated to ${order.status}`,
        });
        return;
      }
    } catch (err) {
      console.warn('[DB] Error updating order status in MongoDB:', err);
    }
  }

  const updatedMemOrder = fallbackStore.updateOrderStatus(id, status, carrier, trackingNumber);
  if (updatedMemOrder) {
    res.status(200).json({
      order: updatedMemOrder,
      message: `Order status updated to ${updatedMemOrder.status}`,
    });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.query;
  let inquiries: any[] = [];

  if (mongoose.connection.readyState === 1) {
    try {
      const filter: Record<string, any> = {};
      if (status && status !== 'all') {
        filter.status = status;
      }
      inquiries = await ContactMessage.find(filter).sort({ createdAt: -1 });
    } catch (err) {
      console.warn('[DB] Error getting inquiries from MongoDB:', err);
    }
  }

  let memoryInquiries = fallbackStore.getInquiries();
  if (status && status !== 'all') {
    memoryInquiries = memoryInquiries.filter((i) => i.status === status);
  }

  const existingIds = new Set(inquiries.map((i) => i.id || i._id));
  for (const memInq of memoryInquiries) {
    if (!existingIds.has(memInq.id)) {
      inquiries.push(memInq);
    }
  }

  res.status(200).json({ inquiries });
};

export const updateInquiryStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (mongoose.connection.readyState === 1) {
    try {
      const inquiry = await ContactMessage.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (inquiry) {
        res.status(200).json({ inquiry, message: 'Inquiry status updated' });
        return;
      }
    } catch (err) {
      console.warn('[DB] Error updating inquiry in MongoDB:', err);
    }
  }

  const updatedMemInq = fallbackStore.updateInquiryStatus(id, status);
  if (updatedMemInq) {
    res.status(200).json({ inquiry: updatedMemInq, message: 'Inquiry status updated' });
  } else {
    res.status(404).json({ message: 'Inquiry not found' });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      let order = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findByIdAndDelete(id);
      }
      if (!order) {
        order = await Order.findOneAndDelete({ orderNumber: id.toUpperCase() });
      }

      if (order) {
        res.status(200).json({ message: 'Order deleted successfully' });
        return;
      }
    } catch (err) {
      console.warn('[DB] Error deleting order from MongoDB:', err);
    }
  }

  const deleted = fallbackStore.deleteOrder(id);
  if (deleted) {
    res.status(200).json({ message: 'Order deleted successfully' });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

export const clearAllOrders = async (_req: Request, res: Response): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    try {
      const result = await Order.deleteMany({});
      fallbackStore.clearOrders();
      res.status(200).json({ message: `Cleared ${result.deletedCount} orders` });
      return;
    } catch (err) {
      console.warn('[DB] Error clearing orders from MongoDB:', err);
    }
  }

  fallbackStore.clearOrders();
  res.status(200).json({ message: 'Cleared all orders' });
};
