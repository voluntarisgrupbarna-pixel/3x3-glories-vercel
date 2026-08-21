import HeroFestival from "./components/HeroFestival";
import PostEventRecap from "./components/PostEventRecap";
import IdentityChipsStrip from "./components/IdentityChipsStrip";
import UbicacionsSection from "./components/UbicacionsSection";
import PremisSection from "./components/PremisSection";
import CategoriesSection from "./components/CategoriesSection";
import ObertATothomSection from "./components/ObertATothomSection";
import PrideBanner from "./components/PrideBanner";
import InstagramReels from "./components/InstagramReels";
import FaqSection from "./components/FaqSection";
import SponsorsSection from "./components/SponsorsSection";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <>
      <main className="experience-shell">
        {/* === HERO FESTIVAL — primer impacte amb foto + nav + stats + IG === */}
        <HeroFestival />
      </main>

      {/* === RECAP — com va anar la 3a edició + galeria + avisa'm pel 2027 === */}
      <PostEventRecap />

      {/* === FRANJA IDENTITAT — 5 valors del torneig === */}
      <IdentityChipsStrip />

      {/* === Ubicacions — 3 seus amb mapa === */}
      <UbicacionsSection />

      {/* === Premis & Trofeus === */}
      <PremisSection />

      {/* === Categories — dia 6 + dia 7 === */}
      <CategoriesSection />

      {/* === Mes de l'Orgull LGTBI+ — banner prominent juny === */}
      <PrideBanner />

      {/* === Un 3x3 obert a tothom — Màgics + LGTBI+ === */}
      <ObertATothomSection />

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
