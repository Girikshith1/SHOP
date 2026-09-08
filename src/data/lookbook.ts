import { LookbookLook } from '../types/product';

export const LOOKBOOK_LOOKS: LookbookLook[] = [
  {
    id: 'look-01',
    title: 'THE NOCTURNE UNIFORM',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    editorialCaption: 'Full silhouette layering the Obsidian Heavyweight base with Nightfall articulated cargos and tactile chest hardware.',
    items: [
      {
        productId: 'prod-002',
        name: 'SHADOW HEAVYWEIGHT HOODIE',
        price: 3499,
        posX: 48,
        posY: 32,
      },
      {
        productId: 'prod-001',
        name: 'OBSIDIAN OVERSIZED TEE',
        price: 1999,
        posX: 52,
        posY: 52,
      },
      {
        productId: 'prod-003',
        name: 'NIGHTFALL TACTICAL CARGO',
        price: 3999,
        posX: 45,
        posY: 75,
      },
    ],
  },
  {
    id: 'look-02',
    title: 'THE TRANSIT LAYER',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
    editorialCaption: 'Kinetic nylon bomber draped over Void relaxed pullover for seamless temperature adaptation.',
    items: [
      {
        productId: 'prod-007',
        name: 'KINETIC MONOCHROME BOMBER',
        price: 5499,
        posX: 50,
        posY: 35,
      },
      {
        productId: 'prod-004',
        name: 'VOID RELAXED SWEATSHIRT',
        price: 2999,
        posX: 50,
        posY: 58,
      },
      {
        productId: 'prod-008',
        name: 'TACTICAL CHEST RIG',
        price: 2499,
        posX: 38,
        posY: 44,
      },
    ],
  },
];
