import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/#top", label: "El Torneig" },
  { href: "/#ubicacions", label: "Ubicacions" },
  { href: "/#premis", label: "Premis & Trofeus" },
  { href: "/#categories", label: "Categories" },
  { href: "/preguntes-frequents", label: "Regles FIBA" },
  { href: "/preguntes-frequents", label: "Galeria" },
  { href: "/#sponsors", label: "Patrocinadors" },
];

const LOGO_PILLS = [
  { src: "/logos/westfield.svg", alt: "Westfield Glòries" },
  { src: "/cb-grup-barna-logo-512.png", alt: "CB Grup Barna" },
  { src: "/logos/timechamber.webp", alt: "Time Chamber" },
  { src: "/logos/eix-clot.png", alt: "Eix Clot" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        {/* ── Col esquerra ── */}
        <div className="site-footer-brand">
          <p className="site-footer-title">3×3 Westfield Glòries</p>
          <p className="site-footer-orgs">× Grup Barna · Time Chamber · Eix Clot</p>
          <p className="site-footer-date">6-7 Juny 2026 · Barcelona</p>
          <div className="site-footer-logos">
            {LOGO_PILLS.map((l) => (
              <div key={l.alt} className="site-footer-logo-pill">
                <Image src={l.src} alt={l.alt} width={48} height={28} style={{ objectFit: "contain" }} />
              </div>
            ))}
            <a
              href="https://www.instagram.com/cbgrupbarna/"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer-ig"
              aria-label="Instagram CB Grup Barna"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ── Col central ── */}
        <nav className="site-footer-nav" aria-label="Navegació peu de pàgina">
          <p className="site-footer-col-title">Navegació</p>
          <ul className="site-footer-nav-list">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="site-footer-nav-link">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Col dreta ── */}
        <div className="site-footer-contact">
          <p className="site-footer-col-title">Contacte</p>
          <a href="mailto:info@cbgrupbarna.com" className="site-footer-email">
            info@cbgrupbarna.com
          </a>
          <p className="site-footer-social-handles">
            @cbgrupbarna&nbsp;·&nbsp;@timechamber_es
          </p>
          <p className="site-footer-venues">
            La Nau del Clot · Westfield Glòries · Rambleta del Clot
          </p>
        </div>
      </div>

      <div className="site-footer-institutional">
        Organitzat per <strong>CB Grup Barna</strong> ·
        Pla d&apos;Igualtat 2026-2029 aprovat ·
        Delegat de Protecció del Menor (LOPIVI) ·
        Club nominat als Premis Dona i Esport
      </div>

      <div className="site-footer-bottom">
        <span className="site-footer-copy">
          © 2026 CB Grup Barna · Time Chamber · Eix Clot. Tots els drets reservats.
        </span>
        <span className="site-footer-bottom-name">3×3 Westfield Glòries</span>
      </div>
    </footer>
  );
}
