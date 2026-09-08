import React from 'react';

export const InstagramIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const DiscordIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6h0a14.5 14.5 0 0 0-4-1.2 12 12 0 0 0-.5 1.2 14 14 0 0 0-3 0 12 12 0 0 0-.5-1.2A14.5 14.5 0 0 0 6 6a16 16 0 0 0-2 9 14.5 14.5 0 0 0 4.5 2.3 12 12 0 0 0 1-1.6 9 9 0 0 1-1.5-.7.2.2 0 0 1 0-.2c.1-.1.2-.1.3-.2a10 10 0 0 0 7.4 0c.1.1.2.1.3.2a.2.2 0 0 1 0 .2 9 9 0 0 1-1.5.7 12 12 0 0 0 1 1.6 14.5 14.5 0 0 0 4.5-2.3 16 16 0 0 0-2-9z" />
    <circle cx="9" cy="12" r="1" fill="currentColor" />
    <circle cx="15" cy="12" r="1" fill="currentColor" />
  </svg>
);
