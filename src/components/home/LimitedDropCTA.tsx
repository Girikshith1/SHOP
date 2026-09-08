import React from 'react';
import { ArrowRight, AlertOctagon } from 'lucide-react';
import './LimitedDropCTA.css';

interface LimitedDropCTAProps {
  navigate: (path: string) => void;
}

export const LimitedDropCTA: React.FC<LimitedDropCTAProps> = ({ navigate }) => {
  return (
    <section className="limited-drop-section bg-burnt-red" aria-label="Limited Drop Urgent Notice">
      <div className="container limited-drop-container">
        <div className="limited-badge-marker">
          <AlertOctagon size={16} />
          <span className="mono-tag">STRICT QUANTITY CEILING // ZERO RESTOCK POLICY</span>
        </div>

        <div className="limited-headings-lockup">
          <span className="limited-eyebrow">LIMITED DROP</span>
          <h2 className="limited-main-title">
            NO RESTOCKS.<br />
            NO SECOND CHANCES.
          </h2>
        </div>

        <p className="limited-subtext">
          When an edition reaches zero units in our Mumbai inventory hub, it is permanently closed. We do not reprint, reissue, or duplicate past drops.
        </p>

        <div className="limited-cta-btn-wrap">
          <button
            className="btn btn-light btn-lg limited-explore-btn"
            onClick={() => navigate('/new-drop')}
          >
            <span>EXPLORE NOW</span>
            <ArrowRight size={22} className="cta-arrow" />
          </button>
        </div>
      </div>
    </section>
  );
};
