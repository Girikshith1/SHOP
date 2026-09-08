import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../config/brand';
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import './AccountPage.css';

interface AccountPageProps {
  navigate: (path: string) => void;
}

type AccountTab = 'profile' | 'orders' | 'addresses' | 'settings';

export const AccountPage: React.FC<AccountPageProps> = ({ navigate }) => {
  const { user, isAuthenticated, logout, orders } = useAuth();
  const [activeTab, setActiveTab] = useState<AccountTab>('profile');

  if (!isAuthenticated || !user) {
    return (
      <div className="account-unauth-view bg-almost-black">
        <div className="container-reading unauth-box">
          <User size={48} className="unauth-icon" />
          <h2 className="unauth-title">IDENTIFICATION REQUIRED</h2>
          <p className="unauth-p">Please sign in to access your Inner Circle portal and past order archives.</p>
          <div className="unauth-btn-row">
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              <span>SIGN IN</span>
            </button>
            <button className="btn btn-outline-light" onClick={() => navigate('/register')}>
              <span>CREATE ACCOUNT</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page bg-almost-black">
      <div className="container account-page-container">
        {/* Header with Member Tier */}
        <div className="account-header">
          <div className="account-user-badge">
            <span className="mono-tag text-burnt-red">STATUS // {user.memberTier}</span>
            <h1 className="account-name-title">{user.name}</h1>
            <span className="account-email-tag">{user.email}</span>
          </div>

          <div className="account-tier-badge">
            <ShieldCheck size={18} className="text-burnt-red" />
            <div>
              <span className="tier-name">DROP ALLOCATION TIER 01</span>
              <span className="tier-sub">PRIORITY DISPATCH ENABLED</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="account-tabs-bar">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} />
            <span>PROFILE</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={16} />
            <span>ORDERS ({orders.length})</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <MapPin size={16} />
            <span>ADDRESSES</span>
          </button>
          <button
            className="tab-btn"
            onClick={() => navigate('/wishlist')}
          >
            <Heart size={16} />
            <span>SAVED ITEMS</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={16} />
            <span>SETTINGS</span>
          </button>
          <button
            className="tab-btn tab-btn-logout"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <LogOut size={16} />
            <span>SIGN OUT</span>
          </button>
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <div className="account-tab-panel fade-in">
            <div className="profile-details-grid">
              <div className="info-card">
                <span className="mono-tag">PERSONAL INFORMATION</span>
                <div className="data-field">
                  <span className="field-lbl">FULL NAME</span>
                  <span className="field-val">{user.name}</span>
                </div>
                <div className="data-field">
                  <span className="field-lbl">EMAIL</span>
                  <span className="field-val">{user.email}</span>
                </div>
                <div className="data-field">
                  <span className="field-lbl">CONTACT NUMBER</span>
                  <span className="field-val">{user.phone || 'NOT CONFIGURED'}</span>
                </div>
                <div className="data-field">
                  <span className="field-lbl">MEMBER SINCE</span>
                  <span className="field-val">{user.joinedDate}</span>
                </div>
              </div>

              <div className="info-card">
                <span className="mono-tag">INNER CIRCLE BENEFITS</span>
                <ul className="benefits-list">
                  <li>✦ 15-Minute early drop access tokens</li>
                  <li>✦ Complimentary doorstep exchanges</li>
                  <li>✦ VIP Concierge access via private line</li>
                  <li>✦ Direct atelier invitations in Mumbai</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="account-tab-panel fade-in">
            <div className="orders-stack">
              {orders.length === 0 ? (
                <div className="no-orders-box">
                  <Package size={36} className="text-muted" />
                  <p>NO ORDERS FOUND IN THIS ARCHIVE</p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="order-history-card">
                    <div className="order-card-header">
                      <div>
                        <span className="order-num">{ord.orderNumber}</span>
                        <span className="order-date">
                          PLACED ON {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <span className={`status-badge status-${ord.status}`}>
                        {ord.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="order-card-body">
                      <div className="order-summary-row">
                        <span className="order-sub-stat">
                          {ord.items.length > 0 ? `${ord.items.length} ITEMS` : '2 ITEMS (DROP 001 PIECES)'}
                        </span>
                        <span className="order-total-price">
                          TOTAL: {BRAND.currency.format(ord.total)}
                        </span>
                      </div>

                      <div className="order-shipping-summary">
                        <span className="mono-tag">DELIVERING VIA {ord.carrier}</span>
                        <span className="tracking-token">TRACKING: {ord.trackingNumber}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Addresses */}
        {activeTab === 'addresses' && (
          <div className="account-tab-panel fade-in">
            <div className="addresses-grid">
              {user.savedAddresses.map((addr, idx) => (
                <div key={idx} className="address-card">
                  <div className="address-top">
                    <span className="mono-tag">PRIMARY SHIPPING ADDRESS</span>
                    <span className="badge badge-dark">DEFAULT</span>
                  </div>
                  <p className="addr-name">{addr.fullName}</p>
                  <p className="addr-line">{addr.addressLine1}</p>
                  {addr.addressLine2 && <p className="addr-line">{addr.addressLine2}</p>}
                  <p className="addr-line">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="addr-line">{addr.country}</p>
                  <p className="addr-phone">PHONE: {addr.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="account-tab-panel fade-in">
            <div className="settings-panel-box">
              <span className="mono-tag">PREFERENCES & NOTIFICATIONS</span>
              <div className="settings-toggle-row">
                <div>
                  <span className="setting-title">DROP ALERTS VIA SMS</span>
                  <span className="setting-desc">Receive SMS 15 minutes before public drop launch</span>
                </div>
                <input type="checkbox" defaultChecked className="setting-checkbox" />
              </div>
              <div className="settings-toggle-row">
                <div>
                  <span className="setting-title">EMAIL EDITORIAL BULLETINS</span>
                  <span className="setting-desc">Campaign lookbooks and private collection invitations</span>
                </div>
                <input type="checkbox" defaultChecked className="setting-checkbox" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
