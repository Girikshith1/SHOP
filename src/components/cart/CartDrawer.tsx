import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { BRAND } from '../../config/brand';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import './CartDrawer.css';

interface CartDrawerProps {
  navigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ navigate }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shippingFee,
    total,
    freeShippingRemaining,
    isFreeShipping,
    promoCode,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewBag = () => {
    closeCart();
    navigate('/cart');
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const ok = applyPromoCode(inputCode);
    if (ok) setInputCode('');
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / BRAND.freeShippingThreshold) * 100)
  );

  return (
    <div className="cart-drawer-overlay fade-in" onClick={closeCart} role="dialog" aria-modal="true">
      <div className="cart-drawer-panel slide-in-right" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title-wrap">
            <h2 className="cart-title">SHOPPING BAG</h2>
            <span className="cart-badge-count">
              ({cart.reduce((acc, i) => acc + i.quantity, 0)} ITEMS)
            </span>
          </div>
          <button className="cart-close-btn" onClick={closeCart} aria-label="Close bag">
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="shipping-meter-container">
          <div className="meter-label-row">
            {isFreeShipping && subtotal > 0 ? (
              <span className="meter-unlocked">
                ✦ YOU'VE UNLOCKED COMPLIMENTARY EXPRESS SHIPPING
              </span>
            ) : (
              <span className="meter-remaining">
                ADD {BRAND.currency.format(freeShippingRemaining)} MORE FOR FREE EXPRESS SHIPPING
              </span>
            )}
          </div>
          <div className="meter-track">
            <div
              className="meter-bar"
              style={{ width: `${subtotal === 0 ? 0 : freeShippingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="cart-items-scroll">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBag size={48} className="empty-cart-icon" />
              <h3 className="empty-cart-title">YOUR BAG IS EMPTY.</h3>
              <p className="empty-cart-sub">
                FIND SOMETHING WORTH WEARING.
              </p>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
              >
                <span>EXPLORE ALL DROPS</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-img-wrap">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="cart-item-img"
                    />
                  </div>

                  <div className="cart-item-info">
                    <div className="item-title-row">
                      <h4 className="cart-item-name">{item.product.name}</h4>
                      <button
                        className="item-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="cart-item-variants">
                      <span>SIZE: {item.size}</span>
                      <span className="dot-sep">•</span>
                      <span>{item.color}</span>
                    </div>

                    <div className="cart-item-bottom-row">
                      <div className="qty-counter">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="cart-item-price">
                        {BRAND.currency.format(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Actions */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo Code Input */}
            <div className="cart-promo-block">
              {promoCode ? (
                <div className="applied-promo-row">
                  <span className="promo-tag-name">CODE: {promoCode} (-10%)</span>
                  <button className="remove-promo-btn" onClick={removePromoCode}>
                    REMOVE
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePromoSubmit} className="promo-input-row">
                  <input
                    type="text"
                    placeholder="ENTER CODE (e.g. DON10)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="promo-input"
                  />
                  <button type="submit" className="promo-apply-btn">
                    APPLY
                  </button>
                </form>
              )}
            </div>

            {/* Calculations */}
            <div className="summary-calculations">
              <div className="calc-row">
                <span>SUBTOTAL</span>
                <span>{BRAND.currency.format(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="calc-row discount-row">
                  <span>DISCOUNT</span>
                  <span>-{BRAND.currency.format(discount)}</span>
                </div>
              )}
              <div className="calc-row">
                <span>ESTIMATED SHIPPING</span>
                <span>{shippingFee === 0 ? 'COMPLIMENTARY' : BRAND.currency.format(shippingFee)}</span>
              </div>
              <div className="calc-row total-row">
                <span>TOTAL</span>
                <span className="total-amount">{BRAND.currency.format(total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="cart-cta-buttons">
              <button className="btn btn-primary btn-full" onClick={handleCheckoutClick}>
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={18} />
              </button>

              <button className="btn btn-outline-light btn-full" onClick={handleViewBag}>
                <span>VIEW FULL BAG DETAILS</span>
              </button>
            </div>

            <div className="cart-guarantee-note">
              <ShieldCheck size={14} className="shield-icon" />
              <span>TAX INCLUDED // 7-DAY DOORSTEP EXCHANGES</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
