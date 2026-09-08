import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import './EditorialLookbook.css';

interface EditorialLookbookProps {
  navigate: (path: string) => void;
}

export const EditorialLookbook: React.FC<EditorialLookbookProps> = ({ navigate }) => {
  return (
    <section className="editorial-lookbook-section bg-almost-black" aria-label="Editorial Lookbook Spread">
      <div className="container">
        {/* Editorial Header */}
        <div className="lookbook-header">
          <div className="lookbook-meta-stamp">
            <span className="mono-tag">CAMPAIGN LOOKBOOK</span>
            <span className="mono-tag">DROP 001 // AFTER DARK // 2026</span>
          </div>
          <h2 className="section-title-large">VISUAL ARCHIVE</h2>
        </div>

        {/* Asymmetric Editorial Collage */}
        <div className="lookbook-asymmetric-grid">
          {/* Card 1 - Large Tall Hero */}
          <div className="lookbook-cell cell-tall">
            <div className="cell-img-wrap img-zoom-container">
              <img
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85"
                alt="Obsidian Oversized Silhouette"
              />
              <div className="cell-overlay-tag">
                <span className="plate-num">PLATE 01</span>
                <span className="plate-desc">OBSIDIAN 280 GSM BOXY SILHOUETTE</span>
              </div>
            </div>
          </div>

          {/* Column with 2 Stacked Asymmetric images */}
          <div className="lookbook-cell-stack">
            <div className="lookbook-cell cell-wide">
              <div className="cell-img-wrap img-zoom-container">
                <img
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=85"
                  alt="Metropolitan Atmosphere"
                />
                <div className="cell-overlay-tag">
                  <span className="plate-num">PLATE 02</span>
                  <span className="plate-desc">TEXTURE ARCHITECTURE // INDUSTRIAL CONCRETE</span>
                </div>
              </div>
            </div>

            <div className="lookbook-quote-cell bg-deep-teal">
              <span className="mono-tag text-soft-grey">EXCERPT // NOTES</span>
              <p className="cell-quote-body">
                "We don't design for the daytime runway. We design for the quiet hours when the street belongs to the few."
              </p>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => navigate('/collections')}
              >
                <span>VIEW COMPLETE LOOKBOOK</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          {/* Card 3 - Medium Articulated */}
          <div className="lookbook-cell cell-medium">
            <div className="cell-img-wrap img-zoom-container">
              <img
                src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85"
                alt="Tactical Hardware Detail"
              />
              <div className="cell-overlay-tag">
                <span className="plate-num">PLATE 03</span>
                <span className="plate-desc">RIPSTOP ARTICULATION // FIDLOCK DETAILS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
