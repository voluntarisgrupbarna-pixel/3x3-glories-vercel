export default function PrideBanner() {
  return (
    <section className="pride-banner" aria-label="Mes de l'Orgull LGTBI+">
      {/* Franja arc de Sant Martí */}
      <div className="pride-rainbow" aria-hidden="true">
        <span style={{ background: "#FF0018" }} />
        <span style={{ background: "#FFA52C" }} />
        <span style={{ background: "#FFFF41" }} />
        <span style={{ background: "#008018" }} />
        <span style={{ background: "#0000F9" }} />
        <span style={{ background: "#86007D" }} />
      </div>

      <div className="pride-inner">
        <div className="pride-left">
          <span className="pride-flag" aria-hidden="true">🏳️‍🌈</span>
          <div>
            <p className="pride-label">JUNY · MES DE L&apos;ORGULL LGTBI+</p>
            <h2 className="pride-title">
              El 3×3 Barna juga amb tothom
            </h2>
            <p className="pride-sub">
              El torneig se celebra durant el <strong>Mes de l&apos;Orgull</strong>.
              Espai segur, competició real, diversitat a la pista i a les grades.
              Tolerància zero amb qualsevol discriminació.
            </p>
          </div>
        </div>
        <div className="pride-right">
          <a href="/3x3-inclusivo-barcelona-magics" className="pride-cta">
            Categoria Màgics · Inclusiva →
          </a>
          <p className="pride-org">CB Grup Barna · Sant Martí · Barcelona</p>
        </div>
      </div>
    </section>
  );
}
