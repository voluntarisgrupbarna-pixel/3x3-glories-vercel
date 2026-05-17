export default function ObertATothomSection() {
  return (
    <section id="obert-a-tothom" className="obert-section">
      <div className="section-inner">
        <header className="section-header">
          <span className="section-kicker">Diversitat &amp; Inclusió · Juny 2026</span>
          <h2 className="section-title">
            UN 3×3 <span className="accent">OBERT A TOTHOM</span>
          </h2>
          <p className="section-desc">
            Un torneig que creu en la diversitat com a motor de la millor competició.
            Tothom és benvingut/da — sobre la pista i a les grades.
          </p>
        </header>

        <div className="obert-cards">
          {/* ── Barna Màgics ── */}
          <div className="obert-card">
            <span className="obert-card-icon" aria-hidden="true">♿</span>
            <h3 className="obert-card-title">Barna Màgics — Categoria Inclusiva</h3>
            <p className="obert-card-body">
              La categoria <strong>Màgics · Inclusiva</strong> és <strong>competició real</strong>,
              no exhibició. Equips mixtos amb jugadors/es amb i sense discapacitat, regles adaptades
              per garantir la igualtat en pista. Mateixa intensitat, mateix trofeu.
            </p>
            <a href="/3x3-inclusivo-barcelona-magics" className="obert-card-cta">
              Coneix la categoria Màgics →
            </a>
          </div>

          {/* ── LGTBI+ Orgull ── */}
          <div className="obert-card obert-card--pride">
            <span className="obert-card-icon" aria-hidden="true">🏳️‍🌈</span>
            <h3 className="obert-card-title">Mes de l&apos;Orgull · Espai segur per a tothom</h3>
            <p className="obert-card-body">
              El torneig es juga durant el <strong>Mes de l&apos;Orgull LGTBI+</strong>. CB Grup Barna
              és un club on tothom és benvingut/da sense excepcions. Tolerància zero amb qualsevol
              forma de discriminació en pistes, grades i organització.
            </p>
            <a href="/contacte" className="obert-card-cta">
              Contacta&apos;ns si tens dubtes →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
