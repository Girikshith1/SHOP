export type ProductCategory =
  | 'tees'
  | 'hoodies'
  | 'sweatshirts'
  | 'cargos'
  | 'outerwear'
  | 'accessories';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  editorialNote: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  categoryName: string;
  collection: string;
  collectionSlug: string;
  images: string[];
  sizes: ProductSize[];
  colors: {
    name: string;
    hex: string;
  }[];
  fabricGsm: number;
  composition: string;
  fit: string;
  modelInfo: string;
  stock: number;
  featured: boolean;
  newArrival: boolean;
  limitedEdition: boolean;
  dropNumber?: string;
  tags: string[];
}

export interface Collection {
  id: string;
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

export interface LookbookLook {
  id: string;
  title: string;
  image: string;
  editorialCaption: string;
  items: {
    productId: string;
    name: string;
    price: number;
    posX: number; // percentage coordinates for interactive hotspots
    posY: number;
  }[];
}
