"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { WA_REGISTRE_URL } from "../lib/whatsapp";

const NAV_LINKS = [
  { href: "/#torneig",      label: "Torneig" },
  { href: "/#ubicacions",   label: "Ubicacions" },
  { href: "/#premis",       label: "Premis" },
  { href: "/#categories",   label: "Categories" },
  { href: "/#galeria",      label: "Galeria" },
  { href: "/#sponsors",     label: "Sponsors" },
  { href: "/preguntes-frequents", label: "FAQs" },
  { href: "/patrocinar",    label: "Patrocina" },
];

/**
 * Barra de navegació global — apareix a TOTES les pàgines excepte la home ("/"),
 * que ja té el seu propi nav integrat al HeroFestival.
 */
export default function SiteNav() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ocultar a la home — HeroFestival ja té el seu nav
  if (path === "/") return null;

  return (
    <nav
      className={`site-nav${scrolled ? " site-nav--scrolled" : ""}`}
      aria-label="Navegació principal"
    >
      <a href="/" className="site-nav-logo" aria-label="Inici 3×3 Westfield Glòries">
        <img src="/logos/westfield.svg" alt="Westfield Glòries" className="site-nav-logo-img" />
        <span>3×3 Westfield Glòries</span>
      </a>

      <div className="site-nav-links">
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={`site-nav-link${path === l.href ? " site-nav-link--active" : ""}`}
          >
            {l.label}
          </a>
        ))}
      </div>

      <div className="site-nav-actions">
        <a href={WA_REGISTRE_URL} className="site-nav-contact">
          WhatsApp
        </a>
        <a href="/inscripcion" className="site-nav-cta">
          Inscriu-te
        </a>
      </div>
    </nav>
  );
}
