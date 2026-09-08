import React from 'react';
import './BrandIntroduction.css';

export const BrandIntroduction: React.FC = () => {
  return (
    <section className="brand-intro-section bg-almost-black" aria-label="Brand Philosophy">
      <div className="container-editorial intro-container">
        <div className="intro-badge-row">
          <span className="mono-tag">MANIFESTO // 001</span>
          <div className="intro-line"></div>
        </div>

        <blockquote className="intro-quote">
          <span className="quote-part part-1">DON IS NOT MADE TO FIT IN.</span>
          <span className="quote-part part-2 text-burnt-red">IT IS MADE TO BE WORN</span>
          <span className="quote-part part-3">WITHOUT PERMISSION.</span>
        </blockquote>

        <div className="intro-footer-row">
          <p className="intro-subtext">
            We reject the disposable velocity of fast-fashion hype. Every cut is engineered with uncompromising weight, anatomical draping, and monochrome minimalism built to outlive seasons.
          </p>
          <div className="intro-signature">
            <span className="sig-brand">DON STUDIO</span>
            <span className="sig-loc">MUMBAI // NO RESTOCKS</span>
          </div>
        </div>
      </div>
    </section>
  );
};
