import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

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
    "El torneig 3×3 més potent de Barcelona. Punts FIBA, 2.400€ prize money (1.000€ per cada Sèniors M/F + 200€ Veterans M/F). 6-7 Juny 2026 al Clot-Glòries. Inscriu-te ja!",
  keywords: [
    "3x3 Barcelona",
    "torneig 3x3 FIBA",
    "Westfield Glòries",
    "basquet 3x3",
    "basquet de carrer Barcelona",
    "CB Grup Barna",
    "Time Chamber",
    "prize money 3x3",
    "ranking FIBA 3x3",
    "Sant Martí",
    "Clot",
    "Barcelona basquet",
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
      "El torneig 3×3 més potent de Barcelona. Punts FIBA, 2.400€ prize money (1.000€ Sèniors M/F + 200€ Veterans M/F). 6-7 Juny 2026 al Clot-Glòries. Inscriu-te ja!",
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
      "Torneig 3×3 FIBA · 2.400€ prize money (Sèniors M/F · Veterans M/F) · 6-7 Juny 2026. Places limitades — inscriu-te ja!",
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
  alternateName: "Torneig 3×3 FIBA Barcelona",
  description:
    "Torneig de bàsquet 3×3 amb punts FIBA i prize money. Categories de Premini a Senior Pro · 3 seus al barri del Clot-Glòries · Barcelona.",
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
      url: "https://www.instagram.com/cbgrupbarna/",
      sameAs: "https://www.instagram.com/cbgrupbarna/",
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
  alternateName: ["Club Bàsquet Grup Barna", "Grup Barna"],
  url: SITE_URL,
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
  inLanguage: "ca-ES",
  publisher: { "@type": "SportsOrganization", name: "CB Grup Barna" },
};

// JSON-LD: FAQPage (long-tail SEO + rich results)
const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Què és el 3×3 Westfield Glòries?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "És el torneig oficial de bàsquet 3×3 amb punts FIBA del barri del Clot-Glòries de Barcelona, organitzat per CB Grup Barna · Time Chamber · Eix Clot. La 4a edició es disputa el 6 i 7 de juny de 2026 amb 2.000€ de prize money (1.000€ per cada Sèniors Masculí i Sèniors Femení; la resta de categories reben trofeus i medalles) i jugadors de tota la península.",
      },
    },
    {
      "@type": "Question",
      name: "Quan i on es juga el torneig 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Es disputa el dissabte 6 i diumenge 7 de juny de 2026 a tres seus del barri del Clot-Glòries de Barcelona: Westfield Glòries (Av. Diagonal 208, seu principal), La Nau del Clot (Carrer de la Llacuna 172, pavelló oficial) i Rambleta del Clot (pista exterior).",
      },
    },
    {
      "@type": "Question",
      name: "Com m'inscric al 3×3 Westfield Glòries?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Pel formulari online a cbgrupbarna-3x3timechamber.com/inscripcion. El procés té 5 passos: dades de l'equip, capità, jugadors (3-5), samarretes i pagament. La transferència bancària es fa amb un codi QR pre-omplert que escaneges amb l'app del banc. Confirmem la plaça en menys de 24h per email i WhatsApp.",
      },
    },
    {
      "@type": "Question",
      name: "Quant costa la inscripció?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Entre 75€ i 105€ per equip. 75€ equip de 4 jugadors (categoria general), 85€ equip de 4 jugadors (Sèniors), 90€ equip de 5 jugadors (general), 105€ equip de 5 jugadors (Sèniors). Samarretes addicionals opcionals a 25€/u (per acompanyants o recanvi). Hi ha descompte del 10% si comparteixes el torneig amb amics per WhatsApp i segueixes @cbgrupbarna a Instagram, però és opcional: pots saltar el gate i pagar el preu base sense compartir.",
      },
    },
    {
      "@type": "Question",
      name: "El torneig dóna punts FIBA 3×3?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sí. És un torneig oficial reconegut per FIBA 3×3, així que els jugadors Sèniors obtenen punts pel ranking mundial individual de FIBA 3×3 que sumen per accedir a competicions internacionals.",
      },
    },
    {
      "@type": "Question",
      name: "Puc inscriure'm sense equip?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sí. La inscripció individual costa 20€ i és a /inscripcio-individual. Apuntes les teves dades, talla i posició preferida; el club t'assigna a un equip una setmana abans del torneig segons categoria d'edat i nivell. El preu inclou samarreta oficial, dorsal i accés als 2 dies.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <head>
        {/* JSON-LD per a Google rich results + IAs (ChatGPT/Perplexity llegeixen schema.org) */}
        <Script
          id="ld-event"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }}
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
