import React, { useState, useEffect } from 'react';
import { BRAND } from '../../config/brand';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Search, Heart, User, ShoppingBag, Menu } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
  currentPage?: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenMobileNav,
  currentPage = '/',
  navigate,
}) => {
  const { openCart, itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <header className={`site-header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-inner container">
        {/* Mobile Left: Menu Toggle */}
        <div className="header-mobile-toggle">
          <button
            className="header-icon-btn"
            onClick={onOpenMobileNav}
            aria-label="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Brand Logo */}
        <div className="header-brand">
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="brand-logo"
            aria-label={`${BRAND.name} Home`}
          >
            <span className="brand-logo-text">{BRAND.name}</span>
            <span className="brand-logo-dot"></span>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="header-nav-desktop" aria-label="Main Navigation">
          <ul className="nav-list">
            {BRAND.navLinks.map((link) => {
              const isActive = currentPage === link.href;
              return (
                <li key={link.href} className="nav-item">
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                  >
                    <span>{link.label}</span>
                    {link.badge && <span className="nav-badge-drop">{link.badge}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Header Action Icons */}
        <div className="header-actions">
          {/* Search Trigger */}
          <button
            className="action-link header-icon-btn"
            onClick={onOpenSearch}
            aria-label="Search Catalog"
            title="Search"
          >
            <Search size={19} />
            <span className="action-text-label">SEARCH</span>
          </button>

          {/* Wishlist */}
          <a
            href="/wishlist"
            onClick={(e) => handleNavClick(e, '/wishlist')}
            className="action-link header-icon-btn"
            aria-label={`Wishlist with ${wishlistCount} items`}
            title="Wishlist"
          >
            <div className="action-icon-wrapper">
              <Heart size={19} />
              {wishlistCount > 0 && <span className="count-pill">{wishlistCount}</span>}
            </div>
            <span className="action-text-label">WISHLIST</span>
          </a>

          {/* Account */}
          <a
            href="/account"
            onClick={(e) => handleNavClick(e, '/account')}
            className="action-link header-icon-btn"
            aria-label="My Account"
            title="Account"
          >
            <User size={19} />
            <span className="action-text-label">ACCOUNT</span>
          </a>

          {/* Bag Drawer Trigger */}
          <button
            className="action-link bag-button"
            onClick={openCart}
            aria-label={`Shopping bag with ${itemCount} items`}
          >
            <div className="action-icon-wrapper">
              <ShoppingBag size={19} />
              {itemCount > 0 && <span className="count-pill pill-red">{itemCount}</span>}
            </div>
            <span className="bag-label-text">
              BAG <span className="bag-num">({itemCount})</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
