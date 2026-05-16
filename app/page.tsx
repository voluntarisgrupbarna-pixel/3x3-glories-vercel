"use client";

import EarlyBirdBanner from "./components/EarlyBirdBanner";
import HeroFestival from "./components/HeroFestival";
import SlideDos from "./components/SlideDos";
import OccupancyGrid from "./components/OccupancyGrid";
import CategoryBars from "./components/CategoryBars";
import UbicacionsSection from "./components/UbicacionsSection";
import PremisSection from "./components/PremisSection";
import CategoriesSection from "./components/CategoriesSection";
import InstagramReels from "./components/InstagramReels";
import NotifyMeBar from "./components/NotifyMeBar";
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

      {/* === SLIDE 3 — Graella d'ocupació 100 places (1 quadrat = 1 equip) === */}
      <OccupancyGrid />

      {/* === SLIDE 4 — Barres per categoria amb % d'ocupació === */}
      <CategoryBars />

      {/* === Ubicacions — 3 seus amb mapa === */}
      <UbicacionsSection />

      {/* === Premis & Trofeus === */}
      <PremisSection />

      {/* === Categories — dia 6 + dia 7 === */}
      <CategoriesSection />

      {/* === Telaraña: captura de qui no està llest per inscriure's === */}
      <NotifyMeBar />

      {/* === Galeria — Instagram Reels === */}
      <InstagramReels />

      {/* === FAQ accordion === */}
      <FaqSection />

      {/* === Patrocinadors === */}
      <SponsorsSection />

      {/* === Footer === */}
      <SiteFooter />
    </>
  );
}
