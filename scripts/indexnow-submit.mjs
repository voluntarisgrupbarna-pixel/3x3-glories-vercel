/**
 * IndexNow — submissió massiva de totes les URLs del lloc
 * Notifica Bing (→ ChatGPT), Yandex i indexnow.org en un sol crit
 *
 * Ús: node scripts/indexnow-submit.mjs
 */

const SITE_URL = "https://cbgrupbarna-3x3timechamber.com";
const INDEX_NOW_KEY = "b09dfdee2daf4e85ba6524daf7533e28";
const KEY_LOCATION = `${SITE_URL}/${INDEX_NOW_KEY}.txt`;

const URLS = [
  `${SITE_URL}/`,
  `${SITE_URL}/inscripcion`,
  `${SITE_URL}/inscripcio-individual`,
  `${SITE_URL}/preguntes-frequents`,
  `${SITE_URL}/contacte`,
  `${SITE_URL}/patrocinar`,
  `${SITE_URL}/equip`,
  `${SITE_URL}/seu/westfield-glories`,
  `${SITE_URL}/seu/nau-del-clot`,
  `${SITE_URL}/seu/rambleta-del-clot`,
  `${SITE_URL}/torneo-3x3-senior-fiba-barcelona`,
  `${SITE_URL}/torneo-3x3-femenino-barcelona`,
  `${SITE_URL}/torneo-3x3-veteranos-barcelona`,
  `${SITE_URL}/3x3-inclusivo-barcelona-magics`,
  `${SITE_URL}/horarios-3x3-barcelona-2026`,
  `${SITE_URL}/es/torneo-3x3-barcelona`,
];

const ENGINES = [
  "https://api.indexnow.org/IndexNow",
  "https://www.bing.com/IndexNow",
  "https://yandex.com/indexnow",
];

async function submit(engine) {
  const body = JSON.stringify({
    host: new URL(SITE_URL).hostname,
    key: INDEX_NOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS,
  });

  const res = await fetch(engine, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body,
  });

  return { engine, status: res.status, ok: res.ok };
}

console.log(`🏀 IndexNow — ${URLS.length} URLs → ${ENGINES.length} cercadors\n`);

const results = await Promise.all(ENGINES.map(submit));
results.forEach(({ engine, status, ok }) => {
  const icon = ok ? "✅" : "❌";
  console.log(`${icon} ${status} — ${engine}`);
});

console.log("\nFet. Bing processarà les URLs en minuts → ChatGPT les veurà en dies.");
