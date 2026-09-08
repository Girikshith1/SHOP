import React from 'react';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { Product } from '../types/product';
import { ArrowLeft } from 'lucide-react';
import './CategoryPage.css';

interface CategoryPageProps {
  categorySlug: string;
  navigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  navigate,
  onQuickView,
}) => {
  const category = CATEGORIES.find((c) => c.slug === categorySlug) || CATEGORIES[0];
  const products = PRODUCTS.filter((p) => p.category === category.slug);

  return (
    <div className="category-page bg-almost-black">
      {/* Category Hero Editorial Banner */}
      <div className="category-hero-banner">
        <div className="category-banner-backdrop">
          <img src={category.image} alt={category.name} />
          <div className="cat-banner-vignette"></div>
        </div>

        <div className="container category-banner-content">
          <button
            className="back-breadcrumbs-btn"
            onClick={() => navigate('/shop')}
          >
            <ArrowLeft size={16} />
            <span>BACK TO ALL ARCHIVES</span>
          </button>

          <span className="mono-tag text-burnt-red">{category.subtitle}</span>
          <h1 className="category-hero-title">{category.name}</h1>
          <p className="category-hero-desc">{category.description}</p>
          <span className="category-count-pill">{products.length} AVAILABLE SILHOUETTES</span>
        </div>
      </div>

      {/* Grid */}
      <div className="container category-grid-wrap">
        <div className="grid-products-4">
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              navigate={navigate}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
