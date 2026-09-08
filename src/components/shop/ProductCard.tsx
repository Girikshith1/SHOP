import React, { useState } from 'react';
import { Product } from '../../types/product';
import { BRAND } from '../../config/brand';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  navigate: (path: string) => void;
  onQuickView?: (product: Product) => void;
  isLightSection?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  navigate,
  onQuickView,
  isLightSection = false,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isFavorited = isInWishlist(product.id);

  const handleCardClick = (e: React.MouseEvent) => {
    // If not clicking button
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    navigate(`/product/${product.slug}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to 'L' or first size
    const defaultSize = product.sizes.includes('L') ? 'L' : product.sizes[0];
    addToCart(product, defaultSize);
  };

  return (
    <div
      className={`product-card ${isLightSection ? 'card-theme-light' : 'card-theme-dark'}`}
      onClick={handleCardClick}
      onMouseEnter={() => {
        if (product.images.length > 1) setCurrentImageIndex(1);
      }}
      onMouseLeave={() => setCurrentImageIndex(0)}
    >
      {/* Visual Image Container */}
      <div className="product-media img-zoom-container">
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          loading="lazy"
          className="product-img"
        />

        {/* Badges / Drop info */}
        <div className="card-badge-cluster">
          {product.limitedEdition && (
            <span className="badge badge-red">LIMITED</span>
          )}
          {product.newArrival && (
            <span className="badge badge-dark">NEW</span>
          )}
          {product.dropNumber && (
            <span className="badge badge-teal">{product.dropNumber}</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`card-wishlist-btn ${isFavorited ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>

        {/* Floating Quick Action Overlay */}
        <div className="card-overlay-actions">
          {onQuickView && (
            <button
              className="quick-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              title="Quick View"
              aria-label="Quick View Product"
            >
              <Eye size={17} />
              <span>QUICK VIEW</span>
            </button>
          )}
          <button
            className="quick-action-btn btn-add-bag"
            onClick={handleQuickAdd}
            title="Quick Add to Bag"
            aria-label="Quick Add to Bag"
          >
            <ShoppingBag size={17} />
            <span>QUICK ADD</span>
          </button>
        </div>
      </div>

      {/* Product Details Info */}
      <div className="product-info">
        <div className="product-meta-row">
          <span className="product-category-label">{product.categoryName}</span>
          <span className="product-gsm-tag">{product.fabricGsm} GSM</span>
        </div>

        <h3 className="product-title-text">{product.name}</h3>

        <div className="product-price-row">
          <span className="product-price">{BRAND.currency.format(product.price)}</span>
          {product.originalPrice && (
            <span className="product-original-price">
              {BRAND.currency.format(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Available Size Pills on hover/mobile */}
        <div className="product-sizes-preview">
          {product.sizes.map((s) => (
            <span key={s} className="size-preview-dot">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
