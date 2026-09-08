import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, Shield } from 'lucide-react';
import './AuthPages.css';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email);
    navigate('/account');
  };

  return (
    <div className="auth-page-view bg-almost-black">
      <div className="container-reading auth-container">
        <div className="auth-card-panel">
          <div className="auth-card-header">
            <span className="mono-tag text-burnt-red">VIP MEMBER AUTHENTICATION</span>
            <h1 className="auth-title">SIGN IN</h1>
            <p className="auth-sub">
              Access your drop order history, reserved allocations, and member-exclusive early drop windows.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-fields">
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
              <div className="label-with-aside">
                <label className="form-label">PASSWORD</label>
                <button
                  type="button"
                  className="auth-link-subtle"
                  onClick={() => alert('Password reset protocol sent.')}
                >
                  FORGOT?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full auth-btn">
              <span>AUTHENTICATE & ENTER</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer-prompt">
            <span>NOT YET REGISTERED IN THE INNER CIRCLE?</span>
            <button className="auth-switch-btn" onClick={() => navigate('/register')}>
              CREATE MEMBER ACCOUNT →
            </button>
          </div>

          <div className="auth-security-notice">
            <Shield size={14} />
            <span>PROTECTED BY RECAPTCHA & SECURE TOKENS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
