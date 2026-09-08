import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { ArrowUpRight } from 'lucide-react';
import './CategoryBento.css';

interface CategoryBentoProps {
  navigate: (path: string) => void;
}

export const CategoryBento: React.FC<CategoryBentoProps> = ({ navigate }) => {
  // Take 4 primary categories as specified
  const primaryCategories = CATEGORIES.slice(0, 4);

  return (
    <section className="category-section section" aria-label="Shop by Category">
      <div className="container">
        {/* Section Header */}
        <div className="category-section-header">
          <div>
            <span className="mono-tag">ARCHIVE TAXONOMY</span>
            <h2 className="section-title-large">SHOP BY CATEGORY</h2>
          </div>
          <button
            className="btn btn-outline-light btn-sm view-all-btn"
            onClick={() => navigate('/shop')}
          >
            <span>VIEW ALL ARCHIVES</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* 2x2 Asymmetric Editorial Grid */}
        <div className="category-grid-2x2">
          {primaryCategories.map((cat, index) => (
            <div
              key={cat.id}
              className={`category-bento-card card-variant-${index + 1}`}
              onClick={() => navigate(`/category/${cat.slug}`)}
            >
              <div className="cat-img-wrapper img-zoom-container">
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <div className="cat-overlay"></div>
              </div>

              <div className="cat-card-content">
                <div className="cat-card-top">
                  <span className="cat-index">0{index + 1}</span>
                  <span className="cat-count-badge">{cat.count} PIECES</span>
                </div>

                <div className="cat-card-bottom">
                  <span className="cat-subtitle-mono">{cat.subtitle}</span>
                  <div className="cat-title-row">
                    <h3 className="cat-main-title">{cat.name}</h3>
                    <div className="cat-action-circle">
                      <ArrowUpRight size={20} className="cat-circle-arrow" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
