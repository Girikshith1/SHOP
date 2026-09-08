import { Request, Response } from 'express';
import { Product } from '../models/Product.js';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, collection, featured, newArrival, search, sort, limit, page } = req.query;

    const filter: Record<string, any> = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (collection && collection !== 'all') {
      filter.collectionSlug = collection;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (newArrival === 'true') {
      filter.newArrival = true;
    }

    if (search && typeof search === 'string' && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } },
      ];
    }

    let query = Product.find(filter);

    // Sorting
    switch (sort) {
      case 'price-low':
        query = query.sort({ price: 1 });
        break;
      case 'price-high':
        query = query.sort({ price: -1 });
        break;
      case 'newest':
        query = query.sort({ createdAt: -1 });
        break;
      default:
        query = query.sort({ createdAt: -1 });
    }

    // Pagination
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      query.skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      products: products.map((p) => p.toJSON()),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: error.message || 'Server error fetching products' });
  }
};

export const getProductBySlugOrId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;

    let product = null;

    // Try finding by slug first
    product = await Product.findOne({ slug: identifier.toLowerCase() });

    // Fallback: try finding by ObjectId if valid
    if (!product && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier);
    }

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({ product: product.toJSON() });
  } catch (error: any) {
    console.error('Error in getProductBySlugOrId:', error);
    res.status(500).json({ message: error.message || 'Server error fetching product' });
  }
};

export const getFeaturedProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.status(200).json({ products: products.map((p) => p.toJSON()) });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching featured products' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;
    if (!productData.name || !productData.price || !productData.category) {
      res.status(400).json({ message: 'Name, price, and category are required' });
      return;
    }

    if (!productData.slug) {
      productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const product = await Product.create(productData);
    res.status(201).json({ product: product.toJSON(), message: 'Product created successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    }
    if (!product) {
      product = await Product.findOneAndUpdate({ slug: id.toLowerCase() }, updateData, { new: true });
    }

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({ product: product.toJSON(), message: 'Product updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findByIdAndDelete(id);
    }
    if (!product) {
      product = await Product.findOneAndDelete({ slug: id.toLowerCase() });
    }

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error deleting product' });
  }
};

