import React, { useState } from 'react';
import { LOOKBOOK_LOOKS } from '../../data/lookbook';
import { PRODUCTS } from '../../data/products';
import { BRAND } from '../../config/brand';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import './ShopTheLook.css';

interface ShopTheLookProps {
  navigate: (path: string) => void;
}

export const ShopTheLook: React.FC<ShopTheLookProps> = ({ navigate }) => {
  const currentLook = LOOKBOOK_LOOKS[0];
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(
    currentLook.items[0]?.productId || null
  );

  // Find products in this look
  const lookProducts = currentLook.items
    .map((item) => PRODUCTS.find((p) => p.id === item.productId))
    .filter(Boolean);

  const lookTotalPrice = currentLook.items.reduce((sum, item) => sum + item.price, 0);

  const handleAddFullLook = () => {
    lookProducts.forEach((product) => {
      if (product) {
        const defaultSize = product.sizes.includes('L') ? 'L' : product.sizes[0];
        addToCart(product, defaultSize);
      }
    });
    showToast('COMPLETE LOOK ADDED', `3 pieces added to your bag`, 'success');
  };

  const handleAddSingleItem = (productId: string) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (prod) {
      const defaultSize = prod.sizes.includes('L') ? 'L' : prod.sizes[0];
      addToCart(prod, defaultSize);
    }
  };

  return (
    <section className="shop-the-look-section bg-almost-black section" aria-label="Shop The Look">
      <div className="container">
        <div className="look-header-row">
          <div>
            <span className="mono-tag">CURATED STYLING // OUTFIT DISCOVERY</span>
            <h2 className="section-title-large">SHOP THE LOOK</h2>
          </div>
          <p className="look-editorial-quote">
            {currentLook.editorialCaption}
          </p>
        </div>

        <div className="look-interactive-grid">
          {/* Left: Model Image with Interactive Hotspots */}
          <div className="look-visual-container">
            <img
              src={currentLook.image}
              alt={currentLook.title}
              className="look-model-img"
            />
            <div className="look-img-overlay"></div>

            {/* Hotspot Markers */}
            {currentLook.items.map((item) => {
              const isSelected = activeHotspotId === item.productId;
              return (
                <button
                  key={item.productId}
                  className={`look-hotspot-pin ${isSelected ? 'active' : ''} hotspot-pulse`}
                  style={{ top: `${item.posY}%`, left: `${item.posX}%` }}
                  onClick={() => setActiveHotspotId(item.productId)}
                  aria-label={`View ${item.name}`}
                >
                  <Plus size={16} />
                </button>
              );
            })}

            <div className="look-tag-watermark">
              <span>{currentLook.title}</span>
            </div>
          </div>

          {/* Right: Breakdown of Outfitted Products */}
          <div className="look-products-panel">
            <div className="look-panel-top">
              <span className="mono-tag">THE OUTFIT BREAKDOWN</span>
              <h3 className="look-panel-title">{currentLook.title}</h3>
            </div>

            <div className="look-items-breakdown">
              {currentLook.items.map((item) => {
                const prod = PRODUCTS.find((p) => p.id === item.productId);
                const isSelected = activeHotspotId === item.productId;

                return (
                  <div
                    key={item.productId}
                    className={`outfit-item-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setActiveHotspotId(item.productId)}
                  >
                    <div className="outfit-item-media">
                      {prod && <img src={prod.images[0]} alt={item.name} />}
                    </div>

                    <div className="outfit-item-info">
                      <h4 className="outfit-prod-name">{item.name}</h4>
                      <span className="outfit-prod-price">
                        {BRAND.currency.format(item.price)}
                      </span>
                    </div>

                    <div className="outfit-item-actions">
                      <button
                        className="btn-add-outfit-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddSingleItem(item.productId);
                        }}
                        title="Add this item"
                        aria-label={`Add ${item.name} to bag`}
                      >
                        <Plus size={16} />
                        <span>ADD</span>
                      </button>

                      {prod && (
                        <button
                          className="btn-link-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${prod.slug}`);
                          }}
                          aria-label="View product page"
                        >
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Complete Look Action Banner */}
            <div className="look-checkout-card">
              <div className="look-total-row">
                <span className="look-total-lbl">COMPLETE LOOK TOTAL</span>
                <span className="look-total-val">{BRAND.currency.format(lookTotalPrice)}</span>
              </div>
              <button className="btn btn-primary btn-full" onClick={handleAddFullLook}>
                <ShoppingBag size={18} />
                <span>ADD COMPLETE LOOK TO BAG</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
