// Configuració dels vídeos al hero de la home.
//
// Posa els fitxers MP4 a /public/videos/. Recomanat 2 variants:
//   - desktop: 1280p, sense àudio, faststart (~16MB OK)
//   - mobile: 960p o 720p, sense àudio (~3MB ideal)
//
// També pots usar Instagram Reels: el botó play obre el Reel a una nova pestanya
// (Instagram no permet autoplay extern).

export type HeroVideo = {
  /** "mp4" → vídeo natiu HTML5 amb autoplay muted loop · "instagram" → poster + click al Reel */
  type: "mp4" | "instagram";
  /** Per a mp4: ruta al fitxer desktop. Per a instagram: ID del Reel (ex: DJNKYiuMOGm) */
  source: string;
  /** (Només mp4) ruta opcional a una variant lleugera per a mòbil */
  sourceMobile?: string;
  /** URL d'una imatge de poster (recomanat per evitar flash negre) */
  poster?: string;
  /** Text descriptiu (només per a accessibilitat / debug) */
  title: string;
};

export const heroVideos: HeroVideo[] = [
  {
    type: "mp4",
    source: "/videos/hero-1-web.mp4",
    sourceMobile: "/videos/hero-1-mobile.mp4",
    poster: "/videos/hero-1-poster.jpg",
    title: "3×3 Westfield Glòries · highlight 2025",
  },
];
