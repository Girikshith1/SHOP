import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import './HeroSection.css';

interface HeroSectionProps {
  navigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ navigate }) => {
  return (
    <section className="hero-section" aria-label="Hero Showcase">
      {/* Background Cinematic Visual with Dark Gradient Vignette */}
      <div className="hero-backdrop-media">
        <img
          src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1600&q=80"
          alt="DON Streetwear Campaign Editorial"
          className="hero-img"
          decoding="async"
        />
        <div className="hero-vignette-overlay"></div>
      </div>

      <div className="container hero-content-container">
        <div className="hero-text-block">
          {/* Top Pill / Badge */}
          <div className="hero-meta-badge">
            <Flame size={14} className="badge-flame-icon" />
            <span className="mono-tag">SEASON 01 // DROP 001 LIVE</span>
          </div>

          {/* Typography System: Bebas Neue + Climate Crisis */}
          <div className="hero-headings-lockup">
            <span className="hero-eyebrow">NEW SEASON</span>
            <h1 className="hero-main-title">
              <span className="title-bebas">DON'T</span>
              <span className="title-artistic">FOLLOW.</span>
            </h1>
          </div>

          <p className="hero-subparagraph">
            Engineered heavyweight streetwear for those who carve their own trajectory through the nocturnal grid. Zero restocks.
          </p>

          {/* CTA Buttons */}
          <div className="hero-actions-row">
            <button
              className="btn btn-primary btn-lg hero-cta-btn"
              onClick={() => navigate('/new-drop')}
            >
              <span>SHOP THE DROP</span>
              <ArrowRight size={20} className="cta-arrow" />
            </button>

            <button
              className="btn btn-outline-light btn-lg hero-secondary-btn"
              onClick={() => navigate('/collections')}
            >
              <span>EXPLORE LOOKBOOK</span>
            </button>
          </div>

          {/* Key Streetwear Specs Bar */}
          <div className="hero-specs-strip">
            <div className="spec-stat">
              <span className="stat-num">280–460</span>
              <span className="stat-lbl">GSM HEAVYWEIGHT</span>
            </div>
            <div className="spec-stat-divider">/</div>
            <div className="spec-stat">
              <span className="stat-num">100%</span>
              <span className="stat-lbl">COMBED COTTON</span>
            </div>
            <div className="spec-stat-divider">/</div>
            <div className="spec-stat">
              <span className="stat-num">LIMITED</span>
              <span className="stat-lbl">NUMBERED PIECES</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
