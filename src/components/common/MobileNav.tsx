import React from 'react';
import { BRAND } from '../../config/brand';
import { useWishlist } from '../../context/WishlistContext';
import { X, ArrowRight } from 'lucide-react';
import { InstagramIcon, DiscordIcon } from './Icons';
import './MobileNav.css';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  navigate,
  onOpenSearch,
}) => {
  const { wishlistCount } = useWishlist();

  if (!isOpen) return null;

  const handleLinkClick = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <div className="mobile-nav-overlay fade-in" role="dialog" aria-modal="true">
      <div className="mobile-nav-panel slide-in-right">
        {/* Top Header */}
        <div className="mobile-nav-top">
          <div className="mobile-nav-brand">
            <span>{BRAND.name}</span>
            <span className="dot"></span>
          </div>
          <button className="mobile-nav-close" onClick={onClose} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        {/* Primary Editorial Links */}
        <div className="mobile-nav-body">
          <nav className="mobile-nav-menu">
            <ul className="mobile-nav-list">
              <li>
                <button
                  className="mobile-nav-item"
                  onClick={() => handleLinkClick('/shop')}
                >
                  <span className="item-num">01</span>
                  <span className="item-text">SHOP ALL</span>
                  <ArrowRight size={20} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  className="mobile-nav-item item-highlight"
                  onClick={() => handleLinkClick('/new-drop')}
                >
                  <span className="item-num">02</span>
                  <span className="item-text">NEW DROP 001</span>
                  <span className="item-badge">LIVE</span>
                </button>
              </li>
              <li>
                <button
                  className="mobile-nav-item"
                  onClick={() => handleLinkClick('/collections')}
                >
                  <span className="item-num">03</span>
                  <span className="item-text">COLLECTIONS</span>
                  <ArrowRight size={20} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  className="mobile-nav-item"
                  onClick={() => handleLinkClick('/about')}
                >
                  <span className="item-num">04</span>
                  <span className="item-text">ABOUT THE BRAND</span>
                  <ArrowRight size={20} className="item-arrow" />
                </button>
              </li>
            </ul>
          </nav>

          {/* Quick Categories Bar */}
          <div className="mobile-nav-categories">
            <span className="cat-label">QUICK CATEGORIES</span>
            <div className="cat-tags">
              <button onClick={() => handleLinkClick('/category/tees')}>TEES</button>
              <button onClick={() => handleLinkClick('/category/hoodies')}>HOODIES</button>
              <button onClick={() => handleLinkClick('/category/cargos')}>CARGOS</button>
              <button onClick={() => handleLinkClick('/category/outerwear')}>OUTERWEAR</button>
            </div>
          </div>

          {/* Utility Links */}
          <div className="mobile-nav-secondary">
            <button
              className="sec-link"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
            >
              SEARCH CATALOG
            </button>
            <button className="sec-link" onClick={() => handleLinkClick('/wishlist')}>
              WISHLIST ({wishlistCount})
            </button>
            <button className="sec-link" onClick={() => handleLinkClick('/account')}>
              ACCOUNT & ORDERS
            </button>
            <button className="sec-link" onClick={() => handleLinkClick('/contact')}>
              CONCIERGE & HELP
            </button>
          </div>
        </div>

        {/* Bottom Statement & Socials */}
        <div className="mobile-nav-footer">
          <p className="mobile-brand-quote">
            "{BRAND.subTagline}"
          </p>
          <div className="mobile-socials">
            <a href={BRAND.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon size={18} />
            </a>
            <a href={BRAND.socials.discord} target="_blank" rel="noreferrer" aria-label="Discord">
              <DiscordIcon size={18} />
            </a>
            <span className="mobile-copy">© {BRAND.name} 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
