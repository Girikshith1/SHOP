import React from 'react';
import { COLLECTIONS } from '../data/collections';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { Product } from '../types/product';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './CollectionDetailPage.css';

interface CollectionDetailPageProps {
  collectionSlug: string;
  navigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const CollectionDetailPage: React.FC<CollectionDetailPageProps> = ({
  collectionSlug,
  navigate,
  onQuickView,
}) => {
  const collection =
    COLLECTIONS.find((c) => c.slug === collectionSlug) || COLLECTIONS[0];
  const collectionProducts = PRODUCTS.filter(
    (p) => p.collectionSlug === collection.slug || p.collection === collection.title
  );

  // Other collections for related section
  const otherCollections = COLLECTIONS.filter((c) => c.id !== collection.id);

  return (
    <div className="collection-detail-page bg-almost-black">
      {/* Full-width Cinematic Campaign Banner */}
      <div className="collection-hero-cinematic">
        <div className="collection-hero-media">
          <img src={collection.heroImage} alt={collection.title} />
          <div className="collection-hero-overlay"></div>
        </div>

        <div className="container collection-hero-content">
          <button
            className="back-btn"
            onClick={() => navigate('/collections')}
          >
            <ArrowLeft size={16} />
            <span>ALL COLLECTIONS</span>
          </button>

          <span className="mono-tag text-burnt-red">
            {collection.season} // {collection.year}
          </span>

          <h1 className="collection-headline font-artistic">
            {collection.title}
          </h1>

          <p className="collection-statement-quote">
            "{collection.statement}"
          </p>

          <p className="collection-editorial-long">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container collection-products-section">
        <div className="collection-grid-heading">
          <div>
            <span className="mono-tag">PIECES IN THIS DROP</span>
            <h2 className="section-title-large">COLLECTION ARCHIVE</h2>
          </div>
          <span className="mono-tag">{collectionProducts.length} ARTICLES</span>
        </div>

        <div className="grid-products-4">
          {collectionProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              navigate={navigate}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>

      {/* Editorial Spread / Lookbook Accent */}
      <div className="collection-lookbook-strip bg-deep-teal">
        <div className="container strip-inner">
          <div className="strip-text">
            <span className="mono-tag">EDITORIAL DOCUMENTATION</span>
            <h3 className="strip-title">THE METROPOLITAN NOCTURNE</h3>
            <p className="strip-p">
              Engineered exclusively for nocturnal movement. Every silhouette in this capsule underwent testing through rain, concrete abrasion, and nocturnal low temperatures.
            </p>
          </div>
          <div className="strip-img-wrap">
            <img src={collection.editorialImage} alt="Editorial documentation" />
          </div>
        </div>
      </div>

      {/* Related Collections */}
      <div className="container related-collections-section">
        <h3 className="section-title-medium">EXPLORE OTHER CHAPTERS</h3>
        <div className="related-collections-grid">
          {otherCollections.map((col) => (
            <div
              key={col.id}
              className="related-col-card"
              onClick={() => navigate(`/collection/${col.slug}`)}
            >
              <div className="related-img-wrap">
                <img src={col.heroImage} alt={col.title} />
              </div>
              <div className="related-col-info">
                <span className="mono-tag text-burnt-red">{col.season}</span>
                <h4 className="related-col-title font-artistic">{col.title}</h4>
                <div className="related-col-arrow">
                  <span>DISCOVER</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
