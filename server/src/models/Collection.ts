import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICollection extends Document {
  slug: string;
  title: string;
  subtitle: string;
  statement: string;
  description: string;
  editorialImage: string;
  heroImage: string;
  season: string;
  year: string;
  accentColor?: string;
  productsCount: number;
}

const CollectionSchema = new Schema<ICollection>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    statement: { type: String, default: '' },
    description: { type: String, default: '' },
    editorialImage: { type: String, required: true },
    heroImage: { type: String, required: true },
    season: { type: String, default: 'FALL/WINTER' },
    year: { type: String, default: '2026' },
    accentColor: { type: String },
    productsCount: { type: Number, default: 0 },
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

export const Collection: Model<ICollection> =
  mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);
