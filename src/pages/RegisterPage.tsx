import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ShieldCheck, Key } from 'lucide-react';
import './AuthPages.css';

interface RegisterPageProps {
  navigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    register(name, email);
    navigate('/account');
  };

  return (
    <div className="auth-page-view bg-almost-black">
      <div className="container-reading auth-container">
        <div className="auth-card-panel">
          <div className="auth-card-header">
            <span className="mono-tag text-burnt-red">VIP ACCESS ALLOCATION</span>
            <h1 className="auth-title">CREATE ACCOUNT</h1>
            <p className="auth-sub">
              Register for immediate access to Tier 01 drop notices, express checkout, and permanent archive tracking.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-fields">
            <div className="form-group">
              <label className="form-label">FULL NAME</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">EMAIL ADDRESS</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">SECURE PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="form-input"
              />
            </div>

            <div className="auth-perks-checklist">
              <div className="perk-item">
                <Key size={14} className="text-burnt-red" />
                <span>Immediate 15-minute priority access to upcoming limited releases</span>
              </div>
              <div className="perk-item">
                <ShieldCheck size={14} className="text-burnt-red" />
                <span>Complimentary doorstep size exchanges on all domestic deliveries</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full auth-btn">
              <span>JOIN INNER CIRCLE</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer-prompt">
            <span>ALREADY REGISTERED?</span>
            <button className="auth-switch-btn" onClick={() => navigate('/login')}>
              SIGN IN TO YOUR PROFILE →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
