import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { ArrowRight, Check, Key } from 'lucide-react';
import './NewsletterSection.css';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('INVALID EMAIL', 'Please provide a valid address', 'alert');
      return;
    }
    setIsSubscribed(true);
    showToast('KEY ISSUED', 'You are now registered for Drop 002 early access', 'success');
  };

  return (
    <section className="newsletter-section bg-olive-green" aria-label="Inner Circle Newsletter">
      <div className="container newsletter-container">
        <div className="newsletter-badge">
          <Key size={15} />
          <span className="mono-tag">VIP ACCESS // PRIVATE PROTOCOL</span>
        </div>

        <h2 className="newsletter-heading">
          ENTER THE INNER CIRCLE.
        </h2>

        <p className="newsletter-supporting">
          GET EARLY ACCESS TO DROPS, EXCLUSIVE RELEASES AND PRIVATE OFFERS. 15 MINUTES BEFORE PUBLIC DISCOVERY.
        </p>

        {isSubscribed ? (
          <div className="subscribed-success-card fade-in">
            <Check size={20} className="check-success-icon" />
            <span className="success-msg">
              ACCESS PASS ALLOCATED TO {email.toUpperCase()}. CHECK YOUR INBOX PRIOR TO NEXT DROP.
            </span>
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="newsletter-input-group">
              <input
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-email-input"
                aria-label="Your email address"
              />
              <button type="submit" className="btn btn-dark newsletter-join-btn">
                <span>JOIN</span>
                <ArrowRight size={18} />
              </button>
            </div>
            <span className="newsletter-disclaimer">
              STRICT PRIVACY. ZERO SPAM. ONLY TIME-SENSITIVE DROP ALERTS.
            </span>
          </form>
        )}
      </div>
    </section>
  );
};
