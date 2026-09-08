import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { BRAND } from '../config/brand';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import './CartPage.css';

interface CartPageProps {
  navigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const {
    cart,
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

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    if (applyPromoCode(inputCode)) setInputCode('');
  };

  const progress = Math.min(100, Math.round((subtotal / BRAND.freeShippingThreshold) * 100));

  return (
    <div className="cart-page-view bg-almost-black">
      <div className="container cart-page-container">
        <div className="cart-page-header">
          <span className="mono-tag">CURRENT ALLOCATION</span>
          <h1 className="cart-page-title">SHOPPING BAG</h1>
        </div>

        {/* Free Shipping Meter */}
        <div className="cart-page-shipping-meter">
          <div className="meter-label">
            {isFreeShipping && subtotal > 0 ? (
              <span className="unlocked">✦ YOU QUALIFY FOR COMPLIMENTARY EXPRESS DELIVERY</span>
            ) : (
              <span>ADD {BRAND.currency.format(freeShippingRemaining)} MORE FOR FREE EXPRESS DELIVERY</span>
            )}
          </div>
          <div className="meter-bar-track">
            <div className="meter-bar-fill" style={{ width: `${subtotal === 0 ? 0 : progress}%` }}></div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="cart-page-empty">
            <ShoppingBag size={54} className="empty-cart-lead-icon" />
            <h2>YOUR BAG IS EMPTY.</h2>
            <p>FIND SOMETHING WORTH WEARING.</p>
            <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/shop')}>
              <span>BROWSE ARCHIVE</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="cart-page-grid">
            {/* Left Items Table */}
            <div className="cart-page-items-col">
              <div className="cart-items-head-row">
                <span>PRODUCT</span>
                <span>QUANTITY</span>
                <span>TOTAL</span>
              </div>

              {cart.map((item) => (
                <div key={item.id} className="cart-table-row">
                  <div className="item-details-col">
                    <div className="item-pic">
                      <img src={item.product.images[0]} alt={item.product.name} />
                    </div>
                    <div className="item-meta">
                      <span className="item-col-label">{item.product.collection}</span>
                      <h3
                        className="item-name-link"
                        onClick={() => navigate(`/product/${item.product.slug}`)}
                      >
                        {item.product.name}
                      </h3>
                      <div className="item-specs">
                        <span>SIZE: {item.size}</span>
                        <span>COLOR: {item.color}</span>
                        <span>{BRAND.currency.format(item.product.price)} EACH</span>
                      </div>
                      <button
                        className="item-del-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={13} />
                        <span>REMOVE</span>
                      </button>
                    </div>
                  </div>

                  <div className="item-qty-col">
                    <div className="qty-control-box">
                      <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease">
                        <Minus size={13} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase">
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="item-total-col">
                    <span className="row-total-price">
                      {BRAND.currency.format(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Summary Card */}
            <div className="cart-summary-col">
              <div className="order-summary-card">
                <h3 className="summary-card-title">ORDER SUMMARY</h3>

                {/* Promo */}
                <div className="summary-promo-section">
                  {promoCode ? (
                    <div className="summary-promo-tag">
                      <span>CODE: {promoCode} (-10%)</span>
                      <button onClick={removePromoCode}>REMOVE</button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="summary-promo-form">
                      <input
                        type="text"
                        placeholder="ENTER CODE (e.g. DON10)"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                      />
                      <button type="submit">APPLY</button>
                    </form>
                  )}
                </div>

                <div className="summary-rows">
                  <div className="s-row">
                    <span>SUBTOTAL</span>
                    <span>{BRAND.currency.format(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="s-row text-success">
                      <span>DISCOUNT</span>
                      <span>-{BRAND.currency.format(discount)}</span>
                    </div>
                  )}
                  <div className="s-row">
                    <span>ESTIMATED DELIVERY</span>
                    <span>{shippingFee === 0 ? 'COMPLIMENTARY' : BRAND.currency.format(shippingFee)}</span>
                  </div>
                  <div className="s-row final-row">
                    <span>TOTAL</span>
                    <span className="grand-total">{BRAND.currency.format(total)}</span>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-full checkout-direct-btn"
                  onClick={() => navigate('/checkout')}
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight size={18} />
                </button>

                <div className="summary-trust-badge">
                  <ShieldCheck size={16} />
                  <span>TAX INCLUDED // DOORSTEP EXCHANGES INCLUDED</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
