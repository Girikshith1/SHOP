import React from 'react';
import { BRAND } from '../../config/brand';
import { ArrowUpRight } from 'lucide-react';
import { InstagramIcon, DiscordIcon } from './Icons';
import './Footer.css';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer bg-almost-black">
      <div className="container footer-content">
        {/* Top Brand Statement Column */}
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span className="logo-text">{BRAND.name}</span>
              <span className="logo-dot"></span>
            </div>
            <p className="footer-manifesto">
              {BRAND.philosophy}
            </p>
            <div className="footer-showroom-info">
              <span className="mono-label">SHOWROOM / STUDIO</span>
              <p>{BRAND.contact.showroom}</p>
              <p>{BRAND.contact.conciergeHours}</p>
            </div>
            <div className="footer-social-row">
              <a
                href={BRAND.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
                <span>INSTAGRAM</span>
              </a>
              <a
                href={BRAND.socials.discord}
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="Discord"
              >
                <DiscordIcon size={18} />
                <span>COMMUNITY</span>
              </a>
            </div>
          </div>

          {/* Nav Columns from Brand Config */}
          {BRAND.footerLinks.map((section) => (
            <div key={section.title} className="footer-col">
              <h4 className="footer-heading">{section.title}</h4>
              <ul className="footer-links-list">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="footer-link-item"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight size={14} className="link-arrow" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Currency & Drop Protocol */}
          <div className="footer-col">
            <h4 className="footer-heading">DROP PROTOCOL</h4>
            <p className="footer-protocol-text">
              All collections are manufactured in strictly numbered, limited quantities. We operate with zero restocks. Once an edition sells out, it enters our permanent archive.
            </p>
            <div className="currency-selector">
              <span className="mono-label">REGION / CURRENCY</span>
              <div className="currency-pill">
                <span>INDIA (₹ INR)</span>
                <span className="active-dot"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Massive Subtle Watermark Wordmark */}
        <div className="footer-watermark-container" aria-hidden="true">
          <span className="footer-watermark">{BRAND.name}</span>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} {BRAND.name} STUDIO. ALL RIGHTS RESERVED.
          </p>
          <p className="footer-tagline">
            {BRAND.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
};
