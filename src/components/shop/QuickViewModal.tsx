import React, { useState } from 'react';
import { Product, ProductSize } from '../../types/product';
import { BRAND } from '../../config/brand';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import './QuickViewModal.css';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  navigate: (path: string) => void;
  onOpenSizeGuide: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  navigate,
  onOpenSizeGuide,
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0] || 'L');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isFavorited = isInWishlist(product.id);

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor);
    onClose();
  };

  const handleViewFullDetails = () => {
    onClose();
    navigate(`/product/${product.slug}`);
  };

  return (
    <div className="modal-backdrop fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="quickview-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={22} />
        </button>

        <div className="quickview-grid">
          {/* Gallery Preview */}
          <div className="quickview-gallery">
            <div className="quickview-main-img-wrap">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="quickview-main-img"
              />
            </div>
            {product.images.length > 1 && (
              <div className="quickview-thumbs">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img} alt={`View ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Controls */}
          <div className="quickview-details">
            <div className="quickview-meta-row">
              <span className="mono-tag">{product.collection} // {product.categoryName}</span>
              <span className="badge badge-teal">{product.fabricGsm} GSM</span>
            </div>

            <h2 className="quickview-title">{product.name}</h2>

            <div className="quickview-price-row">
              <span className="price-val">{BRAND.currency.format(product.price)}</span>
              {product.originalPrice && (
                <span className="price-orig">{BRAND.currency.format(product.originalPrice)}</span>
              )}
            </div>

            <p className="quickview-desc">{product.description}</p>

            {/* Colors */}
            <div className="quickview-options-group">
              <span className="opt-label">COLOR: {selectedColor}</span>
              <div className="color-swatches">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    className={`swatch-btn ${selectedColor === c.name ? 'active' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="quickview-options-group">
              <div className="size-header-row">
                <span className="opt-label">SELECT SIZE</span>
                <button className="size-guide-link" onClick={onOpenSizeGuide}>
                  SIZE GUIDE
                </button>
              </div>
              <div className="size-selector-grid">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="quickview-actions">
              <button className="btn btn-primary btn-full" onClick={handleAdd}>
                <ShoppingBag size={18} />
                <span>ADD TO BAG — {BRAND.currency.format(product.price)}</span>
              </button>

              <div className="secondary-actions-row">
                <button
                  className={`btn btn-outline-light ${isFavorited ? 'btn-favorited' : ''}`}
                  onClick={() => toggleWishlist(product)}
                >
                  <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
                  <span>{isFavorited ? 'SAVED' : 'WISHLIST'}</span>
                </button>

                <button className="btn btn-outline-light" onClick={handleViewFullDetails}>
                  <span>VIEW FULL DETAILS</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
