import React from 'react';
import { BRAND } from '../../config/brand';
import './AnnouncementBar.css';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="announcement-bar" role="region" aria-label="Announcement">
      <div className="announcement-marquee-track animate-marquee">
        {Array.from({ length: 4 }).map((_, repeatIndex) => (
          <div key={repeatIndex} className="announcement-segment">
            {BRAND.announcements.map((msg, i) => (
              <React.Fragment key={`${repeatIndex}-${i}`}>
                <span className="announcement-text">{msg}</span>
                <span className="announcement-bullet" aria-hidden="true">✦</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
