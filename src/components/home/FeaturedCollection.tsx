import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import './FeaturedCollection.css';

interface FeaturedCollectionProps {
  navigate: (path: string) => void;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({ navigate }) => {
  return (
    <section className="featured-campaign-section bg-deep-teal" aria-label="Featured Collection">
      <div className="container campaign-layout-grid">
        {/* Left Editorial Text & Typographic Statement */}
        <div className="campaign-info-col">
          <div className="campaign-tag-line">
            <Sparkles size={14} className="sparkle-teal" />
            <span className="mono-tag">CAMPAIGN SPREAD 01 // 2026</span>
          </div>

          <div className="campaign-title-group">
            <span className="campaign-lead-word">COLLECTION</span>
            <h2 className="campaign-headline font-artistic">
              AFTER<br />DARK
            </h2>
          </div>

          <p className="campaign-bold-statement">
            THE CITY DOESN'T SLEEP. NEITHER DO WE.
          </p>

          <p className="campaign-description">
            Photographed under sodium-vapor streetlamps and industrial crane corridors between midnight and dawn. Structured garments designed to absorb the shadows and reflect the pulse of the metropolitan underground.
          </p>

          <div className="campaign-cta-row">
            <button
              className="btn btn-light btn-lg"
              onClick={() => navigate('/collection/after-dark')}
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="campaign-specs-footer">
            <div className="spec-item">
              <span className="spec-val">08 PIECES</span>
              <span className="spec-lbl">CAPSULE CAPACITY</span>
            </div>
            <div className="spec-item">
              <span className="spec-val">HEAVYWEIGHT</span>
              <span className="spec-lbl">CUSTOM FABRICATIONS</span>
            </div>
          </div>
        </div>

        {/* Right Asymmetric Editorial Images */}
        <div className="campaign-visual-spread">
          <div className="editorial-main-image-wrap img-zoom-container">
            <img
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=88"
              alt="After Dark Editorial Shoot"
              className="editorial-main-img"
            />
            <div className="img-corner-tag">03:14 AM // DOCKS</div>
          </div>

          <div className="editorial-secondary-image-wrap img-zoom-container">
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=85"
              alt="After Dark Detail Shot"
              className="editorial-second-img"
            />
            <div className="img-overlay-caption">
              <span>DOUBLE-LAYER FRENCH TERRY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
