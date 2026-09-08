import mongoose, { Document, Schema, Model } from 'mongoose';
import { IShippingAddress } from './User.js';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: any;
  image: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  guestEmail?: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber: string;
  carrier: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  shippingAddress: IShippingAddress;
  paymentMethod: 'upi' | 'card' | 'razorpay' | 'cod';
  paymentStatus: 'paid' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema(
  {
    productId: { type: String, default: '' },
    name: { type: String, default: 'Streetwear Item' },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 1, min: 1 },
    size: { type: String, default: 'M' },
    color: { type: Schema.Types.Mixed, default: 'Obsidian Black' },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    guestEmail: { type: String, lowercase: true },
    status: {
      type: String,
      enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'confirmed',
      index: true,
    },
    trackingNumber: { type: String, default: '' },
    carrier: { type: String, default: 'BlueDart Air Express' },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'razorpay', 'cod'],
      default: 'upi',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending'],
      default: 'paid',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
