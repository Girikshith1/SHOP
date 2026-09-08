// ============================================================
// BRAND IDENTITY & CENTRALIZED CONFIGURATION
// Easily customizable: changing values here updates the entire store
// ============================================================

export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  subTagline: string;
  philosophy: string;
  currency: {
    symbol: string;
    code: string;
    format: (amount: number) => string;
  };
  freeShippingThreshold: number;
  announcements: string[];
  contact: {
    email: string;
    phone: string;
    conciergeHours: string;
    showroom: string;
  };
  socials: {
    instagram: string;
    tiktok: string;
    pinterest: string;
    discord: string;
  };
  navLinks: {
    label: string;
    href: string;
    badge?: string;
  }[];
  footerLinks: {
    title: string;
    links: { label: string; href: string }[];
  }[];
}

export const BRAND: BrandConfig = {
  name: 'DON',
  shortName: 'DON',
  tagline: 'LESS CLUTTER. MORE IMPACT.',
  subTagline: "WE DON'T FOLLOW THE CULTURE. WE CREATE OUR OWN.",
  philosophy: 'DON IS NOT MADE TO FIT IN. IT IS MADE TO BE WORN WITHOUT PERMISSION.',
  currency: {
    symbol: '₹',
    code: 'INR',
    format: (amount: number) => `₹${amount.toLocaleString('en-IN')}`,
  },
  freeShippingThreshold: 2999,
  announcements: [
    'FREE SHIPPING ON ORDERS ABOVE ₹2,999',
    'LIMITED DROP 001 NOW LIVE',
    'NEW SEASON. NO RESTOCKS. NO SECOND CHANCES.',
    'WARRENTED HEAVYWEIGHT LUXURY COTTON',
  ],
  contact: {
    email: 'concierge@donstreetwear.com',
    phone: '+91 98200 12026',
    conciergeHours: 'MON — SAT, 11:00 — 20:00 IST',
    showroom: 'STUDIO 04, INDUSTRIAL DISTRICT, MUMBAI 400013',
  },
  socials: {
    instagram: 'https://instagram.com/don.streetwear',
    tiktok: 'https://tiktok.com/@don.streetwear',
    pinterest: 'https://pinterest.com/donstreetwear',
    discord: 'https://discord.gg/don',
  },
  navLinks: [
    { label: 'SHOP', href: '/shop' },
    { label: 'NEW DROP', href: '/new-drop', badge: 'DROP 001' },
    { label: 'COLLECTIONS', href: '/collections' },
    { label: 'ABOUT', href: '/about' },
  ],
  footerLinks: [
    {
      title: 'SHOP',
      links: [
        { label: 'All Products', href: '/shop' },
        { label: 'New Drop 001', href: '/new-drop' },
        { label: 'Collections', href: '/collections' },
        { label: 'Oversized Tees', href: '/category/tees' },
        { label: 'Hoodies & Sweats', href: '/category/hoodies' },
        { label: 'Cargos & Bottoms', href: '/category/cargos' },
      ],
    },
    {
      title: 'INFORMATION',
      links: [
        { label: 'About the Brand', href: '/about' },
        { label: 'Contact & Concierge', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Shipping & Delivery', href: '/shipping-returns' },
        { label: 'Returns & Exchanges', href: '/shipping-returns' },
      ],
    },
    {
      title: 'LEGAL',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms & Conditions', href: '/terms' },
      ],
    },
  ],
};
