import React from 'react';
import './BrandStatementSection.css';

export const BrandStatementSection: React.FC = () => {
  return (
    <section className="brand-statement-section bg-almost-black" aria-label="Brand Manifesto Statement">
      <div className="container statement-content">
        <div className="statement-top-marker">
          <span className="mono-tag">MANIFESTO // EDITORIAL CODEX</span>
          <span className="marker-hash">#09</span>
        </div>

        <div className="statement-lockup">
          <h2 className="statement-line line-bebas">
            WE DON'T FOLLOW
          </h2>
          <h2 className="statement-line line-crisis font-artistic text-burnt-red">
            THE CULTURE.
          </h2>
          <h2 className="statement-line line-bebas">
            WE CREATE
          </h2>
          <h2 className="statement-line line-stroke">
            OUR OWN.
          </h2>
        </div>

        <div className="statement-bottom-grid">
          <p className="statement-paragraph">
            DON operates in the tension between architectural minimalism and brutalist youth subculture. We design strictly for individuals who define their own aesthetic coordinates.
          </p>
          <div className="statement-stats">
            <span className="stat-big">001</span>
            <span className="stat-desc">PERMANENT REJECTION OF COMPROMISE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
