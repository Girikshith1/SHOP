import React from 'react';
import { COLLECTIONS } from '../data/collections';
import { ArrowRight, Layers } from 'lucide-react';
import './CollectionsPage.css';

interface CollectionsPageProps {
  navigate: (path: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ navigate }) => {
  return (
    <div className="collections-index-page bg-almost-black">
      {/* Top Title Banner */}
      <div className="collections-banner">
        <div className="container">
          <div className="col-page-tag">
            <Layers size={16} className="text-burnt-red" />
            <span className="mono-tag">SEASONAL ARCHIVE ANTHOLOGY</span>
          </div>
          <h1 className="collections-page-title">COLLECTIONS</h1>
          <p className="collections-page-subtitle">
            Curated thematic capsules engineered under cohesive narrative arcs. Each capsule represents an uncompromising chapter in our design continuum.
          </p>
        </div>
      </div>

      {/* Collection Cards List */}
      <div className="container collections-list-container">
        <div className="collections-stack">
          {COLLECTIONS.map((col, index) => (
            <div
              key={col.id}
              className="collection-editorial-card"
              onClick={() => navigate(`/collection/${col.slug}`)}
            >
              <div className="col-card-media img-zoom-container">
                <img src={col.heroImage} alt={col.title} />
                <div className="col-card-overlay"></div>
              </div>

              <div className="col-card-info">
                <div className="col-card-meta">
                  <span className="mono-tag text-burnt-red">
                    {col.season} // {col.year}
                  </span>
                  <span className="mono-tag">{col.productsCount} PIECES</span>
                </div>

                <div className="col-card-titles">
                  <span className="col-subtitle">{col.subtitle}</span>
                  <h2 className="col-title font-artistic">{col.title}</h2>
                  <blockquote className="col-statement">"{col.statement}"</blockquote>
                </div>

                <p className="col-desc">{col.description}</p>

                <div className="col-action-wrap">
                  <button className="btn btn-outline-light">
                    <span>EXPLORE ARCHIVE</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
