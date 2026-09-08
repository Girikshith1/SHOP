import React from 'react';
import './LegalPage.css';

interface TermsConditionsPageProps {
  navigate: (path: string) => void;
}

export const TermsConditionsPage: React.FC<TermsConditionsPageProps> = () => {
  return (
    <div className="legal-page bg-almost-black">
      <div className="legal-hero-banner">
        <div className="container">
          <span className="mono-tag text-burnt-red">LEGAL CODEX // DROP TERMS</span>
          <h1 className="legal-title">TERMS & CONDITIONS</h1>
          <p className="legal-desc">Effective Date: January 1, 2026. Governing Law: Mumbai, Maharashtra, India.</p>
        </div>
      </div>

      <div className="container-reading legal-body font-editorial">
        <section className="legal-section">
          <h2>1. EXCLUSIVE DROP SALES POLICY</h2>
          <p>
            All garments and accessories manufactured by DON are created in strictly limited, numbered units. Placing an article in your digital shopping bag does not permanently reserve inventory until payment has been authorized and an Order Number is generated.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. ANTI-BOT & RESELLER REGULATIONS</h2>
          <p>
            DON reserves the explicit authority to cancel, without prior warning, any order suspected of automated bot purchasing, fraudulent payment methods, or scalping activities. Orders with identical shipping addresses exceeding 3 units per silhouette will be flagged for manual review.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. PRICING & INDIAN RUPEE BILLING</h2>
          <p>
            All displayed prices are denominated in Indian Rupees (₹ INR) and include all applicable GST. We reserve the right to correct typographical pricing discrepancies prior to fulfillment.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. INTELLECTUAL PROPERTY</h2>
          <p>
            All brand trademarks, typographic configurations, designs, lookbook campaign imagery, codebases, and silhouettes remain the exclusive intellectual property of DON Studio. Unauthorized commercial duplication is prohibited by law.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. DISPUTE RESOLUTION</h2>
          <p>
            Any disputes arising out of purchases from DON shall be resolved under the jurisdiction of the courts of Mumbai, Maharashtra, India.
          </p>
        </section>
      </div>
    </div>
  );
};
