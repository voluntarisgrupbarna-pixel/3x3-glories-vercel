"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import EarlyBirdBanner from "./components/EarlyBirdBanner";
import WhatsAppLeadWidget from "./components/WhatsAppLeadWidget";
import { faqs } from "./data/faqs";

type LngLat = [number, number];
type RouteMode = "walk" | "metro" | "bus" | "parking";

type VenuePoint = {
  id: string;
  name: string;
  tag: string;
  detail: string;
  coords: LngLat;
};

const venues: VenuePoint[] = [
  {
    id: "glories",
    name: "Westfield Glòries",
    tag: "Inici",
    detail: "Pàrquing gratis 2h, punt d'arribada i zona de trobada.",
    coords: [2.191, 41.404],
  },
  {
    id: "nau",
    name: "La Nau del Clot",
    tag: "3×3",
    detail: "Zona urbana de joc, ambient, música i competició.",
    coords: [2.188, 41.406],
  },
  {
    id: "rambleta",
    name: "Rambleta del Clot",
    tag: "Pista",
    detail: "Connexió amb el pavelló cobert i l'entorn del club.",
    coords: [2.187, 41.408],
  },
];

const realWalkRoute: LngLat[] = [[2.190911,41.403936],[2.190832,41.403997],[2.190803,41.40399],[2.190791,41.403987],[2.190734,41.403976],[2.19064,41.403954],[2.190579,41.403999],[2.190519,41.403983],[2.190267,41.403918],[2.189917,41.403829],[2.189132,41.403628],[2.189117,41.403654],[2.189102,41.403692],[2.189074,41.403755],[2.189067,41.403768],[2.189063,41.403779],[2.189056,41.403795],[2.189041,41.403832],[2.189025,41.403875],[2.189017,41.403894],[2.189012,41.403909],[2.188989,41.403961],[2.188978,41.403987],[2.188968,41.404011],[2.188959,41.404028],[2.188704,41.403967],[2.188656,41.403961],[2.188641,41.403964],[2.188576,41.404011],[2.188545,41.404033],[2.188532,41.404042],[2.188522,41.404049],[2.188491,41.404072],[2.188477,41.404081],[2.188386,41.40415],[2.188351,41.404181],[2.188288,41.404235],[2.188273,41.404248],[2.188259,41.404258],[2.188207,41.4043],[2.188197,41.404307],[2.188091,41.404387],[2.188041,41.404426],[2.188023,41.404441],[2.187994,41.404462],[2.187957,41.404492],[2.187944,41.4045],[2.187579,41.404758],[2.187188,41.405054],[2.187179,41.405077],[2.187155,41.405136],[2.187153,41.405288],[2.187149,41.405523],[2.187153,41.405578],[2.187151,41.405629],[2.187153,41.405652],[2.187215,41.405768],[2.187263,41.405864],[2.187411,41.406164],[2.187601,41.406548],[2.187696,41.406741],[2.187721,41.40679],[2.187736,41.406821],[2.187795,41.406941],[2.18774,41.40697],[2.187149,41.407272],[2.18715,41.407309],[2.187151,41.407394],[2.187074,41.407394],[2.187029,41.407394],[2.186995,41.407394],[2.186993,41.408]];

const routes: Record<RouteMode, LngLat[]> = {
  walk: realWalkRoute,
  metro: [
    [2.1865, 41.403],
    [2.1882, 41.4037],
    [2.191, 41.404],
    [2.188, 41.406],
    [2.187, 41.408],
  ],
  bus: [
    [2.193, 41.4028],
    [2.1916, 41.404],
    [2.19, 41.405],
    [2.188, 41.406],
    [2.187, 41.408],
  ],
  parking: [
    [2.191, 41.404],
    [2.1914, 41.4043],
    [2.1904, 41.4049],
    [2.1892, 41.4055],
    [2.188, 41.406],
    [2.187, 41.408],
  ],
};

const routeCopy: Record<RouteMode, { label: string; time: string; note: string }> = {
  walk: {
    label: "A peu",
    time: "10 min",
    note: "Circuit real a peu: 786 m per carrers reals fins a la pista.",
  },
  metro: {
    label: "Metro",
    time: "L1",
    note: "Baixes a Glòries i entres directe en l'ambient del 3×3.",
  },
  bus: {
    label: "Bus",
    time: "Diagonal",
    note: "Ruta pensada per a famílies i equips que venen en grup.",
  },
  parking: {
    label: "Pàrquing 2h",
    time: "Gratis",
    note: "Aparques, creues el centre i ja estàs jugant en minuts.",
  },
};

function toLatLng(point: LngLat) {
  return [point[1], point[0]];
}

function toLatLngs(points: LngLat[]) {
  return points.map(toLatLng);
}

function getMapPadding() {
  if (window.innerWidth < 760) {
    return [Math.max(120, Math.min(390, window.innerWidth - 140)), 128] as [number, number];
  }

  return [420, 96] as [number, number];
}

function segmentDistance(a: LngLat, b: LngLat) {
  const x = (b[0] - a[0]) * Math.cos(((a[1] + b[1]) / 2) * (Math.PI / 180));
  const y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
}

function pointOnPath(path: LngLat[], progress: number): LngLat {
  const segments = path.slice(1).map((point, index) => ({
    from: path[index],
    to: point,
    distance: segmentDistance(path[index], point),
  }));
  const total = segments.reduce((sum, segment) => sum + segment.distance, 0);
  let walked = progress * total;

  for (const segment of segments) {
    if (walked <= segment.distance) {
      const amount = segment.distance === 0 ? 0 : walked / segment.distance;
      return [
        segment.from[0] + (segment.to[0] - segment.from[0]) * amount,
        segment.from[1] + (segment.to[1] - segment.from[1]) * amount,
      ];
    }

    walked -= segment.distance;
  }

  return path[path.length - 1];
}

function makeVenueHtml(point: VenuePoint) {
  return `<button type="button" class="venue-marker venue-marker-${point.id}" aria-label="${point.name}"><span>${point.tag}</span></button>`;
}

function makePlayerHtml() {
  return `
    <div class="moving-player">
      <span class="player-shadow"></span>
      <span class="player-body">
        <span class="player-head"></span>
        <span class="player-torso"></span>
        <span class="player-leg left"></span>
        <span class="player-leg right"></span>
        <span class="player-ball"></span>
      </span>
    </div>
  `;
}

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);
  const routeGlowRef = useRef<any>(null);
  const playerMarkerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const LRef = useRef<any>(null);
  const [mode, setMode] = useState<RouteMode>("walk");
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");
  const [geoLabel, setGeoLabel] = useState("La meva ubicació");

  const currentRoute = useMemo(() => routes[mode], [mode]);
  const currentCopy = routeCopy[mode];

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!mounted || !mapContainerRef.current) return;

      let L: any;
      try {
        L = (await import("leaflet")).default;
      } catch {
        if (mounted) setMapError("No s'ha pogut carregar el mapa.");
        return;
      }

      if (!mounted || mapRef.current || !mapContainerRef.current) return;

      LRef.current = L;

      function fitRoute(path: LngLat[]) {
        if (!mapRef.current) return;
        const bounds = L.latLngBounds(toLatLngs(path));
        const [left, bottom] = getMapPadding();
        mapRef.current.fitBounds(bounds, {
          paddingTopLeft: [left, 150],
          paddingBottomRight: [90, bottom],
          maxZoom: 14,
          animate: true,
        });
      }

      const map = L.map(mapContainerRef.current, {
        center: [41.4057, 2.1892],
        zoom: 14,
        zoomControl: false,
        scrollWheelZoom: true,
      });

      mapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap &copy; CARTO",
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      routeGlowRef.current = L.polyline(toLatLngs(routes.walk), {
        color: "#ff1f4f",
        weight: 14,
        opacity: 0.22,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      routeLineRef.current = L.polyline(toLatLngs(routes.walk), {
        color: "#ff375f",
        weight: 4,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      venues.forEach((point) => {
        L.marker(toLatLng(point.coords), {
          icon: L.divIcon({
            className: "venue-icon",
            html: makeVenueHtml(point),
            iconSize: [52, 52],
            iconAnchor: [26, 52],
            popupAnchor: [0, -42],
          }),
        })
          .bindPopup(`<strong>${point.name}</strong><p>${point.detail}</p>`, {
            closeButton: false,
            className: "event-popup",
          })
          .addTo(map);
      });

      playerMarkerRef.current = L.marker(toLatLng(routes.walk[0]), {
        icon: L.divIcon({
          className: "player-icon",
          html: makePlayerHtml(),
          iconSize: [38, 58],
          iconAnchor: [19, 58],
        }),
        interactive: false,
      }).addTo(map);

      fitRoute(routes.walk);
      setMapReady(true);
    }

    init();

    return () => {
      mounted = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!map || !mapReady || !L) return;

    routeGlowRef.current?.setLatLngs(toLatLngs(currentRoute));
    routeLineRef.current?.setLatLngs(toLatLngs(currentRoute));

    const bounds = L.latLngBounds(toLatLngs(currentRoute));
    const [left, bottom] = getMapPadding();
    map.fitBounds(bounds, {
      paddingTopLeft: [left, 150],
      paddingBottomRight: [90, bottom],
      maxZoom: 14,
      animate: true,
    });

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      playerMarkerRef.current?.setLatLng(toLatLng(currentRoute[0]));
      return;
    }

    const duration = mode === "walk" ? 7600 : 6200;
    const start = performance.now();

    function animate(now: number) {
      const progress = ((now - start) % duration) / duration;
      playerMarkerRef.current?.setLatLng(toLatLng(pointOnPath(currentRoute, progress)));
      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    function handleVisibility() {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [currentRoute, mapReady, mode]);

  function locateUser() {
    const L = LRef.current;
    const map = mapRef.current;

    if (!navigator.geolocation || !map || !L) {
      setGeoLabel("No disponible");
      return;
    }

    setGeoLabel("Localitzant…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: LngLat = [position.coords.longitude, position.coords.latitude];

        userMarkerRef.current?.remove();
        userMarkerRef.current = L.marker(toLatLng(coords), {
          icon: L.divIcon({
            className: "user-icon",
            html: '<span class="user-marker"></span>',
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          }),
        })
          .bindPopup("<strong>Ets aquí</strong><p>T'hi portem al 3×3.</p>")
          .addTo(map);

        const bounds = L.latLngBounds([toLatLng(coords), ...toLatLngs(currentRoute)]);
        const [left, bottom] = getMapPadding();
        map.fitBounds(bounds, {
          paddingTopLeft: [left, 150],
          paddingBottomRight: [90, bottom],
          maxZoom: 14,
          animate: true,
        });
        setGeoLabel("Ubicació OK");
      },
      () => setGeoLabel("Permís denegat"),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <>
      <EarlyBirdBanner />
      <main className="experience-shell">
      <div className="map-stage">
        <div ref={mapContainerRef} className="map-canvas" />
        {!mapReady && <div className="map-fallback" aria-hidden="true" />}
        {mapError && (
          <div className="token-alert">
            <span>Mapa</span>
            <strong>{mapError}</strong>
            <p>Comprova la connexió i recarrega la pàgina.</p>
          </div>
        )}
      </div>

      <section className="hero-panel" aria-label="3×3 Westfield Glòries 2026">
        <div className="kicker">CB Grup Barna × Time Chamber</div>
        <h1>Així es viu el 3×3</h1>
        <p>Arribes. Camines. Entres a l'energia de Glòries. I juges.</p>

        <div className="route-status">
          <div>
            <span>Ruta activa</span>
            <strong>{currentCopy.label}</strong>
          </div>
          <div>
            <span>Temps</span>
            <strong>{currentCopy.time}</strong>
          </div>
        </div>

        <div className="mode-grid" aria-label="Opcions de transport">
          {(Object.keys(routeCopy) as RouteMode[]).map((item) => (
            <button
              key={item}
              type="button"
              className={mode === item ? "active" : ""}
              onClick={() => setMode(item)}
            >
              <span>{routeCopy[item].label}</span>
              <strong>{routeCopy[item].time}</strong>
            </button>
          ))}
        </div>

        <p className="route-note">{currentCopy.note}</p>

        <div className="action-row">
          <button type="button" onClick={locateUser}>
            {geoLabel}
          </button>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=41.404,2.191"
            target="_blank"
            rel="noreferrer"
          >
            Obre la ruta
          </a>
        </div>
      </section>

      <aside className="scoreboard" aria-label="Informació de l'esdeveniment">
        <div>
          <span>Pàrquing</span>
          <strong>2h gratis</strong>
        </div>
        <div>
          <span>Format</span>
          <strong>3×3 urbà</strong>
        </div>
        <div>
          <span>Zona</span>
          <strong>Glòries</strong>
        </div>
      </aside>

      <section className="event-info-section" aria-label="Sobre el torneig 3×3">
        <div className="event-info-inner">
          <h2>El torneig 3×3 més potent de Barcelona</h2>
          <p>
            El <strong>3×3 Westfield Glòries</strong> és el torneig oficial de bàsquet 3×3 amb punts FIBA del
            barri del Clot-Glòries de Barcelona. La <strong>4a edició</strong> se celebra els dies{" "}
            <strong>6 i 7 de juny de 2026</strong> amb <strong>2.000 € de prize money</strong> per als equips
            Sèniors Masculí i Sèniors Femení, i punts pel rànquing mundial de FIBA 3×3.
          </p>
          <div className="event-info-grid">
            <div>
              <strong>Categories</strong>
              <span>Premini · Mini · Infantil · Cadet · Júnior · Sub-23 · Sènior Pro · Veterans M/F</span>
            </div>
            <div>
              <strong>Prize money</strong>
              <span>2.000 € Sèniors M/F · Trofeus i medalles per a totes les categories</span>
            </div>
            <div>
              <strong>Seus</strong>
              <span>Westfield Glòries · La Nau del Clot · Rambleta del Clot</span>
            </div>
            <div>
              <strong>Inscripció</strong>
              <span>Equips: 75–90 € · Sènior Pro: 85–90 € · Individual: 20 €</span>
            </div>
          </div>
          <a href="/inscripcion" className="event-info-cta">
            Inscriu el teu equip al 3×3 Barcelona →
          </a>
        </div>
      </section>

      <section className="venues-section" aria-label="Seus del torneig">
        <div className="venues-inner">
          <h2 className="venues-title">3 seus · 1 barri</h2>
          <div className="venues-grid">
            <a href="/seu/westfield-glories" className="venue-card">
              <span className="venue-card-tag">Seu principal</span>
              <strong>Westfield Glòries</strong>
              <span className="venue-card-addr">Av. Diagonal 208</span>
              <p>Zona de trobada, inscripcions, cerimònia i finals Sènior. Pàrquing gratis 2h.</p>
            </a>
            <a href="/seu/nau-del-clot" className="venue-card">
              <span className="venue-card-tag">Pavelló oficial</span>
              <strong>La Nau del Clot</strong>
              <span className="venue-card-addr">C/ de la Llacuna 172</span>
              <p>Pista coberta. Categories formatives (Premini–Sub-23) i semifinals Sènior.</p>
            </a>
            <a href="/seu/rambleta-del-clot" className="venue-card">
              <span className="venue-card-tag">Pista exterior</span>
              <strong>Rambleta del Clot</strong>
              <span className="venue-card-addr">Barri del Clot-Glòries</span>
              <p>Bàsquet de carrer: ambient, música i competició a l'aire lliure.</p>
            </a>
          </div>
        </div>
      </section>

      <section className="faq-section" aria-label="Preguntes freqüents">
        <div className="faq-inner">
          <h2 className="faq-title">Preguntes freqüents</h2>
          <FaqAccordion />
          <div className="faq-footer">
            <Link href="/preguntes-frequents" className="faq-all-link">
              Veure totes les preguntes freqüents →
            </Link>
          </div>
        </div>
      </section>

      <section className="rival-cta-section" aria-label="Porta un rival">
        <div className="rival-cta-inner">
          <span className="rival-cta-tag">Pack rival · −5 € cada un</span>
          <h2>Ja tens equip? Porta'n un de rival</h2>
          <p>
            Convida un altre equip a venir al 3×3 i estalvieu <strong>5 € cada un</strong>. Sense límit
            d'equips. Genera un codi únic i envia'l per WhatsApp en un clic.
          </p>
          <Link href="/porta-un-rival" className="rival-cta-btn">
            Generar repte WhatsApp →
          </Link>
        </div>
      </section>

      <section className="solo-cta-section" aria-label="Inscripció individual">
        <div className="solo-cta-inner">
          <span className="solo-cta-tag">Inscripció individual · 20 €</span>
          <h2>Vens sense equip? Apunta't sol</h2>
          <p>
            No tens equip? Apunta't individualment per <strong>20 €</strong> i et col·loquem en un equip una
            setmana abans del torneig. Inclou samarreta oficial, dorsal i accés als 2 dies.
          </p>
          <Link href="/inscripcio-individual" className="solo-cta-btn">
            Inscriure'm sol →
          </Link>
        </div>
      </section>

      <WhatsAppLeadWidget />
    </main>
    </>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  function toggle(i: number) {
    setOpen(open === i ? null : i);
  }

  return (
    <div className="faq-list">
      {faqs.map((faq, i) => (
        <div key={i} className={`faq-item${open === i ? " faq-item--open" : ""}`}>
          <button
            type="button"
            className="faq-question"
            aria-expanded={open === i}
            onClick={() => toggle(i)}
          >
            <span>{faq.q}</span>
            <span className="faq-icon" aria-hidden="true">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div className="faq-answer">
              <p>{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
