import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Normes 3×3 FIBA — Regles oficials del bàsquet 3×3 | Westfield Glòries 2026",
  description:
    "Totes les normes oficials FIBA del bàsquet 3×3: durada, puntuació, faltes, possessions, rellotge de tir i check-ball. Aprèn les regles antes d'inscriure't al 3×3 Westfield Glòries 2026.",
  alternates: {
    canonical: "/regles-3x3",
  },
  openGraph: {
    title: "Normes 3×3 FIBA — Regles oficials del bàsquet 3×3",
    description:
      "Totes les normes oficials FIBA del bàsquet 3×3: durada, puntuació, faltes, possessions i rellotge de tir. Torneig Westfield Glòries 2026.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Normes oficials FIBA del bàsquet 3×3",
  description:
    "Guia completa de les regles oficials FIBA del bàsquet 3×3: terreny de joc, equips, durada, puntuació, possessions, faltes, rellotge de tir i substitucions.",
  url: `${SITE_URL}/regles-3x3`,
  author: {
    "@type": "Organization",
    name: "CB Grup Barna",
    url: "https://cbgrupbarna.com",
  },
  publisher: {
    "@type": "Organization",
    name: "CB Grup Barna",
    logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
  },
  about: {
    "@type": "SportsEvent",
    name: "3×3 Westfield Glòries 2026",
    url: `${SITE_URL}/`,
  },
};

// ── Dades de les regles ───────────────────────────────────────────────────

const REGLES = [
  {
    id: "terreny",
    emoji: "🏟️",
    titol: "Terreny de joc",
    titolEs: "Terreno de juego",
    punts: [
      "Mitja pista de bàsquet (aproximadament 15 m × 11 m).",
      "1 sola cistella — tots dos equips ataquen la mateixa cistella.",
      "Arc dels 2 punts a 6,75 m del centre de la cistella (mateixa distància que el triple de bàsquet 5×5).",
      "Línia de tirs lliures a 5,80 m.",
      "No hi ha zona de 3 segons ni zona restricta.",
    ],
    puntues: [
      "Pista mitja (aproximadamente 15 m × 11 m).",
      "1 sola canasta — ambos equipos atacan la misma canasta.",
      "Arco de 2 puntos a 6,75 m del centro de la canasta.",
      "Línea de tiros libres a 5,80 m.",
      "No hay zona de 3 segundos ni zona restringida.",
    ],
  },
  {
    id: "equips",
    emoji: "👥",
    titol: "Equips i jugadors",
    titolEs: "Equipos y jugadores",
    punts: [
      "4 jugadors per equip: 3 en pista i 1 suplent.",
      "Mateixes regles per a equips masculins, femenins i mixtos.",
      "No hi ha entrenador a pista — els jugadors s'autogestionan.",
      "Substitucions lliures quan la pilota és morta, des de darrere la línia de fons. No cal avisar l'àrbitre.",
    ],
    puntues: [
      "4 jugadores por equipo: 3 en pista y 1 suplente.",
      "Mismas reglas para equipos masculinos, femeninos y mixtos.",
      "No hay entrenador en pista — los jugadores se autogestionan.",
      "Sustituciones libres cuando el balón está muerto, desde detrás de la línea de fondo. No hace falta avisar al árbitro.",
    ],
  },
  {
    id: "durada",
    emoji: "⏱️",
    titol: "Durada del partit",
    titolEs: "Duración del partido",
    punts: [
      "10 minuts de joc efectiu (1 sol període) — o bé el primer equip a arribar a 21 punts, el que passi primer.",
      "El rellotge s'atura en totes les pilotes mortes (faltes, violacions, temps morts) i durant els tirs lliures.",
      "Si hi ha empat en acabar els 10 minuts: pròrroga. El primer equip a marcar 2 punts en la pròrroga guanya el partit.",
      "Diferent del bàsquet 5×5: no hi ha primer temps ni descans — el partit és un sol període.",
    ],
    puntues: [
      "10 minutos de juego efectivo (1 solo período) — o bien el primer equipo en llegar a 21 puntos, lo que ocurra antes.",
      "El reloj se para en todos los balones muertos (faltas, violaciones, tiempos muertos) y durante los tiros libres.",
      "Si hay empate al acabar los 10 minutos: prórroga. El primer equipo en anotar 2 puntos en la prórroga gana el partido.",
      "Diferente al baloncesto 5×5: no hay primer tiempo ni descanso — el partido es un solo período.",
    ],
  },
  {
    id: "puntuacio",
    emoji: "🏀",
    titol: "Puntuació",
    titolEs: "Puntuación",
    punts: [
      "1 punt — tir anotat des de dins de l'arc (zona de 2 en bàsquet 5×5).",
      "2 punts — tir anotat des de fora de l'arc (zona de 3 en bàsquet 5×5), incloent el llançament en el moment de rebre la falta.",
      "1 punt — tir lliure anotat.",
      "And-1: cistella aconseguida amb falta simultània → 1 punt del llançament + 1 tir lliure addicional.",
    ],
    puntues: [
      "1 punto — tiro anotado desde dentro del arco (zona de 2 en baloncesto 5×5).",
      "2 puntos — tiro anotado desde fuera del arco (zona de 3 en baloncesto 5×5), incluido el lanzamiento en el momento de recibir la falta.",
      "1 punto — tiro libre anotado.",
      "And-1: canasta conseguida con falta simultánea → 1 punto del lanzamiento + 1 tiro libre adicional.",
    ],
  },
  {
    id: "possessions",
    emoji: "🔄",
    titol: "Possessions i check-ball",
    titolEs: "Posesiones y check-ball",
    punts: [
      "Inici: sorteig de moneda determina qui té la primera possessió. No hi ha salt inicial.",
      "Check-ball: al principi de cada possessió (després de pilota morta), el defensor entrega la pilota a l'atacant darrere de l'arc. El joc no continua fins que el defensor toca la pilota.",
      "Després d'una cistella aconseguida: l'equip defensor agafa la pilota i ha de treure-la fora de l'arc per reiniciar l'atac.",
      "Després d'un rebot ofensiu o defensiu: el jugador que agafa la pilota ha de treure-la clarament fora de l'arc abans d'atacar. Excepció: si el jugador rep la pilota directament sota cistella i en control, pot finalitzar sense treure-la.",
      "Canvi de possessió per qualsevol pilota morta (falta, sortida de pista, violació): check-ball obligatori.",
    ],
    puntues: [
      "Inicio: sorteo de moneda determina quién tiene la primera posesión. No hay salto inicial.",
      "Check-ball: al principio de cada posesión (tras balón muerto), el defensor entrega el balón al atacante detrás del arco. El juego no continúa hasta que el defensor toca el balón.",
      "Tras una canasta conseguida: el equipo defensor agarra el balón y debe sacarlo fuera del arco para reiniciar el ataque.",
      "Tras un rebote ofensivo o defensivo: el jugador que agarra el balón debe sacarlo claramente fuera del arco antes de atacar. Excepción: si el jugador recibe el balón directamente bajo canasta y en control, puede finalizar sin sacarlo.",
      "Cambio de posesión por cualquier balón muerto (falta, salida de pista, violación): check-ball obligatorio.",
    ],
  },
  {
    id: "rellotge",
    emoji: "⚡",
    titol: "Rellotge de tir",
    titolEs: "Reloj de posesión",
    punts: [
      "12 segons per llançar a cistella (vs. 24 seg. en bàsquet 5×5).",
      "El rellotge s'activa quan el defensor toca la pilota en el check-ball.",
      "Si el rellotge arriba a 0 sense llançament: violació → possessió per a l'equip defensor amb check-ball.",
      "Rebot ofensiu: el rellotge es reinicia a 12 segons.",
    ],
    puntues: [
      "12 segundos para lanzar a canasta (vs. 24 seg. en baloncesto 5×5).",
      "El reloj se activa cuando el defensor toca el balón en el check-ball.",
      "Si el reloj llega a 0 sin lanzamiento: violación → posesión para el equipo defensor con check-ball.",
      "Rebote ofensivo: el reloj se reinicia a 12 segundos.",
    ],
  },
  {
    id: "faltes",
    emoji: "✋",
    titol: "Faltes",
    titolEs: "Faltas",
    punts: [
      "Faltes 1 a 6 per equip i partit: si no hi ha tir, l'equip atacant tria entre 2 tirs lliures o seguir jugant des del lloc de la falta amb check-ball.",
      "Faltes 7, 8 i 9 per equip: 2 tirs lliures garantits.",
      "Falta 10 i posteriors: 2 tirs lliures + possessió per a l'equip atacant.",
      "Falta en acció de tir d'1 punt (dins arc): 1 tir lliure. Si s'anota cistella, 1 tir lliure addicional (and-1).",
      "Falta en acció de tir de 2 punts (fora arc): 2 tirs lliures.",
      "No hi ha eliminació per 5 faltes personals. Un jugador és expulsat per falta antiesportiva o descalificadora.",
      "Falta tècnica: equip rival tria 1 tir lliure o check-ball.",
    ],
    puntues: [
      "Faltas 1 a 6 por equipo y partido: si no hay tiro, el equipo atacante elige entre 2 tiros libres o seguir jugando desde el lugar de la falta con check-ball.",
      "Faltas 7, 8 y 9 por equipo: 2 tiros libres garantizados.",
      "Falta 10 y posteriores: 2 tiros libres + posesión para el equipo atacante.",
      "Falta en acción de tiro de 1 punto (dentro del arco): 1 tiro libre. Si se anota canasta, 1 tiro libre adicional (and-1).",
      "Falta en acción de tiro de 2 puntos (fuera del arco): 2 tiros libres.",
      "No hay eliminación por 5 faltas personales. Un jugador es expulsado por falta antideportiva o descalificadora.",
      "Falta técnica: equipo rival elige 1 tiro libre o check-ball.",
    ],
  },
  {
    id: "temps-morts",
    emoji: "⏸️",
    titol: "Temps morts i substitucions",
    titolEs: "Tiempos muertos y sustituciones",
    punts: [
      "Cada equip disposa d'1 temps mort per partit (30 segons).",
      "El temps mort només es pot demanar quan la pilota és morta i l'equip té possessió (o empat de possessió).",
      "Substitucions: en qualsevol pilota morta, el jugador suplent entra per darrere la línia de fons sense avisar l'àrbitre.",
      "No hi ha límit de substitucions.",
    ],
    puntues: [
      "Cada equipo dispone de 1 tiempo muerto por partido (30 segundos).",
      "El tiempo muerto solo se puede pedir cuando el balón está muerto y el equipo tiene posesión (o empate de posesión).",
      "Sustituciones: en cualquier balón muerto, el jugador suplente entra por detrás de la línea de fondo sin avisar al árbitro.",
      "No hay límite de sustituciones.",
    ],
  },
  {
    id: "joc-passiu",
    emoji: "🚫",
    titol: "Joc passiu i altres violacions",
    titolEs: "Juego pasivo y otras violaciones",
    punts: [
      "Joc passiu (stalling): si un equip no intenta avançar cap a cistella, l'àrbitre pot avisar i, si persisteix, decretar violació amb canvi de possessió.",
      "Pilota fora de pista: check-ball per a l'equip contrari al punt més proper a on ha sortit.",
      "Dobles (butxifles): violació → check-ball per a l'equip defensor.",
      "Passos: violació → check-ball per a l'equip defensor.",
      "Pilota dreta (held ball): possessió alternada (Arrow possession).",
      "Esmaixades: permeses i vàlides (1 punt si des de dins l'arc).",
    ],
    puntues: [
      "Juego pasivo (stalling): si un equipo no intenta avanzar hacia canasta, el árbitro puede avisar y, si persiste, decretar violación con cambio de posesión.",
      "Balón fuera de pista: check-ball para el equipo contrario en el punto más cercano a donde ha salido.",
      "Dobles (bot-bot): violación → check-ball para el equipo defensor.",
      "Pasos: violación → check-ball para el equipo defensor.",
      "Balón agarrado (held ball): posesión alternada (Arrow possession).",
      "Mates: permitidos y válidos (1 punto si desde dentro del arco).",
    ],
  },
  {
    id: "pilota",
    emoji: "🟠",
    titol: "Pilota oficial",
    titolEs: "Balón oficial",
    punts: [
      "Pilota oficial FIBA 3×3: mida 6 (com les dones en bàsquet 5×5) però amb el pes d'una mida 7 (com els homes).",
      "Diàmetre lleugerament inferior al bàsquet estàndard — facilita el maneig amb una sola mà.",
      "Al torneig Westfield Glòries, el club proporciona les pilotes oficials per a tots els partits.",
    ],
    puntues: [
      "Balón oficial FIBA 3×3: talla 6 (como las mujeres en baloncesto 5×5) pero con el peso de una talla 7 (como los hombres).",
      "Diámetro ligeramente inferior al baloncesto estándar — facilita el manejo con una sola mano.",
      "En el torneo Westfield Glòries, el club proporciona los balones oficiales para todos los partidos.",
    ],
  },
];

const DIFERENCIES = [
  { cat: "Durada", x5: "4 períodes de 10 min", x3: "10 min o primer a 21 pts" },
    { cat: "Cistelles", x5: "2 cistelles", x3: "1 cistella (mitja pista)" },
    { cat: "Jugadors", x5: "5 en pista + 7 suplents", x3: "3 en pista + 1 suplent" },
  { cat: "Puntuació", x5: "2 pts dins / 3 pts fora", x3: "1 pt dins / 2 pts fora" },
  { cat: "Rellotge tir", x5: "24 segons", x3: "12 segons" },
  { cat: "Temps morts", x5: "Diversos per equip", x3: "1 per equip i partit" },
  { cat: "Faltes personals", x5: "5 → eliminació", x3: "Sense límit personal" },
  { cat: "Pilota", x5: "Talla 7 (homes) / 6 (dones)", x3: "Talla 6 amb pes de 7" },
  { cat: "Inici", x5: "Salt inicial", x3: "Sorteig de moneda" },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function ReglesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="page-shell">
        <nav className="page-nav">
          <Link href="/" className="page-nav-back">← Inici</Link>
          <span className="page-nav-logo">3×3 Glòries 2026</span>
        </nav>

        <main className="page-content" style={{ paddingTop: "40px", maxWidth: 780 }}>

          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#ff5b1f", textTransform: "uppercase", marginBottom: 12 }}>
              Torneig Westfield Glòries 2026 · CB Grup Barna
            </p>
            <h1 style={{ fontSize: "clamp(32px, 7vw, 56px)", fontWeight: 900, color: "#fff7ef", lineHeight: 1.1, margin: "0 0 16px" }}>
              Normes oficials<br />del bàsquet 3×3
            </h1>
            <p style={{ color: "#c8b99a", fontSize: "clamp(15px, 2.5vw, 18px)", maxWidth: 560, margin: "0 auto 24px" }}>
              Reglament FIBA 3×3 vigent per al torneig 3×3 Westfield Glòries 2026.
              Si vens de jugar a 5×5, les diferències clau les trobaràs al final de la pàgina.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/inscripcion" className="page-cta-btn">
                Inscriu el teu equip →
              </Link>
              <Link href="/preguntes-frequents" className="page-cta-btn-ghost">
                Preguntes freqüents
              </Link>
            </div>
          </div>

          {/* Regles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32, marginBottom: 56 }}>
            {REGLES.map((r) => (
              <section
                key={r.id}
                id={r.id}
                style={{
                  background: "#1a1a1a",
                  borderRadius: 14,
                  padding: "28px 28px 24px",
                  border: "1px solid #2a2a2a",
                }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff7ef", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{r.emoji}</span>
                  {r.titol}
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#666", marginLeft: 4 }}>· {r.titolEs}</span>
                </h2>

                {/* Català */}
                <ul style={{ margin: 0, padding: "0 0 0 20px", listStyleType: "disc", display: "flex", flexDirection: "column", gap: 8 }}>
                  {r.punts.map((p, i) => (
                    <li key={i} style={{ color: "#d4c9b8", fontSize: 15, lineHeight: 1.6 }}>{p}</li>
                  ))}
                </ul>

                {/* Castellà */}
                <details style={{ marginTop: 16 }}>
                  <summary style={{ fontSize: 13, color: "#666", cursor: "pointer", userSelect: "none" }}>
                    Ver en castellano
                  </summary>
                  <ul style={{ margin: "12px 0 0 20px", padding: 0, listStyleType: "disc", display: "flex", flexDirection: "column", gap: 8 }}>
                    {r.puntues.map((p, i) => (
                      <li key={i} style={{ color: "#888", fontSize: 14, lineHeight: 1.6 }}>{p}</li>
                    ))}
                  </ul>
                </details>
              </section>
            ))}
          </div>

          {/* Taula comparativa 3×3 vs 5×5 */}
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff7ef", margin: "0 0 8px", textAlign: "center" }}>
              3×3 vs. 5×5 — Principals diferències
            </h2>
            <p style={{ color: "#888", fontSize: 14, textAlign: "center", marginBottom: 24 }}>
              Si ja juques a bàsquet convencional, aquí tens el resum de canvis clau.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#1a1a1a" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", color: "#888", fontWeight: 600, borderBottom: "1px solid #2a2a2a" }}>
                      Aspecte
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", color: "#4a9eff", fontWeight: 600, borderBottom: "1px solid #2a2a2a" }}>
                      Bàsquet 5×5
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", color: "#ff5b1f", fontWeight: 600, borderBottom: "1px solid #2a2a2a" }}>
                      🏀 3×3 FIBA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DIFERENCIES.map((d, i) => (
                    <tr
                      key={d.cat}
                      style={{ background: i % 2 === 0 ? "transparent" : "#141414" }}
                    >
                      <td style={{ padding: "11px 16px", color: "#c8b99a", fontWeight: 600, borderBottom: "1px solid #1e1e1e" }}>
                        {d.cat}
                      </td>
                      <td style={{ padding: "11px 16px", color: "#999", borderBottom: "1px solid #1e1e1e" }}>
                        {d.x5}
                      </td>
                      <td style={{ padding: "11px 16px", color: "#fff7ef", borderBottom: "1px solid #1e1e1e", fontWeight: 500 }}>
                        {d.x3}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Índex ràpid */}
          <section style={{ background: "#111", borderRadius: 14, padding: "24px 28px", marginBottom: 48, border: "1px solid #2a2a2a" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>
              Índex de seccions
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
              {REGLES.map((r) => (
                <a
                  key={r.id}
                  href={`#${r.id}`}
                  style={{ color: "#c8b99a", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span>{r.emoji}</span> {r.titol}
                </a>
              ))}
            </div>
          </section>

          {/* CTA final */}
          <div style={{
            background: "linear-gradient(135deg, #1a0a00 0%, #2a1000 100%)",
            borderRadius: 16,
            padding: "36px 28px",
            textAlign: "center",
            border: "1px solid #3a1800",
            marginBottom: 48,
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#ff5b1f", textTransform: "uppercase", marginBottom: 8 }}>
              6-7 juny 2026 · Westfield Glòries, Barcelona
            </p>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff7ef", margin: "0 0 12px" }}>
              Ja coneixes les regles.<br />Ara inscriu el teu equip.
            </h2>
            <p style={{ color: "#c8b99a", fontSize: 15, marginBottom: 24 }}>
              Des de 75 € · 10 categories · Premi 2.000 € Sènior · Places limitades
            </p>
            <Link href="/inscripcion" className="page-cta-btn" style={{ fontSize: 17, padding: "14px 36px" }}>
              Inscriu-te ara →
            </Link>
            <p style={{ color: "#555", fontSize: 13, marginTop: 16 }}>
              Dubtes?{" "}
              <Link href="/preguntes-frequents" style={{ color: "#888" }}>
                FAQ
              </Link>{" "}
              ·{" "}
              <Link href="/contacte?contacte=1" style={{ color: "#25d366" }}>
                WhatsApp
              </Link>
            </p>
          </div>

          {/* Nota legal */}
          <p style={{ color: "#444", fontSize: 12, textAlign: "center", marginBottom: 48, lineHeight: 1.7 }}>
            Normes basades en el reglament oficial FIBA 3×3 vigent (versió 2024).
            Per a situacions no contemplades aquí, s&apos;aplicarà el criteri de l&apos;àrbitre del torneig seguint el reglament FIBA.{" "}
            <a href="https://www.fiba.basketball/3x3/rules" target="_blank" rel="noreferrer" style={{ color: "#666" }}>
              Reglament complet a fiba.basketball →
            </a>
          </p>

        </main>
      </div>
    </>
  );
}
