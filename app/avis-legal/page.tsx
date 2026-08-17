import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avís Legal, RGPD i Protecció del Menor | 3×3 Westfield Glòries",
  description:
    "Avís legal del 3×3 Westfield Glòries: compliment del RGPD, LOPDGDD i protecció del menor (LOPIVI). Responsable del tractament, drets de les persones interessades i consentiment d'imatge de menors.",
  alternates: { canonical: "/avis-legal" },
  robots: { index: true, follow: true },
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 28,
};

const h2Style: React.CSSProperties = {
  color: "#fff",
  fontSize: "1.15rem",
  fontWeight: 800,
  margin: "0 0 10px",
};

const pStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.75)",
  fontSize: "0.92rem",
  lineHeight: 1.65,
  margin: "0 0 10px",
};

export default function AvisLegalPage() {
  return (
    <main className="lead-page">
      <div className="lead-page-backdrop" aria-hidden="true" />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 680,
          margin: "0 auto",
          padding: "40px 20px 80px",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 900, margin: "0 0 6px" }}>
          Avís Legal, RGPD i Protecció del Menor
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", margin: "0 0 32px" }}>
          CB Grup Barna · 3×3 Westfield Glòries · Última actualització: agost 2026
        </p>

        {/* ---------- CATALÀ ---------- */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Català</h2>
          <p style={pStyle}>
            <strong>CB Grup Barna</strong> (club de bàsquet base del Districte de Sant Martí,
            Barcelona, fundat el 1965) és responsable del tractament de les dades personals
            recollides a través d&apos;aquesta web i dels seus formularis d&apos;inscripció. Les
            dades es tracten d&apos;acord amb el <strong>Reglament (UE) 2016/679 (RGPD)</strong> i
            la <strong>Llei orgànica 3/2018, de protecció de dades personals i garantia dels
            drets digitals (LOPDGDD)</strong>.
          </p>
          <p style={pStyle}>
            Quan les persones inscrites són <strong>menors d&apos;edat</strong>, el club
            sol·licita el consentiment exprés de la mare, el pare o el tutor/a legal per al
            tractament de les seves dades i, de manera específica i separada, per a l&apos;ús
            de la seva imatge, d&apos;acord amb la <strong>Llei orgànica 1/1996, de protecció
            jurídica del menor</strong>, i la <strong>Llei orgànica 8/2021, de protecció
            integral a la infància i l&apos;adolescència davant la violència (LOPIVI)</strong>.
            El club compta amb Delegat de Protecció del Menor. Les imatges de menors només es
            publiquen amb consentiment escrit previ de la família i es poden retirar en
            qualsevol moment a petició seva.
          </p>
          <p style={pStyle}>
            Les dades es conserven únicament durant el temps necessari per a la finalitat per
            la qual es van recollir (gestió de la inscripció i comunicació de l&apos;esdeveniment)
            i no es cedeixen a tercers, tret d&apos;obligació legal. Podeu exercir els drets
            d&apos;accés, rectificació, supressió, oposició, limitació i portabilitat escrivint a{" "}
            <a href="mailto:voluntarisgrupbarna@gmail.com" style={{ color: "#fff" }}>
              voluntarisgrupbarna@gmail.com
            </a>
            .
          </p>
        </section>

        {/* ---------- CASTELLANO ---------- */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Castellano</h2>
          <p style={pStyle}>
            <strong>CB Grup Barna</strong> (club de baloncesto base del Distrito de Sant Martí,
            Barcelona, fundado en 1965) es responsable del tratamiento de los datos personales
            recogidos a través de esta web y de sus formularios de inscripción. Los datos se
            tratan conforme al <strong>Reglamento (UE) 2016/679 (RGPD)</strong> y la{" "}
            <strong>Ley Orgánica 3/2018, de protección de datos personales y garantía de los
            derechos digitales (LOPDGDD)</strong>.
          </p>
          <p style={pStyle}>
            Cuando las personas inscritas son <strong>menores de edad</strong>, el club solicita
            el consentimiento expreso de la madre, el padre o el tutor/a legal para el
            tratamiento de sus datos y, de forma específica y separada, para el uso de su
            imagen, conforme a la <strong>Ley Orgánica 1/1996, de protección jurídica del
            menor</strong>, y la <strong>Ley Orgánica 8/2021, de protección integral a la
            infancia y la adolescencia frente a la violencia (LOPIVI)</strong>. El club cuenta
            con Delegado de Protección del Menor. Las imágenes de menores solo se publican con
            consentimiento escrito previo de la familia y pueden retirarse en cualquier momento
            a petición suya.
          </p>
          <p style={pStyle}>
            Los datos se conservan únicamente durante el tiempo necesario para la finalidad por
            la que fueron recogidos (gestión de la inscripción y comunicación del evento) y no
            se ceden a terceros, salvo obligación legal. Puedes ejercer los derechos de acceso,
            rectificación, supresión, oposición, limitación y portabilidad escribiendo a{" "}
            <a href="mailto:voluntarisgrupbarna@gmail.com" style={{ color: "#fff" }}>
              voluntarisgrupbarna@gmail.com
            </a>
            .
          </p>
        </section>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>
          Responsable: CB Grup Barna · Contacte: voluntarisgrupbarna@gmail.com ·{" "}
          <a href="/contacte" style={{ color: "rgba(255,255,255,0.6)" }}>
            Més formes de contacte
          </a>
        </p>
      </div>
    </main>
  );
}
