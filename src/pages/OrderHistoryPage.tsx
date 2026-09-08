import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../config/brand';
import { Package, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import './AccountPage.css';

interface OrderHistoryPageProps {
  navigate: (path: string) => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ navigate }) => {
  const { orders } = useAuth();

  return (
    <div className="account-page bg-almost-black">
      <div className="container account-page-container">
        <button className="pdp-back-btn" onClick={() => navigate('/account')}>
          <ArrowLeft size={16} />
          <span>RETURN TO DASHBOARD</span>
        </button>

        <div className="account-header" style={{ marginTop: '20px' }}>
          <div>
            <span className="mono-tag">ARCHIVE PURCHASES</span>
            <h1 className="account-name-title">ORDER HISTORY</h1>
          </div>
          <span className="mono-tag text-burnt-red">{orders.length} TOTAL ALLOCATIONS</span>
        </div>

        <div className="orders-stack">
          {orders.map((ord) => (
            <div key={ord.id} className="order-history-card">
              <div className="order-card-header">
                <div>
                  <span className="order-num">{ord.orderNumber}</span>
                  <span className="order-date">
                    CONFIRMED ON {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <span className={`status-badge status-${ord.status}`}>
                  {ord.status.toUpperCase()}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-summary-row">
                  <span className="order-sub-stat">
                    {ord.items.length > 0 ? `${ord.items.length} PIECES ALLOCATED` : '2 PIECES (OBSIDIAN TEE + SHADOW HOODIE)'}
                  </span>
                  <span className="order-total-price">
                    TOTAL: {BRAND.currency.format(ord.total)}
                  </span>
                </div>

                <div className="order-shipping-summary">
                  <span className="mono-tag">COURIER: {ord.carrier}</span>
                  <span className="tracking-token">TRACKING AIRWAY BILL: {ord.trackingNumber}</span>
                  <span className="mono-tag">DESTINATION: {ord.shippingAddress.city}, {ord.shippingAddress.state}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
