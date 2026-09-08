import React from 'react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../shop/ProductCard';
import { Product } from '../../types/product';
import { ArrowRight } from 'lucide-react';
import './NewDropSection.css';

interface NewDropSectionProps {
  navigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const NewDropSection: React.FC<NewDropSectionProps> = ({ navigate, onQuickView }) => {
  // Products explicitly mentioned for Drop 001
  const dropProducts = PRODUCTS.filter((p) => p.dropNumber === 'DROP 001' || p.featured).slice(0, 4);

  return (
    <section className="new-drop-section bg-soft-grey" aria-label="New Drop 001">
      <div className="container">
        {/* Section Title in High Contrast Soft Grey background */}
        <div className="newdrop-header">
          <div className="newdrop-title-group">
            <div className="drop-indicator">
              <span className="drop-dot"></span>
              <span className="drop-pill-text">LIMITED EDITION ALLOCATION</span>
            </div>
            <h2 className="newdrop-main-title">
              NEW DROP <span className="title-slash">//</span> <span className="drop-highlight">DROP 001</span>
            </h2>
            <p className="newdrop-subtitle">
              Precision cut from 280–460 GSM combed luxury cottons. Designed to withstand time and trend cycles.
            </p>
          </div>

          <button
            className="btn btn-dark btn-sm newdrop-btn"
            onClick={() => navigate('/new-drop')}
          >
            <span>EXPLORE DROP 001</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Product Cards Grid with Light Theme styling */}
        <div className="grid-products-4">
          {dropProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              navigate={navigate}
              onQuickView={onQuickView}
              isLightSection={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
