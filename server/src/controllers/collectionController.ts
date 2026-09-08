import { Request, Response } from 'express';
import { Collection } from '../models/Collection.js';
import { Product } from '../models/Product.js';

export const getCollections = async (_req: Request, res: Response): Promise<void> => {
  try {
    const collections = await Collection.find().sort({ year: -1, createdAt: -1 });
    res.status(200).json({ collections: collections.map((c) => c.toJSON()) });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching collections' });
  }
};

export const getCollectionBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const collection = await Collection.findOne({ slug: slug.toLowerCase() });

    if (!collection) {
      res.status(404).json({ message: 'Collection not found' });
      return;
    }

    const products = await Product.find({ collectionSlug: slug.toLowerCase() });

    res.status(200).json({
      collection: collection.toJSON(),
      products: products.map((p) => p.toJSON()),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching collection' });
  }
};
