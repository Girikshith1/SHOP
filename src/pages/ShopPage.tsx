import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from '../components/shop/ProductCard';
import { Product, ProductSize } from '../types/product';
import { Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import './ShopPage.css';

interface ShopPageProps {
  navigate: (path: string) => void;
  onQuickView: (product: Product) => void;
  initialCategory?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  navigate,
  onQuickView,
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [priceMax, setPriceMax] = useState<number>(6000);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);

  const sizesList: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      // Size
      if (selectedSize !== 'all' && !p.sizes.includes(selectedSize as ProductSize)) return false;
      // Price
      if (p.price > priceMax) return false;
      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-low') return a.price - b.price;
      if (selectedSort === 'price-high') return b.price - a.price;
      if (selectedSort === 'popular') return (b.originalPrice || b.price) - (a.originalPrice || a.price);
      return b.newArrival ? 1 : -1; // newest default
    });
  }, [selectedCategory, selectedSize, selectedSort, priceMax]);

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedSize !== 'all' ? 1 : 0) +
    (priceMax < 6000 ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setPriceMax(6000);
    setSelectedSort('newest');
  };

  return (
    <div className="shop-page bg-almost-black">
      {/* Top Banner Header */}
      <div className="shop-header-banner">
        <div className="container">
          <div className="shop-title-lockup">
            <span className="mono-tag">ARCHIVE CATALOG // ALL PIECES</span>
            <h1 className="shop-main-title">SHOP ALL PRODUCTS</h1>
            <p className="shop-header-desc">
              Heavyweight garments built without compromise. Explore the complete collection of drop-shoulder silhouettes, technical bottoms, and outerwear.
            </p>
          </div>
        </div>
      </div>

      <div className="container shop-body-container">
        {/* Category Pills Slider */}
        <div className="category-pills-bar">
          <button
            className={`cat-pill-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            ALL PIECES ({PRODUCTS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              className={`cat-pill-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter Controls & Sort Bar */}
        <div className="shop-controls-bar">
          <div className="controls-left">
            <button
              className={`filter-toggle-btn ${activeFilterCount > 0 ? 'has-filters' : ''}`}
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            >
              <SlidersHorizontal size={16} />
              <span>FILTERS</span>
              {activeFilterCount > 0 && (
                <span className="filter-count-badge">{activeFilterCount}</span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button className="reset-filter-btn" onClick={handleResetFilters}>
                <X size={14} />
                <span>RESET ALL</span>
              </button>
            )}
          </div>

          <div className="controls-right">
            <span className="product-count-readout">
              {filteredProducts.length} PRODUCTS
            </span>

            <div className="sort-dropdown-wrap">
              <ArrowUpDown size={15} className="sort-icon" />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="sort-select"
                aria-label="Sort products"
              >
                <option value="newest">SORT: NEWEST</option>
                <option value="price-low">PRICE: LOW TO HIGH</option>
                <option value="price-high">PRICE: HIGH TO LOW</option>
                <option value="popular">POPULARITY</option>
              </select>
            </div>
          </div>
        </div>

        {/* Collapsible Filter Tray */}
        {isFilterPanelOpen && (
          <div className="filter-drawer-panel fade-in">
            <div className="filter-group">
              <span className="filter-group-title">SIZE</span>
              <div className="filter-size-chips">
                <button
                  className={`size-chip ${selectedSize === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedSize('all')}
                >
                  ALL
                </button>
                {sizesList.map((s) => (
                  <button
                    key={s}
                    className={`size-chip ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-group-title">MAX PRICE: ₹{priceMax}</span>
              <input
                type="range"
                min={1500}
                max={6000}
                step={500}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="price-slider"
              />
            </div>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="shop-no-results">
            <Filter size={36} className="no-res-icon" />
            <h3>NO MATCHING SILHOUETTES</h3>
            <p>No products match your current filter combination. Try expanding your parameters.</p>
            <button className="btn btn-outline-light btn-sm" onClick={handleResetFilters}>
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="grid-products-4 shop-main-grid">
            {filteredProducts.map((p) => (
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
  );
};
