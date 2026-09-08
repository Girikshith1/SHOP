import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/shop/ProductCard';
import { Product } from '../types/product';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import './WishlistPage.css';

interface WishlistPageProps {
  navigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ navigate, onQuickView }) => {
  const { wishlistProducts, clearWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveAllToBag = () => {
    wishlistProducts.forEach((p) => {
      const defaultSize = p.sizes.includes('L') ? 'L' : p.sizes[0];
      addToCart(p, defaultSize);
    });
  };

  return (
    <div className="wishlist-page bg-almost-black">
      <div className="container wishlist-container">
        <div className="wishlist-header">
          <div>
            <span className="mono-tag">PERSONAL ARCHIVE SELECTIONS</span>
            <h1 className="wishlist-title">SAVED SILHOUETTES</h1>
          </div>

          {wishlistCount > 0 && (
            <div className="wishlist-header-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleMoveAllToBag}
              >
                <span>MOVE ALL TO BAG</span>
              </button>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={clearWishlist}
              >
                <Trash2 size={15} />
                <span>CLEAR ALL</span>
              </button>
            </div>
          )}
        </div>

        {wishlistCount === 0 ? (
          <div className="wishlist-empty-box">
            <Heart size={48} className="empty-heart-icon" />
            <h2 className="empty-wishlist-lead">YOUR ARCHIVE IS EMPTY.</h2>
            <p className="empty-wishlist-p">
              Save drop pieces for quick retrieval during limited edition releases.
            </p>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => navigate('/shop')}
            >
              <span>EXPLORE ALL DROPS</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="grid-products-4">
            {wishlistProducts.map((p) => (
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
