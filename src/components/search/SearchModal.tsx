import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS } from '../../data/products';
import { CATEGORIES } from '../../data/categories';
import { Product } from '../../types/product';
import { BRAND } from '../../config/brand';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import './SearchModal.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

const TRENDING_SEARCHES = ['OVERSIZED', 'BLACK', 'HOODIES', 'CARGOS', 'AFTER DARK', '280 GSM'];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, navigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.trim().toLowerCase();

  const filteredProducts: Product[] = normalizedQuery
    ? PRODUCTS.filter((p) => {
        const inName = p.name.toLowerCase().includes(normalizedQuery);
        const inCat = p.categoryName.toLowerCase().includes(normalizedQuery);
        const inCol = p.collection.toLowerCase().includes(normalizedQuery);
        const inTags = p.tags.some((t) => t.toLowerCase().includes(normalizedQuery));
        return inName || inCat || inCol || inTags;
      })
    : [];

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleSelectCategory = (slug: string) => {
    onClose();
    navigate(`/category/${slug}`);
  };

  return (
    <div className="search-modal-overlay fade-in" role="dialog" aria-modal="true">
      <div className="search-modal-container">
        {/* Top Bar with Input */}
        <div className="search-input-wrapper">
          <div className="container search-bar-inner">
            <Search size={28} className="search-lead-icon" />
            <input
              ref={inputRef}
              type="text"
              className="search-main-input"
              placeholder="SEARCH CATALOG (e.g. OVERSIZED, HOODIE, CARGO)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="search-clear-btn"
                onClick={() => setQuery('')}
                aria-label="Clear query"
              >
                <X size={20} />
              </button>
            )}
            <button className="search-close-btn" onClick={onClose} aria-label="Close search">
              <span className="esc-key">ESC</span>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="search-content-area">
          <div className="container">
            {/* If no query, show trending tags & suggested categories */}
            {!normalizedQuery ? (
              <div className="search-suggestions-grid">
                <div className="search-trending-col">
                  <div className="search-subheading">
                    <Sparkles size={16} className="text-burnt-red" />
                    <span>TRENDING SEARCHES</span>
                  </div>
                  <div className="trending-tags-cloud">
                    {TRENDING_SEARCHES.map((tag) => (
                      <button
                        key={tag}
                        className="trending-tag-btn"
                        onClick={() => setQuery(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="search-categories-col">
                  <span className="search-subheading">POPULAR CATEGORIES</span>
                  <div className="suggested-cats-list">
                    {CATEGORIES.slice(0, 4).map((cat) => (
                      <button
                        key={cat.id}
                        className="suggested-cat-row"
                        onClick={() => handleSelectCategory(cat.slug)}
                      >
                        <span className="cat-suggest-name">{cat.name}</span>
                        <span className="cat-suggest-count">{cat.count} PIECES</span>
                        <ArrowRight size={16} className="cat-arrow" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Live Results */
              <div className="search-results-section">
                <div className="search-results-header">
                  <span className="results-count-lead">
                    SHOWING {filteredProducts.length} RESULTS FOR "{query.toUpperCase()}"
                  </span>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="search-empty-state">
                    <p className="empty-lead">NO RESULTS FOUND</p>
                    <p className="empty-sub">
                      Try searching with different terms or browse our full collections.
                    </p>
                    <button
                      className="btn btn-outline-light btn-sm"
                      onClick={() => {
                        onClose();
                        navigate('/shop');
                      }}
                    >
                      BROWSE ENTIRE ARCHIVE
                    </button>
                  </div>
                ) : (
                  <div className="search-results-grid">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        className="search-result-card"
                        onClick={() => handleSelectProduct(p.slug)}
                      >
                        <div className="search-thumb-wrap">
                          <img src={p.images[0]} alt={p.name} />
                        </div>
                        <div className="search-item-info">
                          <span className="search-col-tag">{p.collection}</span>
                          <h4 className="search-item-title">{p.name}</h4>
                          <span className="search-item-price">
                            {BRAND.currency.format(p.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
