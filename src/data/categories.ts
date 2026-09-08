export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  count: number;
  image: string;
  description: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-tees',
    slug: 'tees',
    name: 'OVERSIZED TEES',
    subtitle: '280 GSM HEAVYWEIGHT FOUNDATION',
    count: 14,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    description: 'Cut with broad dropped shoulders, thick ribbed collars, and boxy drape. Engineered to retain geometry wash after wash.',
  },
  {
    id: 'cat-hoodies',
    slug: 'hoodies',
    name: 'HOODIES',
    subtitle: '460 GSM LOOPBACK FRENCH TERRY',
    count: 9,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    description: 'Double-layered structured hoods with zero drawstrings. Monumental silhouettes engineered for cold concrete nights.',
  },
  {
    id: 'cat-sweatshirts',
    slug: 'sweatshirts',
    name: 'SWEATSHIRTS',
    subtitle: 'MONOLITHIC RELAXED PULLOVERS',
    count: 7,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
    description: 'Acid-washed tones, blind-stitched seams, and dropped proportions. Understated luxury that speaks through volume.',
  },
  {
    id: 'cat-cargos',
    slug: 'cargos',
    name: 'CARGOS',
    subtitle: 'TACTICAL ARTICULATED BOTTOMS',
    count: 8,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
    description: 'Engineered Japanese ripstop with magnetic closures and convertible ankle cinches for versatile footwear stacking.',
  },
  {
    id: 'cat-outerwear',
    slug: 'outerwear',
    name: 'OUTERWEAR',
    subtitle: 'TECHNICAL BOMBERS & SHELLS',
    count: 5,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
    description: 'Matte weatherproof membranes, Fidlock hardware, and insulation built for urban temperature transitions.',
  },
  {
    id: 'cat-accessories',
    slug: 'accessories',
    name: 'ACCESSORIES',
    subtitle: 'TACTICAL RIGS & HARDWARE',
    count: 11,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    description: 'Cordura ballistic materials, industrial webbing, and modular utility designed to complete the DON silhouette.',
  },
];
