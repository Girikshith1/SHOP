import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { Product, ProductSize } from '../types/product';
import { BRAND } from '../config/brand';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/shop/ProductCard';
import {
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import './ProductDetailPage.css';

interface ProductDetailPageProps {
  productSlug: string;
  navigate: (path: string) => void;
  onOpenSizeGuide: () => void;
  onQuickView: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productSlug,
  navigate,
  onOpenSizeGuide,
  onQuickView,
}) => {
  const product = PRODUCTS.find((p) => p.slug === productSlug) || PRODUCTS[0];

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes.includes('L') ? 'L' : product.sizes[0]
  );
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);

  // Accordions
  const [openAccordion, setOpenAccordion] = useState<string | null>('fabric');

  const isFavorited = isInWishlist(product.id);

  // Related products
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.collectionSlug === product.collectionSlug)
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <div className="product-detail-page bg-almost-black">
      {/* Breadcrumb Bar */}
      <div className="container pdp-breadcrumbs-bar">
        <button className="pdp-back-btn" onClick={() => navigate('/shop')}>
          <ArrowLeft size={16} />
          <span>ALL PRODUCTS</span>
        </button>
        <span className="crumb-sep">/</span>
        <button
          className="crumb-link"
          onClick={() => navigate(`/category/${product.category}`)}
        >
          {product.categoryName}
        </button>
        <span className="crumb-sep">/</span>
        <span className="crumb-active">{product.name}</span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="container pdp-main-grid">
        {/* Left: Large Image Gallery */}
        <div className="pdp-gallery-column">
          <div className="pdp-main-image-viewport">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="pdp-active-img"
            />
            {product.limitedEdition && (
              <span className="badge badge-red pdp-corner-badge">
                LIMITED EDITION // NO RESTOCKS
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="pdp-thumbnails-strip">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`pdp-thumb-item ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Model Fit Specification Callout */}
          <div className="pdp-model-spec-note">
            <span className="spec-bullet">✦</span>
            <span>{product.modelInfo}</span>
          </div>
        </div>

        {/* Right: Sticky Product Info Panel */}
        <div className="pdp-sticky-info-column">
          <div className="pdp-info-panel-inner">
            <div className="pdp-collection-tag">
              <span className="mono-tag text-burnt-red">
                {product.collection} // {product.dropNumber || 'CORE ARCHIVE'}
              </span>
              <span className="badge badge-teal">{product.fabricGsm} GSM</span>
            </div>

            <h1 className="pdp-product-title">{product.name}</h1>

            <div className="pdp-price-lockup">
              <span className="pdp-price-current">
                {BRAND.currency.format(product.price)}
              </span>
              {product.originalPrice && (
                <span className="pdp-price-original">
                  {BRAND.currency.format(product.originalPrice)}
                </span>
              )}
              <span className="pdp-tax-note">TAX INCLUDED</span>
            </div>

            <p className="pdp-editorial-quote font-editorial">
              "{product.editorialNote}"
            </p>

            <p className="pdp-full-description font-editorial">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="pdp-selector-block">
              <div className="pdp-selector-label">
                <span className="mono-tag">COLOR:</span>
                <span className="selector-value">{selectedColor}</span>
              </div>
              <div className="pdp-color-swatches">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    className={`pdp-color-circle ${selectedColor === c.name ? 'active' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setSelectedColor(c.name)}
                    aria-label={`Select color ${c.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="pdp-selector-block">
              <div className="pdp-selector-label">
                <span className="mono-tag">SELECT SIZE:</span>
                <button className="pdp-size-guide-btn" onClick={onOpenSizeGuide}>
                  VIEW SIZE GUIDE
                </button>
              </div>
              <div className="pdp-size-buttons-grid">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`pdp-size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Bag Controls */}
            <div className="pdp-actions-container">
              <div className="pdp-quantity-selector">
                <button
                  className="pdp-qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="pdp-qty-value">{quantity}</span>
                <button
                  className="pdp-qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                className="btn btn-primary btn-lg pdp-add-bag-btn"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>ADD TO BAG — {BRAND.currency.format(product.price * quantity)}</span>
              </button>

              <button
                className={`pdp-wishlist-toggle ${isFavorited ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Free Shipping Notification */}
            <div className="pdp-shipping-perk">
              <Truck size={16} className="perk-icon" />
              <span>COMPLIMENTARY AIR EXPRESS SHIPPING ON ORDERS OVER ₹2,999</span>
            </div>

            {/* Collapsible Product Details Accordions */}
            <div className="pdp-accordions-group">
              {/* Accordion 1: Material & Specs */}
              <div className="accordion-item">
                <button
                  className="accordion-trigger"
                  onClick={() => toggleAccordion('fabric')}
                >
                  <span>FABRIC ARCHITECTURE & CARE</span>
                  {openAccordion === 'fabric' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'fabric' && (
                  <div className="accordion-content fade-in">
                    <ul className="spec-list">
                      <li><strong>Weight:</strong> {product.fabricGsm} GSM Custom French Terry / Combed Cotton</li>
                      <li><strong>Composition:</strong> {product.composition}</li>
                      <li><strong>Silhouette:</strong> {product.fit}</li>
                      <li><strong>Care:</strong> Machine wash cold inside out. Hang dry only. Do not iron directly on graphic elements.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Delivery & Shipping */}
              <div className="accordion-item">
                <button
                  className="accordion-trigger"
                  onClick={() => toggleAccordion('shipping')}
                >
                  <span>DELIVERY & COMPLIMENTARY EXCHANGES</span>
                  {openAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="accordion-content fade-in">
                    <p className="font-editorial">
                      Orders dispatched within 24 hours from our Mumbai fulfillment center. Metro deliveries arrive in 2–3 business days. All drop items qualify for complimentary 7-day size exchanges.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="container pdp-related-section">
          <div className="related-header">
            <span className="mono-tag">CURATED COMPANIONS</span>
            <h3 className="section-title-large">COMPLETE THE SILHOUETTE</h3>
          </div>
          <div className="grid-products-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                navigate={navigate}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
