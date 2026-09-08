import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../config/brand';
import { ShippingAddress, PaymentMethod, Order } from '../types/order';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  QrCode,
  Truck,
  Check,
} from 'lucide-react';
import './CheckoutPage.css';

interface CheckoutPageProps {
  navigate: (path: string) => void;
}

type CheckoutStep = 'info' | 'shipping' | 'payment' | 'confirmation';

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { cart, subtotal, discount, shippingFee, total, clearCart } = useCart();
  const { user, addOrder } = useAuth();

  const [step, setStep] = useState<CheckoutStep>('info');

  // Form State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    addressLine1: 'Flat 402, Highline Residency',
    addressLine2: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('shipping');
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderNumber = `DON-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      trackingNumber: `BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}`,
      carrier: 'BlueDart Air Express',
      items: [...cart],
      subtotal,
      discount,
      shippingFee,
      total,
      shippingAddress: address,
      paymentMethod,
      paymentStatus: 'paid',
    };

    addOrder(newOrder);
    setCompletedOrder(newOrder);
    clearCart();
    setStep('confirmation');
  };

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="checkout-empty-state bg-almost-black">
        <h2>NO ITEMS IN CART FOR CHECKOUT</h2>
        <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/shop')}>
          RETURN TO SHOP
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page-container bg-almost-black">
      {/* Distraction-Free Minimalist Checkout Header */}
      <header className="checkout-minimal-header">
        <div className="container checkout-header-inner">
          <div className="checkout-brand" onClick={() => navigate('/')}>
            <span className="chk-logo-text">{BRAND.name}</span>
            <span className="chk-logo-dot"></span>
          </div>

          {/* Stepper Progress */}
          <div className="checkout-stepper">
            <span className={`step-node ${step === 'info' ? 'active' : ''} ${step !== 'info' ? 'done' : ''}`}>
              1. INFO
            </span>
            <span className="step-arrow">→</span>
            <span className={`step-node ${step === 'shipping' ? 'active' : ''} ${step === 'payment' || step === 'confirmation' ? 'done' : ''}`}>
              2. SHIPPING
            </span>
            <span className="step-arrow">→</span>
            <span className={`step-node ${step === 'payment' ? 'active' : ''} ${step === 'confirmation' ? 'done' : ''}`}>
              3. PAYMENT
            </span>
            <span className="step-arrow">→</span>
            <span className={`step-node ${step === 'confirmation' ? 'active' : ''}`}>
              4. COMPLETE
            </span>
          </div>

          <div className="checkout-secure-badge">
            <Lock size={14} />
            <span>256-BIT ENCRYPTED</span>
          </div>
        </div>
      </header>

      {/* Main Checkout View */}
      <div className="container checkout-body-grid">
        {/* Left Form Area */}
        <div className="checkout-form-area">
          {/* STEP 1: INFORMATION */}
          {step === 'info' && (
            <form onSubmit={handleInfoSubmit} className="checkout-step-form fade-in">
              <div className="step-heading-row">
                <h2 className="step-title">1. CONTACT INFORMATION</h2>
                <span className="mono-tag">STAGE 01/03</span>
              </div>

              <div className="form-group">
                <label className="form-label">EMAIL ADDRESS FOR DISPATCH CONFIRMATION</label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="form-input"
                  placeholder="name@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">PHONE NUMBER (FOR OTP & DELIVERY SMS)</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="form-input"
                  placeholder="+91 98200 00000"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full step-submit-btn">
                <span>CONTINUE TO SHIPPING ADDRESS</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* STEP 2: SHIPPING ADDRESS */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="checkout-step-form fade-in">
              <div className="step-heading-row">
                <h2 className="step-title">2. SHIPPING DESTINATION</h2>
                <button
                  type="button"
                  className="step-back-link"
                  onClick={() => setStep('info')}
                >
                  <ArrowLeft size={14} />
                  <span>EDIT CONTACT</span>
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">FULL RECIPIENT NAME</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="form-input"
                  placeholder="Aarav Sharma"
                />
              </div>

              <div className="form-group">
                <label className="form-label">STREET ADDRESS (HOUSE / BUILDING / FLOOR)</label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="form-input"
                  placeholder="Flat 402, Highline Residency"
                />
              </div>

              <div className="form-group">
                <label className="form-label">LANDMARK / APARTMENT (OPTIONAL)</label>
                <input
                  type="text"
                  value={address.addressLine2 || ''}
                  onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                  className="form-input"
                  placeholder="Near Starbucks / Bandra West"
                />
              </div>

              <div className="form-row-three">
                <div className="form-group">
                  <label className="form-label">PINCODE</label>
                  <input
                    type="text"
                    required
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="form-input"
                    placeholder="400050"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CITY</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="form-input"
                    placeholder="Mumbai"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">STATE</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="form-input"
                    placeholder="Maharashtra"
                  />
                </div>
              </div>

              <div className="shipping-option-card active">
                <div className="ship-opt-left">
                  <Truck size={18} />
                  <div>
                    <span className="ship-opt-title">AIR EXPRESS COURIER (BLUEDART / DELHI VERY)</span>
                    <span className="ship-opt-sub">2–3 BUSINESS DAYS METRO GUARANTEE</span>
                  </div>
                </div>
                <span className="ship-opt-price">
                  {shippingFee === 0 ? 'COMPLIMENTARY' : BRAND.currency.format(shippingFee)}
                </span>
              </div>

              <button type="submit" className="btn btn-primary btn-full step-submit-btn">
                <span>PROCEED TO PAYMENT</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="checkout-step-form fade-in">
              <div className="step-heading-row">
                <h2 className="step-title">3. PAYMENT METHOD</h2>
                <button
                  type="button"
                  className="step-back-link"
                  onClick={() => setStep('shipping')}
                >
                  <ArrowLeft size={14} />
                  <span>EDIT SHIPPING</span>
                </button>
              </div>

              <div className="payment-methods-stack">
                {/* Method 1: UPI */}
                <label
                  className={`payment-method-tile ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="tile-radio-row">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                    />
                    <span className="tile-title">UPI / GOOGLE PAY / PHONEPE / CRED</span>
                    <QrCode size={18} className="tile-icon" />
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="payment-inner-details fade-in">
                      <label className="form-label">ENTER UPI VPA</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="form-input"
                        placeholder="yourname@okhdfcbank"
                        required
                      />
                      <span className="payment-note">
                        Collect request will be dispatched to your UPI application upon submission.
                      </span>
                    </div>
                  )}
                </label>

                {/* Method 2: Razorpay / Cards */}
                <label
                  className={`payment-method-tile ${paymentMethod === 'razorpay' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  <div className="tile-radio-row">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                    />
                    <span className="tile-title">RAZORPAY SECURE GATEWAY (ALL INDIAN BANKS & CARDS)</span>
                    <CreditCard size={18} className="tile-icon" />
                  </div>
                  {paymentMethod === 'razorpay' && (
                    <div className="payment-inner-details fade-in">
                      <span className="payment-note">
                        Supports Visa, Mastercard, RuPay, Netbanking, and Credit Card EMI.
                      </span>
                    </div>
                  )}
                </label>

                {/* Method 3: Credit/Debit Card Direct */}
                <label
                  className={`payment-method-tile ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="tile-radio-row">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <span className="tile-title">INTERNATIONAL CREDIT / DEBIT CARDS</span>
                    <CreditCard size={18} className="tile-icon" />
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="payment-inner-details fade-in">
                      <div className="form-group">
                        <label className="form-label">CARD NUMBER</label>
                        <input
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          className="form-input"
                        />
                      </div>
                      <div className="form-row-two">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="form-input"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="form-input"
                        />
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-full step-submit-btn">
                <span>AUTHORIZE PAYMENT — {BRAND.currency.format(total)}</span>
                <Lock size={16} />
              </button>
            </form>
          )}

          {/* STEP 4: CONFIRMATION */}
          {step === 'confirmation' && completedOrder && (
            <div className="checkout-confirmation-card fade-in">
              <div className="confirmation-header">
                <CheckCircle2 size={54} className="confirmation-check-icon" />
                <span className="mono-tag text-burnt-red">ORDER CONFIRMED // ALLOCATION RESERVED</span>
                <h2 className="confirmation-order-num">{completedOrder.orderNumber}</h2>
                <p className="confirmation-p">
                  A receipt and shipping tracking token have been dispatched to <strong>{completedOrder.shippingAddress.email}</strong>.
                </p>
              </div>

              <div className="order-details-box">
                <div className="detail-row">
                  <span className="d-label">CARRIER</span>
                  <span className="d-val">{completedOrder.carrier}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">TRACKING NUMBER</span>
                  <span className="d-val text-burnt-red">{completedOrder.trackingNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">DESTINATION</span>
                  <span className="d-val">
                    {completedOrder.shippingAddress.fullName}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.pincode}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="d-label">PAYMENT METHOD</span>
                  <span className="d-val">{completedOrder.paymentMethod.toUpperCase()} (PAID)</span>
                </div>
              </div>

              <div className="confirmation-actions">
                <button
                  className="btn btn-primary btn-full"
                  onClick={() => navigate('/account/orders')}
                >
                  <span>VIEW ORDER IN ACCOUNT</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  className="btn btn-outline-light btn-full"
                  onClick={() => navigate('/shop')}
                >
                  <span>CONTINUE SHOPPING</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Order Summary (Visible in steps 1, 2, 3) */}
        {step !== 'confirmation' && (
          <div className="checkout-summary-column">
            <div className="checkout-summary-card">
              <h3 className="chk-summary-title">BAG ALLOCATION</h3>

              <div className="chk-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="chk-item-row">
                    <div className="chk-item-thumb">
                      <img src={item.product.images[0]} alt={item.product.name} />
                      <span className="chk-item-badge">{item.quantity}</span>
                    </div>
                    <div className="chk-item-info">
                      <span className="chk-item-name">{item.product.name}</span>
                      <span className="chk-item-spec">SIZE {item.size} // {item.color}</span>
                    </div>
                    <span className="chk-item-price">
                      {BRAND.currency.format(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="chk-totals-stack">
                <div className="t-row">
                  <span>SUBTOTAL</span>
                  <span>{BRAND.currency.format(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="t-row text-success">
                    <span>DISCOUNT</span>
                    <span>-{BRAND.currency.format(discount)}</span>
                  </div>
                )}
                <div className="t-row">
                  <span>EXPRESS AIR SHIPPING</span>
                  <span>{shippingFee === 0 ? 'COMPLIMENTARY' : BRAND.currency.format(shippingFee)}</span>
                </div>
                <div className="t-row total-t-row">
                  <span>FINAL PAYABLE</span>
                  <span className="final-price">{BRAND.currency.format(total)}</span>
                </div>
              </div>

              <div className="chk-assurance-note">
                <ShieldCheck size={16} />
                <span>OFFICIAL DON GUARANTEE // 7-DAY DOORSTEP EXCHANGES</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
