"use client";

import EarlyBirdBanner from "./components/EarlyBirdBanner";
import HeroFestival from "./components/HeroFestival";
import WhatsAppLeadWidget from "./components/WhatsAppLeadWidget";
import SlideDos from "./components/SlideDos";
import UbicacionsSection from "./components/UbicacionsSection";
import PremisSection from "./components/PremisSection";
import CategoriesSection from "./components/CategoriesSection";
import InstagramReels from "./components/InstagramReels";
import FaqSection from "./components/FaqSection";
import SponsorsSection from "./components/SponsorsSection";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <>
      <EarlyBirdBanner />
      <main className="experience-shell">
        {/* === HERO FESTIVAL — primer impacte amb foto + nav + stats + IG === */}
        <HeroFestival />

        {/* === SLIDE DOS — rèplica del disseny original: el torneig === */}
        <SlideDos />
      </main>

      {/* === Ubicacions — 3 seus amb mapa === */}
      <UbicacionsSection />

      {/* === Premis & Trofeus === */}
      <PremisSection />

      {/* === Categories — dia 6 + dia 7 === */}
      <CategoriesSection />

      {/* === Galeria — Instagram Reels === */}
      <InstagramReels />

      {/* === FAQ accordion === */}
      <FaqSection />

      {/* === Patrocinadors === */}
      <SponsorsSection />

      {/* === Footer === */}
      <SiteFooter />

      <WhatsAppLeadWidget />
    </>
  );
}
