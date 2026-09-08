import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import './FAQPage.css';

interface FAQPageProps {
  navigate: (path: string) => void;
}

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'SIZING & SILHOUETTES',
    q: 'HOW DO DON GARMENTS FIT?',
    a: 'Every piece is engineered with an intentional drop-shoulder boxy drape, generous chest clearance, and structured fall. For our signature relaxed streetwear silhouette, choose your regular true size. If you want extreme oversized volume, order one size larger.',
  },
  {
    category: 'SIZING & SILHOUETTES',
    q: 'WHAT DOES 280 GSM OR 460 GSM MEAN?',
    a: 'GSM stands for Grams per Square Meter. Conventional high-street tees are 140–180 GSM. DON t-shirts are custom-milled at 280 GSM (ultra-dense combed cotton), while our hoodies and crewnecks use monumental 400–460 GSM loopback French Terry that never collapses.',
  },
  {
    category: 'DROPS & RESTOCKS',
    q: 'WILL DROP 001 PIECES EVER RESTOCK?',
    a: 'No. We enforce a strict permanent zero-restock philosophy. When an edition sells out, its production dies. This ensures exclusivity and protects the integrity of those who supported the drop.',
  },
  {
    category: 'DROPS & RESTOCKS',
    q: 'HOW DO I SECURE DROP TICKETS OR INNER CIRCLE CODES?',
    a: 'Subscribe to our Inner Circle newsletter at the bottom of the homepage or register an account. Inner Circle members receive access links 15 minutes before the public drop announcement on Instagram.',
  },
  {
    category: 'SHIPPING & EXCHANGES',
    q: 'WHAT ARE THE SHIPPING TIMELINES ACROSS INDIA?',
    a: 'All orders are dispatched via BlueDart Air Express or Delhivery from our Mumbai facility within 24 hours. Metro deliveries arrive in 2–3 business days. Non-metro destinations arrive in 4–5 business days.',
  },
  {
    category: 'SHIPPING & EXCHANGES',
    q: 'WHAT IS YOUR EXCHANGE POLICY IF SIZE DOES NOT FIT?',
    a: 'We offer hassle-free doorstep size exchanges within 7 days of delivery anywhere in India. Our courier will pick up the item directly from your address and exchange it for your requested size.',
  },
  {
    category: 'PAYMENTS & TRANSACTIONS',
    q: 'WHAT PAYMENT MODES ARE SUPPORTED?',
    a: 'We support all major Indian payment rails including UPI (Google Pay, PhonePe, Paytm, CRED), Credit/Debit cards (Visa, Mastercard, RuPay, Amex), and Netbanking through our encrypted payment gateway.',
  },
];

export const FAQPage: React.FC<FAQPageProps> = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page bg-almost-black">
      <div className="faq-hero-banner">
        <div className="container">
          <span className="mono-tag text-burnt-red">CLIENT PROTOCOLS & ANSWERS</span>
          <h1 className="faq-hero-title">FREQUENTLY ASKED QUESTIONS</h1>
          <p className="faq-hero-desc">
            Technical specifications, sizing guides, drop schedules, and exchange policies.
          </p>
        </div>
      </div>

      <div className="container-reading faq-body-container">
        <div className="faq-accordion-stack">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className={`faq-card-item ${isOpen ? 'active' : ''}`}>
                <button
                  className="faq-question-btn"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <div className="q-left">
                    <span className="faq-cat-tag">{faq.category}</span>
                    <h3 className="faq-question-text">{faq.q}</h3>
                  </div>
                  {isOpen ? <ChevronUp size={18} className="faq-chevron" /> : <ChevronDown size={18} className="faq-chevron" />}
                </button>

                {isOpen && (
                  <div className="faq-answer-content fade-in">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
