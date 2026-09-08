import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { Product } from '../types/product';
import { Search, Sparkles } from 'lucide-react';
import './SearchPage.css';

interface SearchPageProps {
  navigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

const TRENDING_TAGS = ['OVERSIZED', 'BLACK', 'HOODIES', 'CARGOS', 'AFTER DARK', '280 GSM'];

export const SearchPage: React.FC<SearchPageProps> = ({ navigate, onQuickView }) => {
  const [query, setQuery] = useState('');

  const normalized = query.trim().toLowerCase();

  const results = normalized
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(normalized) ||
          p.categoryName.toLowerCase().includes(normalized) ||
          p.collection.toLowerCase().includes(normalized) ||
          p.tags.some((t) => t.toLowerCase().includes(normalized))
      )
    : PRODUCTS;

  return (
    <div className="search-dedicated-page bg-almost-black">
      <div className="container search-page-container">
        <div className="search-page-header">
          <span className="mono-tag">INDEX RETRIEVAL</span>
          <h1 className="search-page-title">CATALOG SEARCH</h1>
          <div className="search-input-box">
            <Search size={22} className="search-field-icon" />
            <input
              type="text"
              placeholder="SEARCH SILHOUETTES, DROPS, MATERIALS..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-field-input"
              autoFocus
            />
          </div>

          <div className="search-trending-strip">
            <span className="trend-label">POPULAR:</span>
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                className="trend-chip-btn"
                onClick={() => setQuery(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="search-results-tray">
          <div className="results-indicator">
            <span className="mono-tag">
              {normalized ? `SHOWING ${results.length} RESULTS FOR "${query.toUpperCase()}"` : `ALL CATALOG ITEMS (${results.length})`}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="no-search-match">
              <h3>NO EXACT MATCH</h3>
              <p>Try searching for "Oversized", "Black", "Hoodie", or "Cargo".</p>
            </div>
          ) : (
            <div className="grid-products-4">
              {results.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  navigate={navigate}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
