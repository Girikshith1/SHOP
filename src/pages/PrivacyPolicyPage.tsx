import React from 'react';
import './LegalPage.css';

interface PrivacyPolicyPageProps {
  navigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = () => {
  return (
    <div className="legal-page bg-almost-black">
      <div className="legal-hero-banner">
        <div className="container">
          <span className="mono-tag text-burnt-red">LEGAL CODEX // PRIVACY PROTOCOL</span>
          <h1 className="legal-title">PRIVACY POLICY</h1>
          <p className="legal-desc">Effective Date: January 1, 2026. Last Updated: March 2026.</p>
        </div>
      </div>

      <div className="container-reading legal-body font-editorial">
        <section className="legal-section">
          <h2>1. DATA WE COLLECT</h2>
          <p>
            When you interact with DON (including placing an order, registering an Inner Circle account, or subscribing to drop alerts), we collect necessary identifiers including your name, shipping address, billing address, phone number, and email address.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. PAYMENT SECURITY PROTOCOL</h2>
          <p>
            DON never stores raw credit or debit card numbers, CVVs, or netbanking passwords on our servers. All financial operations are processed via PCI-DSS Level 1 compliant gateway partners (including Razorpay). Transactions are secured using 256-bit TLS encryption.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. USE OF INFORMATION</h2>
          <p>
            We process your information exclusively to dispatch limited edition drop orders, provide doorstep courier tracking updates, prevent automated botting purchases during drops, and send member-exclusive early drop codes. We will never sell, trade, or monetize your personal data.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. COOKIES & LOCAL STORAGE</h2>
          <p>
            We utilize persistent local storage and essential cookies to maintain your shopping bag items, personal saved wishlist articles, and session state. You may clear your browser data at any time.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. CONTACT DATA PROTECTION OFFICER</h2>
          <p>
            For inquiries regarding data erasure or rectification, transmit an electronic request to <code>concierge@donstreetwear.com</code> with the subject line "DATA PRIVACY REQUEST".
          </p>
        </section>
      </div>
    </div>
  );
};
