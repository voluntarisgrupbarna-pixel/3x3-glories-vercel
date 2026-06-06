"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tancar drawer en canviar de pàgina
  useEffect(() => { setDrawerOpen(false); }, [path]);

  // Bloquejar scroll del body quan el drawer és obert
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Ocultar a la home — HeroFestival ja té el seu nav
  if (path === "/") return null;

  return (
    <>
      <nav
        className={`site-nav${scrolled ? " site-nav--scrolled" : ""}`}
        aria-label="Navegació principal"
      >
        <a href="/" className="site-nav-logo" aria-label="Inici 3×3 Westfield Glòries">
          <Image src="/logos/westfield.svg" alt="Westfield Glòries" className="site-nav-logo-img" width={28} height={28} priority />
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
          <span className="site-nav-cta" style={{ opacity: 0.45, cursor: "default", background: "rgba(37,211,102,0.2)" }}>
            Tancades
          </span>
          <button
            type="button"
            className="site-nav-hamburger"
            aria-label="Obrir menú"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="2" y1="5" x2="18" y2="5" />
              <line x1="2" y1="10" x2="18" y2="10" />
              <line x1="2" y1="15" x2="18" y2="15" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Drawer menú mòbil */}
      <div
        className={`site-nav-drawer${drawerOpen ? " site-nav-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegació"
      >
        <div
          className="site-nav-drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
        />
        <div className="site-nav-drawer-panel">
          <div className="site-nav-drawer-header">
            <span className="site-nav-drawer-title">Menú</span>
            <button
              type="button"
              className="site-nav-drawer-close"
              aria-label="Tancar menú"
              onClick={() => setDrawerOpen(false)}
            >
              ×
            </button>
          </div>

          <nav className="site-nav-drawer-links" aria-label="Links de navegació">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`site-nav-drawer-link${path === l.href ? " site-nav-drawer-link--active" : ""}`}
                onClick={() => setDrawerOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="site-nav-drawer-footer">
            <a
              href={WA_REGISTRE_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="site-nav-drawer-wa"
              onClick={() => setDrawerOpen(false)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.116 1.533 5.847L.057 23.572a.5.5 0 0 0 .604.635l5.928-1.557A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.502-5.177-1.381l-.371-.218-3.847 1.009 1.022-3.742-.239-.384A9.958 9.958 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Contactar per WhatsApp
            </a>
            <span className="site-nav-drawer-cta" style={{ opacity: 0.45, cursor: "default", background: "rgba(37,211,102,0.2)" }}>
              🔴 Inscripcions tancades
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
