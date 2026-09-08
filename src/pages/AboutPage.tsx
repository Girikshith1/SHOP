import React from 'react';
import { BRAND } from '../config/brand';
import { ArrowRight } from 'lucide-react';
import './AboutPage.css';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="about-page bg-almost-black">
      {/* Editorial Title Banner */}
      <div className="about-hero-banner">
        <div className="container">
          <span className="mono-tag text-burnt-red">BRAND MANIFESTO // CODEX 01</span>
          <h1 className="about-hero-title font-heading">WHO IS DON?</h1>
          <blockquote className="about-lead-quote font-artistic">
            WE DON'T FOLLOW THE CULTURE. WE CREATE OUR OWN.
          </blockquote>
        </div>
      </div>

      {/* Narrative Spread 1: Why We Exist */}
      <div className="container about-body-container">
        <div className="about-narrative-block">
          <div className="narrative-meta">
            <span className="mono-tag">CHAPTER 01</span>
            <h2 className="narrative-heading">WHY WE EXIST</h2>
          </div>
          <div className="narrative-content font-editorial">
            <p className="narrative-p-large">
              Fashion has surrendered to algorithmic mediocrity. Mass-produced synthetic blends, cheap graphics stamped on paper-thin polyester, and disposable weekly collections designed to end up in landfills.
            </p>
            <p className="narrative-p">
              DON was born in Mumbai out of deep dissatisfaction. We wanted clothes that possessed structural mass—t-shirts that hold their boxy drape after dozens of nocturnal cycles, hoodies with monumental weight that envelop the silhouette like armor, and tactical bottoms engineered with genuine Cordura and Japanese ripstop.
            </p>
          </div>
        </div>

        {/* Visual Break */}
        <div className="about-visual-break">
          <div className="break-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1600&q=88"
              alt="DON Atelier Mumbai"
            />
            <div className="break-caption">
              <span>DON ATELIER // NOCTURNE TESTING FACILITY // 2026</span>
            </div>
          </div>
        </div>

        {/* Narrative Spread 2: The People We Create For */}
        <div className="about-narrative-block">
          <div className="narrative-meta">
            <span className="mono-tag">CHAPTER 02</span>
            <h2 className="narrative-heading">THE PEOPLE WE CREATE FOR</h2>
          </div>
          <div className="narrative-content font-editorial">
            <p className="narrative-p-large">
              We do not design for the crowd. We design for the outsiders, the sound architects, the midnight runners, the digital nomads, and the youth who wear their rebellion without seeking approval.
            </p>
            <p className="narrative-p">
              When you put on a DON garment, you are not wearing advertising for a corporation. There are no garish logos screaming across your chest. The authority comes strictly from the volume, the weight of the cotton, and the architectural silhouette.
            </p>
          </div>
        </div>

        {/* Narrative Spread 3: Our Approach to Clothing */}
        <div className="about-narrative-block">
          <div className="narrative-meta">
            <span className="mono-tag">CHAPTER 03</span>
            <h2 className="narrative-heading">OUR APPROACH TO CLOTHING</h2>
          </div>
          <div className="narrative-content font-editorial">
            <div className="pillars-grid">
              <div className="pillar-card">
                <span className="pillar-num">01</span>
                <h4 className="pillar-title">280–460 GSM WEIGHT</h4>
                <p>We source ultra-dense ring-spun combed yarns and loopback French Terry that feel indestructible.</p>
              </div>

              <div className="pillar-card">
                <span className="pillar-num">02</span>
                <h4 className="pillar-title">ZERO RESTOCKS</h4>
                <p>Every collection is strictly limited in numbered production runs. When an edition is gone, it is permanently retired to our archive.</p>
              </div>

              <div className="pillar-card">
                <span className="pillar-num">03</span>
                <h4 className="pillar-title">ANATOMICAL GEOMETRY</h4>
                <p>Extreme dropped shoulders, broad chest dimensions, high-density anti-sag collars, and tailored crop lengths.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Action */}
        <div className="about-closing-card bg-deep-teal">
          <span className="mono-tag">READY TO WITNESS DROP 001?</span>
          <h3 className="closing-title">EXPLORE THE ARCHIVE</h3>
          <button className="btn btn-light btn-lg" onClick={() => navigate('/new-drop')}>
            <span>VIEW DROP 001</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
