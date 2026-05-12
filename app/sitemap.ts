import type { MetadataRoute } from "next";

const SITE_URL = "https://cbgrupbarna-3x3timechamber.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-05-11");

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/inscripcion`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/inscripcio-individual`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/preguntes-frequents`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/contacte`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/seu/westfield-glories`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/seu/nau-del-clot`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/seu/rambleta-del-clot`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/equip`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
