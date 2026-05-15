import type { MetadataRoute } from "next";

const SITE_URL = "https://cbgrupbarna-3x3timechamber.com";

function langs(path: string): { languages: Record<string, string> } {
  const url = `${SITE_URL}${path}`;
  return { languages: { ca: url, es: url, "x-default": url } };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: langs("/"),
    },
    {
      url: `${SITE_URL}/inscripcion`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.95,
      alternates: langs("/inscripcion"),
    },
    {
      url: `${SITE_URL}/inscripcio-individual`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: langs("/inscripcio-individual"),
    },
    {
      url: `${SITE_URL}/preguntes-frequents`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: langs("/preguntes-frequents"),
    },
    {
      url: `${SITE_URL}/contacte`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: langs("/contacte"),
    },
    {
      url: `${SITE_URL}/seu/westfield-glories`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
      alternates: langs("/seu/westfield-glories"),
    },
    {
      url: `${SITE_URL}/seu/nau-del-clot`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
      alternates: langs("/seu/nau-del-clot"),
    },
    {
      url: `${SITE_URL}/seu/rambleta-del-clot`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
      alternates: langs("/seu/rambleta-del-clot"),
    },
    {
      url: `${SITE_URL}/patrocinar`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: langs("/patrocinar"),
    },
    {
      url: `${SITE_URL}/equip`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: langs("/equip"),
    },
    {
      url: `${SITE_URL}/torneo-3x3-femenino-barcelona`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: langs("/torneo-3x3-femenino-barcelona"),
    },
    {
      url: `${SITE_URL}/torneo-3x3-senior-fiba-barcelona`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: langs("/torneo-3x3-senior-fiba-barcelona"),
    },
    {
      url: `${SITE_URL}/es/torneo-3x3-barcelona`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: langs("/es/torneo-3x3-barcelona"),
    },
  ];
}
