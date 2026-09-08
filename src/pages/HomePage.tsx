import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { BrandIntroduction } from '../components/home/BrandIntroduction';
import { CategoryBento } from '../components/home/CategoryBento';
import { NewDropSection } from '../components/home/NewDropSection';
import { FeaturedCollection } from '../components/home/FeaturedCollection';
import { ShopTheLook } from '../components/home/ShopTheLook';
import { BrandStatementSection } from '../components/home/BrandStatementSection';
import { EditorialLookbook } from '../components/home/EditorialLookbook';
import { LimitedDropCTA } from '../components/home/LimitedDropCTA';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { Product } from '../types/product';

interface HomePageProps {
  navigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onQuickView }) => {
  return (
    <div className="homepage-flow">
      {/* SECTION 3 — HERO SECTION */}
      <HeroSection navigate={navigate} />

      {/* SECTION 4 — BRAND INTRODUCTION */}
      <BrandIntroduction />

      {/* SECTION 5 — SHOP BY CATEGORY */}
      <CategoryBento navigate={navigate} />

      {/* SECTION 6 — NEW DROP (Background: Soft Grey #EAEAEA) */}
      <NewDropSection navigate={navigate} onQuickView={onQuickView} />

      {/* SECTION 7 — FEATURED COLLECTION: AFTER DARK (Deep Teal #042A2B) */}
      <FeaturedCollection navigate={navigate} />

      {/* SECTION 8 — SHOP THE LOOK */}
      <ShopTheLook navigate={navigate} />

      {/* SECTION 9 — BRAND STATEMENT */}
      <BrandStatementSection />

      {/* SECTION 10 — EDITORIAL / LOOKBOOK */}
      <EditorialLookbook navigate={navigate} />

      {/* SECTION 11 — LIMITED DROP CTA (Burnt Red #A72608) */}
      <LimitedDropCTA navigate={navigate} />

      {/* SECTION 12 — NEWSLETTER (Olive Green #65743A) */}
      <NewsletterSection />
    </div>
  );
};
