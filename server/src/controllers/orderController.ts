import { Response } from 'express';
import { Order, IOrderItem } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const generateOrderNumber = (): string => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `DON-2026-${random}`;
};

const generateTrackingNumber = (): string => {
  const random = Math.floor(10000000 + Math.random() * 90000000);
  return `BLUEDART-${random}`;
};

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      items,
      subtotal,
      discount = 0,
      shippingFee = 0,
      total,
      shippingAddress,
      paymentMethod = 'upi',
      paymentStatus = 'paid',
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Order must contain at least one item' });
      return;
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.pincode) {
      res.status(400).json({ message: 'Valid shipping address is required' });
      return;
    }

    const orderNumber = generateOrderNumber();
    const trackingNumber = generateTrackingNumber();

    // Map order items from cart format
    const orderItems: IOrderItem[] = items.map((item: any) => {
      let colorVal = item.color;
      if (typeof colorVal === 'string') {
        colorVal = { name: colorVal, hex: '#191919' };
      } else if (!colorVal || typeof colorVal !== 'object') {
        colorVal = { name: 'Obsidian Black', hex: '#191919' };
      }

      return {
        productId: (item.product && (item.product.id || item.product._id)) || item.productId || item.id || '',
        name: (item.product && item.product.name) || item.name || 'Streetwear Item',
        price: (item.product && item.product.price) !== undefined ? item.product.price : (item.price || 0),
        quantity: Number(item.quantity) || 1,
        size: item.size || 'M',
        color: colorVal,
        image: (item.product && item.product.images && item.product.images[0]) || item.image || '',
      };
    });

    const calculatedTotal = total || (subtotal - discount + shippingFee);

    const order = await Order.create({
      orderNumber,
      user: req.user ? req.user._id : undefined,
      guestEmail: req.user ? req.user.email : shippingAddress.email,
      status: 'confirmed',
      trackingNumber,
      carrier: 'BlueDart Air Express',
      items: orderItems,
      subtotal: subtotal || calculatedTotal,
      discount,
      shippingFee,
      total: calculatedTotal,
      shippingAddress,
      paymentMethod,
      paymentStatus,
    });

    // Proactively adjust stock if product exists
    for (const item of orderItems) {
      if (item.productId) {
        try {
          if (item.productId.match(/^[0-9a-fA-F]{24}$/)) {
            await Product.findByIdAndUpdate(item.productId, {
              $inc: { stock: -item.quantity },
            });
          } else {
            await Product.findOneAndUpdate(
              { slug: item.productId },
              { $inc: { stock: -item.quantity } }
            );
          }
        } catch {
          // Non-blocking stock sync
        }
      }
    }

    res.status(201).json({
      order: order.toJSON(),
      message: 'Order created successfully',
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message || 'Server error creating order' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const orders = await Order.find({
      $or: [{ user: req.user._id }, { guestEmail: req.user.email.toLowerCase() }],
    }).sort({ createdAt: -1 });

    res.status(200).json({ orders: orders.map((o) => o.toJSON()) });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message || 'Server error fetching orders' });
  }
};

export const getOrderByIdOrNumber = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;

    let order = await Order.findOne({ orderNumber: identifier.toUpperCase() });

    if (!order && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(identifier);
    }

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json({ order: order.toJSON() });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
