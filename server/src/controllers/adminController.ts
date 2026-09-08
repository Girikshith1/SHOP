import { Request, Response } from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { ContactMessage } from '../models/ContactMessage.js';

export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [orders, products, users, inquiries] = await Promise.all([
      Order.find().sort({ createdAt: -1 }),
      Product.find(),
      User.countDocuments(),
      ContactMessage.find().sort({ createdAt: -1 }),
    ]);

    // Calculate metrics
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, o) => acc + (o.total || 0), 0);

    const pendingOrders = orders.filter((o) =>
      ['confirmed', 'processing'].includes(o.status)
    ).length;

    const shippedOrders = orders.filter((o) => o.status === 'shipped').length;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const lowStockCount = products.filter((p) => p.stock < 10).length;

    const newInquiries = inquiries.filter((i) => i.status === 'new').length;

    res.status(200).json({
      revenue: totalRevenue,
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      totalProducts: products.length,
      totalStock,
      lowStockCount,
      totalUsers: users,
      newInquiries,
      recentOrders: orders.slice(0, 5).map((o) => o.toJSON()),
      recentInquiries: inquiries.slice(0, 5),
    });
  } catch (error: any) {
    console.error('Error in getAdminStats:', error);
    res.status(500).json({ message: error.message || 'Server error fetching stats' });
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;

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

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      orders: orders.map((o) => o.toJSON()),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    console.error('Error in getAllOrders:', error);
    res.status(500).json({ message: error.message || 'Server error fetching orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, carrier, trackingNumber } = req.body;

    let order = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id.toUpperCase() });
    }

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (status) {
      order.status = status;
    }
    if (carrier !== undefined) {
      order.carrier = carrier;
    }
    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();
    res.status(200).json({
      order: order.toJSON(),
      message: `Order status updated to ${order.status}`,
    });
  } catch (error: any) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ message: error.message || 'Server error updating order' });
  }
};

export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: Record<string, any> = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const inquiries = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ inquiries });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching inquiries' });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      res.status(404).json({ message: 'Inquiry not found' });
      return;
    }

    res.status(200).json({ inquiry, message: 'Inquiry status updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error updating inquiry' });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let order = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findByIdAndDelete(id);
    }
    if (!order) {
      order = await Order.findOneAndDelete({ orderNumber: id.toUpperCase() });
    }

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error deleting order' });
  }
};

export const clearAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await Order.deleteMany({});
    res.status(200).json({ message: `Cleared ${result.deletedCount} orders` });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error clearing orders' });
  }
};
