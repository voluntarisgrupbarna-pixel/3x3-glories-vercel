import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import StickyCtaBar from "./components/StickyCtaBar";
import SiteNav from "./components/SiteNav";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const SITE_URL = "https://cbgrupbarna-3x3timechamber.com";
const SITE_NAME = "3×3 Westfield Glòries";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const LOGO_512 = `${SITE_URL}/cb-grup-barna-logo-512.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "3×3 Barcelona — Torneig FIBA Westfield Glòries 2026 · CB Grup Barna",
    template: "%s | 3×3 Westfield Glòries",
  },
  description:
    "El torneig 3×3 més potent de Barcelona. Punts FIBA, 2.000€ de premi en metàl·lic (1.000€ Sèniors Masculí + 1.000€ Sèniors Femení). 6-7 Juny 2026 al Clot-Glòries. Inscriu-te ja!",
  keywords: [
    "3x3 Barcelona",
    "torneig 3x3 FIBA",
    "Westfield Glòries",
    "basquet 3x3",
    "basquet de carrer Barcelona",
    "CB Grup Barna",
    "Time Chamber",
    "premi en metàl·lic 3x3",
    "ranking FIBA 3x3",
    "Sant Martí",
    "Clot",
    "Barcelona basquet",
    "torneo baloncesto 3x3 Barcelona",
    "3x3 FIBA Barcelona 2026",
  ],
  authors: [{ name: "CB Grup Barna" }, { name: "Time Chamber" }, { name: "Eix Clot" }],
  publisher: "CB Grup Barna",
  alternates: {
    canonical: "/",
    languages: {
      ca: "/",
      es: "/",
      "x-default": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ca_ES",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "3×3 Westfield Glòries 2026 · Torneig FIBA Barcelona",
    description:
      "El torneig 3×3 més potent de Barcelona. Punts FIBA, 2.000€ de premi en metàl·lic (1.000€ Sèniors Masculí + 1.000€ Sèniors Femení). 6-7 Juny 2026 al Clot-Glòries. Inscriu-te ja!",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "3×3 Westfield Glòries 2026 · Torneig urbà a Barcelona · 6-7 Juny",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cbgrupbarna",
    creator: "@cbgrupbarna",
    title: "3×3 Westfield Glòries 2026 · Barcelona",
    description:
      "Torneig 3×3 FIBA · 2.000€ premi en metàl·lic (1.000€ Sèniors M + 1.000€ Sèniors F) · 6-7 Juny 2026. Places limitades — inscriu-te ja!",
    images: [{ url: OG_IMAGE, alt: "3×3 Westfield Glòries 2026 — Torneig urbà a Barcelona, 6-7 Juny" }],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    title: "3×3 Glòries",
    capable: true,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "geo.region": "ES-CT",
    "geo.placename": "Barcelona",
    "geo.position": "41.4048;2.1896",
    ICBM: "41.4048, 2.1896",
    "msapplication-TileColor": "#0b1020",
    "pinterest-rich-pin": "true",
    "article:author": "CB Grup Barna",
    "article:section": "Bàsquet · Esports",
    "article:tag": "3x3, FIBA, Barcelona, Bàsquet, Westfield Glòries, Clot",
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0b1020",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// JSON-LD: SportsEvent (resultat ric a Google per a esdeveniments esportius)
const jsonLdEvent = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "3×3 Westfield Glòries 2026",
  alternateName: ["Torneig 3×3 FIBA Barcelona", "3x3 Glories Barcelona", "Torneo 3x3 Westfield Glòries"],
  description:
    "Torneig de bàsquet 3×3 amb punts FIBA i 2.000€ de premi en metàl·lic. 10 categories de Premini a Sènior Pro · 3 seus al barri del Clot-Glòries · Barcelona. 4a edició consecutiva (2023–2026).",
  startDate: "2026-06-06T09:00:00+02:00",
  endDate: "2026-06-07T20:00:00+02:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  sport: "Basketball 3x3",
  image: [OG_IMAGE],
  url: SITE_URL,
  location: [
    {
      "@type": "Place",
      name: "Westfield Glòries",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Av. Diagonal 208",
        addressLocality: "Barcelona",
        postalCode: "08018",
        addressRegion: "Catalunya",
        addressCountry: "ES",
      },
      geo: { "@type": "GeoCoordinates", latitude: 41.4048, longitude: 2.1896 },
    },
    {
      "@type": "Place",
      name: "La Nau del Clot",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Carrer de la Llacuna 172",
        addressLocality: "Barcelona",
        addressCountry: "ES",
      },
    },
    {
      "@type": "Place",
      name: "Rambleta del Clot",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Rambla del Poblenou / Clot",
        addressLocality: "Barcelona",
        addressCountry: "ES",
      },
    },
  ],
  organizer: [
    {
      "@type": "SportsOrganization",
      name: "CB Grup Barna",
      url: "https://cbgrupbarna.com",
      sameAs: ["https://www.instagram.com/cbgrupbarna/", "https://cbgrupbarna.com"],
    },
    { "@type": "Organization", name: "Time Chamber", url: "https://timechamber.es" },
    { "@type": "Organization", name: "Eix Clot" },
  ],
  offers: [
    {
      "@type": "AggregateOffer",
      name: "Inscripció equip 3×3",
      url: `${SITE_URL}/inscripcion`,
      lowPrice: "75",
      highPrice: "105",
      priceCurrency: "EUR",
      offerCount: "10",
      availability: "https://schema.org/InStock",
      validFrom: "2026-04-01T00:00:00+02:00",
    },
    {
      "@type": "Offer",
      name: "Inscripció individual (sense equip)",
      description:
        "Per jugadors que no tenen equip. El club l'assigna a un equip 1 setmana abans del torneig segons edat i posició.",
      url: `${SITE_URL}/inscripcio-individual`,
      price: "20",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: "2026-04-01T00:00:00+02:00",
    },
  ],
  performer: { "@type": "PerformingGroup", name: "Equips participants 3×3" },
  award:
    "Prize money 2.000€: Sèniors Masculí 1.000€ · Sèniors Femení 1.000€. Veterans M/F i categories formatives reben trofeus i medalles. + Punts FIBA 3×3 + Premis dels comerços col·laboradors",
};

// JSON-LD: SportsOrganization amb logo accessible (clau per al Knowledge Graph)
const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  "@id": `${SITE_URL}/#cb-grup-barna`,
  name: "CB Grup Barna",
  alternateName: ["Club Bàsquet Grup Barna", "Grup Barna", "Club Baloncesto Grup Barna"],
  url: "https://cbgrupbarna.com",
  foundingDate: "1965",
  logo: {
    "@type": "ImageObject",
    url: LOGO_512,
    width: 512,
    height: 512,
    caption: "Escut oficial del CB Grup Barna",
  },
  image: `${SITE_URL}/cb-grup-barna-logo-1024.png`,
  sport: "Basketball",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Carrer de la Llacuna 172",
    addressLocality: "Barcelona",
    postalCode: "08018",
    addressRegion: "Catalunya",
    addressCountry: "ES",
  },
  areaServed: { "@type": "City", name: "Barcelona" },
  telephone: "+34688265230",
  email: "voluntaris@grupbarna.info",
  sameAs: ["https://www.instagram.com/cbgrupbarna/", "https://cbgrupbarna.com"],
};

// JSON-LD: WebSite
const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: ["ca-ES", "es-ES"],
  publisher: { "@type": "SportsOrganization", name: "CB Grup Barna", url: "https://cbgrupbarna.com" },
};

// JSON-LD: FAQPage — 10 preguntes completes (GEO: cobertura long-tail màxima)
const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Què és el 3×3 Westfield Glòries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "És el torneig oficial de bàsquet 3×3 amb punts FIBA del barri del Clot-Glòries de Barcelona, organitzat per CB Grup Barna, Time Chamber i Eix Clot. La 4a edició es disputa el 6 i 7 de juny de 2026 amb 2.000 € de premi en metàl·lic per a les categories Sènior Masculí i Sènior Femení (1.000 € cadascuna), i trofeus i medalles per a la resta de categories.",
      },
    },
    {
      "@type": "Question",
      name: "Quan i on es juga el torneig 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Es disputa el dissabte 6 i el diumenge 7 de juny de 2026 a tres seus del barri del Clot-Glòries de Barcelona: Westfield Glòries (Av. Diagonal 208, seu principal), La Nau del Clot (Carrer de la Llacuna 172, pavelló oficial) i la Rambleta del Clot (pista exterior).",
      },
    },
    {
      "@type": "Question",
      name: "Com m'inscric al 3×3 Westfield Glòries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pel formulari online a cbgrupbarna-3x3timechamber.com/inscripcion. El procés té 5 passos: dades de l'equip, capità, jugadors (3-5), samarretes i pagament. La transferència bancària es fa amb un codi QR pre-omplert que escaneges amb l'app del banc. Confirmem la plaça en menys de 24h per email i WhatsApp.",
      },
    },
    {
      "@type": "Question",
      name: "Quant costa la inscripció per equip?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entre 75 € i 105 €. 75 € per equip de 3-4 jugadors (categories formatives), 85 € per equip de 3-4 jugadors Sèniors/Veterans, 90 € per equip de 5 jugadors (categoria general) i 105 € per equip de 5 jugadors Sèniors. Les samarretes addicionals costen 25 €/u. Hi ha un descompte del 10% per compartir el torneig a xarxes socials.",
      },
    },
    {
      "@type": "Question",
      name: "Quantes categories hi ha?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hi ha 10 categories: Premini (2016-17), Mini (2014-15), Infantil (2012-13), Cadet (2010-11), Júnior (2008-09), Sub-23 (2003-07), Sènior Masculí, Sènior Femení, Veterans Masculí (fins 1986) i Veterans Femení (fins 1986).",
      },
    },
    {
      "@type": "Question",
      name: "El torneig dóna punts FIBA 3×3?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. És un torneig oficial reconegut per FIBA 3×3. Els jugadors de les categories Sènior Masculí i Sènior Femení obtenen punts pel rànquing mundial individual de FIBA 3×3, que serveixen per accedir a competicions internacionals.",
      },
    },
    {
      "@type": "Question",
      name: "Puc inscriure'm sense equip?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. La inscripció individual costa 20 € i es fa a cbgrupbarna-3x3timechamber.com/inscripcio-individual. Apuntes les teves dades, talla i posició preferida; el club t'assigna a un equip una setmana abans del torneig. El preu inclou samarreta oficial, dorsal i accés als 2 dies.",
      },
    },
    {
      "@type": "Question",
      name: "Quants jugadors pot tenir un equip?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un equip pot tenir entre 3 i 5 jugadors (3 titulars + fins a 2 suplents). El mínim per jugar és 3 jugadors.",
      },
    },
    {
      "@type": "Question",
      name: "Hi ha pàrquing a la zona?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Westfield Glòries ofereix pàrquing gratuït durant 2 hores per als assistents al torneig. A més, es pot arribar fàcilment en metro (L1, estació Glòries) o en bus (línies de la Diagonal).",
      },
    },
    {
      "@type": "Question",
      name: "Com contacto amb l'organització?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pots contactar-nos a través del formulari a cbgrupbarna-3x3timechamber.com/contacte o per WhatsApp al +34 698 425 153. Resposta en menys de 24 hores en dies laborables.",
      },
    },
  ],
};

// JSON-LD: BreadcrumbList — navegació principal (millora rich results i comprensió d'IAs)
const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inici", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Inscripció d'equip", item: `${SITE_URL}/inscripcion` },
    { "@type": "ListItem", position: 3, name: "Inscripció individual", item: `${SITE_URL}/inscripcio-individual` },
    { "@type": "ListItem", position: 4, name: "Preguntes freqüents", item: `${SITE_URL}/preguntes-frequents` },
    { "@type": "ListItem", position: 5, name: "Patrocina el 3×3", item: `${SITE_URL}/patrocinar` },
    { "@type": "ListItem", position: 6, name: "Contacte", item: `${SITE_URL}/contacte` },
  ],
};

// JSON-LD: EventSeries — 4 edicions (GEO: estableix historial d'autoritat)
const jsonLdSeries = {
  "@context": "https://schema.org",
  "@type": "EventSeries",
  name: "3×3 Westfield Glòries",
  alternateName: "Torneig 3×3 FIBA Clot-Glòries Barcelona",
  description:
    "Sèrie anual de torneig de bàsquet 3×3 oficial FIBA al barri del Clot-Glòries de Barcelona, organitzat per CB Grup Barna · Time Chamber · Eix Clot des de 2023. 4 edicions consecutives (2023–2026).",
  startDate: "2023-06-01",
  url: SITE_URL,
  location: {
    "@type": "Place",
    name: "Westfield Glòries",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Diagonal 208",
      addressLocality: "Barcelona",
      postalCode: "08018",
      addressRegion: "Catalunya",
      addressCountry: "ES",
    },
    geo: { "@type": "GeoCoordinates", latitude: 41.4048, longitude: 2.1896 },
  },
  organizer: {
    "@type": "SportsOrganization",
    name: "CB Grup Barna",
    url: "https://cbgrupbarna.com",
    sameAs: ["https://www.instagram.com/cbgrupbarna/", "https://cbgrupbarna.com"],
  },
  subEvent: [
    { "@type": "SportsEvent", name: "3×3 Westfield Glòries 2023 — 1a edició", startDate: "2023-06-01", location: { "@type": "Place", name: "Westfield Glòries", address: { "@type": "PostalAddress", addressLocality: "Barcelona", addressCountry: "ES" } } },
    { "@type": "SportsEvent", name: "3×3 Westfield Glòries 2024 — 2a edició", startDate: "2024-06-01", location: { "@type": "Place", name: "Westfield Glòries", address: { "@type": "PostalAddress", addressLocality: "Barcelona", addressCountry: "ES" } } },
    { "@type": "SportsEvent", name: "3×3 Westfield Glòries 2025 — 3a edició", startDate: "2025-06-01", sameAs: "https://www.instagram.com/p/DJNKYiuMOGm/", location: { "@type": "Place", name: "Westfield Glòries", address: { "@type": "PostalAddress", addressLocality: "Barcelona", addressCountry: "ES" } } },
    { "@type": "SportsEvent", name: "3×3 Westfield Glòries 2026 — 4a edició", startDate: "2026-06-06", endDate: "2026-06-07", url: SITE_URL, location: { "@type": "Place", name: "Westfield Glòries", address: { "@type": "PostalAddress", streetAddress: "Av. Diagonal 208", addressLocality: "Barcelona", postalCode: "08018", addressCountry: "ES" } } },
  ],
  sameAs: "https://www.instagram.com/cbgrupbarna/",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" className={inter.className}>
      <head>
        {/* JSON-LD per a Google rich results + IAs (ChatGPT/Perplexity/Gemini llegeixen schema.org) */}
        <Script
          id="ld-event"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }}
        />
        <Script
          id="ld-series"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSeries) }}
        />
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <Script
          id="ld-faq"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
        <Script
          id="ld-breadcrumb"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
        {/* Clarity: skip analytics on localhost and ?noclarity=1 */}
        <Script
          id="clarity-opt-out"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
                var hasParam = location.search.indexOf('noclarity=1') !== -1;
                if(hasParam){ try{ localStorage.setItem('_clarity_opt','1'); }catch(e){} }
                var optOut = hasParam || isLocal || (function(){ try{ return localStorage.getItem('_clarity_opt')==='1'; }catch(e){ return false; } })();
                if(optOut){
                  window['clarity'] = window['clarity'] || function(){};
                  window['_clarity_blocked'] = true;
                }
              })();
            `,
          }}
        />
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              var pixelId = '${process.env.NEXT_PUBLIC_META_PIXEL_ID || ''}';
              if(pixelId){fbq('init',pixelId);fbq('track','PageView');}
            `,
          }}
        />
      </head>
      <body>
        <SiteNav />
        <StickyCtaBar />
        {children}
        <Script
          id="tracking-conversions"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('click',function(e){
                var link=e.target.closest('a');
                if(!link)return;
                var href=link.getAttribute('href')||'';
                if(href.includes('/inscripcion')||href.includes('/inscripcio')){
                  if(typeof gtag==='function')gtag('event','click_inscripcion',{event_category:'conversion'});
                  if(typeof fbq==='function')fbq('track','Lead',{content_name:'Inscripcion 3x3'});
                }
                if(href.includes('wa.me')||href.includes('whatsapp')){
                  if(typeof gtag==='function')gtag('event','click_whatsapp',{event_category:'conversion'});
                  if(typeof fbq==='function')fbq('track','Contact',{content_name:'WhatsApp 3x3'});
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
