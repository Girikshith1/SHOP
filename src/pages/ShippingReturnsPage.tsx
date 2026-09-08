import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react';
import './ShippingReturnsPage.css';

interface ShippingReturnsPageProps {
  navigate: (path: string) => void;
}

export const ShippingReturnsPage: React.FC<ShippingReturnsPageProps> = ({ navigate }) => {
  return (
    <div className="shipping-returns-page bg-almost-black">
      <div className="shipping-hero-banner">
        <div className="container">
          <span className="mono-tag text-burnt-red">LOGISTICS & POLICY PROTOCOLS</span>
          <h1 className="shipping-hero-title">SHIPPING & RETURNS</h1>
          <p className="shipping-hero-desc">
            Express domestic delivery network across India, door-to-door courier dispatch, and simple 7-day doorstep exchanges.
          </p>
        </div>
      </div>

      <div className="container-reading shipping-content-container">
        {/* Metric Cards Row */}
        <div className="shipping-stats-grid">
          <div className="ship-stat-box">
            <Truck size={24} className="text-burnt-red" />
            <span className="stat-title">FREE OVER ₹2,999</span>
            <span className="stat-desc">Complimentary BlueDart Air Express on domestic orders</span>
          </div>

          <div className="ship-stat-box">
            <Clock size={24} className="text-burnt-red" />
            <span className="stat-title">2–3 DAYS METRO</span>
            <span className="stat-desc">Dispatched within 24 hours from Mumbai hub</span>
          </div>

          <div className="ship-stat-box">
            <RotateCcw size={24} className="text-burnt-red" />
            <span className="stat-title">7-DAY EXCHANGES</span>
            <span className="stat-desc">Seamless doorstep size replacement service</span>
          </div>
        </div>

        {/* Section 1: Shipping */}
        <div className="policy-section">
          <h2 className="policy-heading">DOMESTIC SHIPPING PROTOCOLS</h2>
          <div className="policy-body font-editorial">
            <p>
              Every order placed on DON is treated with surgical care. Items are wrapped in matte black protective film, sealed in custom heavyweight tamper-evident boxes, and handed over to our primary logistics partner, <strong>BlueDart Air Express</strong> or <strong>Delhivery</strong>.
            </p>
            <table className="policy-table">
              <thead>
                <tr>
                  <th>ORDER VALUE</th>
                  <th>METRO DELIVERY</th>
                  <th>SHIPPING FEE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Above ₹2,999</td>
                  <td>2–3 Business Days</td>
                  <td className="text-success">COMPLIMENTARY</td>
                </tr>
                <tr>
                  <td>Below ₹2,999</td>
                  <td>2–4 Business Days</td>
                  <td>₹250 FLAT RATE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Returns & Exchanges */}
        <div className="policy-section">
          <h2 className="policy-heading">7-DAY DOORSTEP EXCHANGES</h2>
          <div className="policy-body font-editorial">
            <p>
              We understand that streetwear silhouettes require precise volume. If your chosen size does not meet your expectations, we offer <strong>complimentary doorstep exchanges within 7 days</strong> of confirmed delivery.
            </p>
            <p>
              To initiate an exchange:
            </p>
            <ol className="policy-steps">
              <li>1. Reach out to our concierge via email at <code>concierge@donstreetwear.com</code> or WhatsApp with your Order ID.</li>
              <li>2. Specify the replacement size or alternative silhouette required.</li>
              <li>3. Our courier will pick up the unwashed, unworn item with original tags attached directly from your doorstep.</li>
              <li>4. The replacement article is dispatched upon reverse-pickup confirmation.</li>
            </ol>
          </div>
        </div>

        {/* Section 3: Damaged or Incorrect Articles */}
        <div className="policy-section">
          <h2 className="policy-heading">DAMAGED OR DEFECTIVE SHIPMENTS</h2>
          <div className="policy-body font-editorial">
            <p>
              In the unlikely event that your delivery parcel arrives damaged, wet, or tampered with, please take photographs immediately and notify our team within 24 hours. A full replacement or full refund will be credited back to your original source within 48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
