import React from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { Product } from '../types/product';
import { Flame, Clock, ShieldAlert } from 'lucide-react';
import './NewDropPage.css';

interface NewDropPageProps {
  navigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const NewDropPage: React.FC<NewDropPageProps> = ({ navigate, onQuickView }) => {
  const dropProducts = PRODUCTS.filter((p) => p.dropNumber === 'DROP 001' || p.limitedEdition);

  return (
    <div className="new-drop-page bg-almost-black">
      {/* Editorial Headline Hero */}
      <div className="drop-page-hero">
        <div className="container">
          <div className="drop-status-pill">
            <Flame size={15} className="text-burnt-red" />
            <span className="mono-tag">ACTIVE RELEASE ALLOCATION // ZERO RESTOCK GUARANTEE</span>
          </div>

          <h1 className="drop-page-title">
            <span className="drop-title-part1">DROP 001</span>
            <span className="drop-title-part2 font-artistic text-burnt-red">NOCTURNE</span>
          </h1>

          <div className="drop-meta-columns">
            <div className="drop-meta-item">
              <span className="meta-label">MANUFACTURED IN</span>
              <span className="meta-val">MUMBAI & TIRUPUR ATELIER</span>
            </div>
            <div className="drop-meta-item">
              <span className="meta-label">FABRIC WEIGHTS</span>
              <span className="meta-val">280 GSM — 460 GSM TERRY</span>
            </div>
            <div className="drop-meta-item">
              <span className="meta-label">INVENTORY PROTOCOL</span>
              <span className="meta-val">STRICTLY LIMITED PIECES</span>
            </div>
            <div className="drop-meta-item">
              <span className="meta-label">RESTOCK POLICY</span>
              <span className="meta-val text-burnt-red">NEVER RESTOCKED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Notice Banner */}
      <div className="drop-warning-strip">
        <div className="container warning-inner">
          <ShieldAlert size={16} className="text-burnt-red" />
          <span>ATTENTION: DUE TO HEAVY DEMAND, CARTS EXPIRE AFTER 15 MINUTES. BOT ORDERS WILL BE CANCELLED.</span>
        </div>
      </div>

      {/* Grid */}
      <div className="container drop-grid-container">
        <div className="drop-grid-header">
          <div className="drop-grid-tag">
            <Clock size={16} />
            <span>CATALOG ALLOCATION (DROP 001)</span>
          </div>
          <span className="mono-tag">{dropProducts.length} LIMITED SILHOUETTES</span>
        </div>

        <div className="grid-products-4">
          {dropProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              navigate={navigate}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
