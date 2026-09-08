import mongoose, { Document, Schema, Model } from 'mongoose';

export type ProductCategory =
  | 'tees'
  | 'hoodies'
  | 'sweatshirts'
  | 'cargos'
  | 'outerwear'
  | 'accessories';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface IProductColor {
  name: string;
  hex: string;
}

export interface IProduct extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  editorialNote?: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  categoryName: string;
  collectionName: string;
  collectionSlug: string;
  images: string[];
  sizes: ProductSize[];
  colors: IProductColor[];
  fabricGsm?: number;
  composition?: string;
  fit?: string;
  modelInfo?: string;
  stock: number;
  featured: boolean;
  newArrival: boolean;
  limitedEdition: boolean;
  dropNumber?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductColorSchema = new Schema<IProductColor>(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    editorialNote: { type: String },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['tees', 'hoodies', 'sweatshirts', 'cargos', 'outerwear', 'accessories'],
      index: true,
    },
    categoryName: { type: String, required: true },
    collectionName: { type: String, default: 'AFTER DARK' },
    collectionSlug: { type: String, default: 'after-dark', index: true },
    images: [{ type: String }],
    sizes: [
      {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
    colors: [ProductColorSchema],
    fabricGsm: { type: Number },
    composition: { type: String },
    fit: { type: String },
    modelInfo: { type: String },
    stock: { type: Number, required: true, default: 10, min: 0 },
    featured: { type: Boolean, default: false, index: true },
    newArrival: { type: Boolean, default: false, index: true },
    limitedEdition: { type: Boolean, default: false },
    dropNumber: { type: String },
    tags: [{ type: String, index: true }],
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id?.toString();
        ret.collection = ret.collectionName;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Add text index for search queries
ProductSchema.index({ name: 'text', description: 'text', tags: 'text', categoryName: 'text' });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
