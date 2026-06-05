const FIBA_URL = "https://play.fiba3x3.com/events/4a4773cb-79be-4777-b164-220b36aacbe6/schedule";

export default function HorarisBanner() {
  return (
    <div className="horaris-banner" role="banner">
      <span className="horaris-banner-icon" aria-hidden="true">📅</span>
      <div className="horaris-banner-text">
        <strong>Horaris Dissabte 6 ja publicats a FIBA Play</strong>
        <span className="horaris-banner-sub">Sènior Masc Pro · Sènior Fem Pro · 10:00–21:00h · Westfield Glòries</span>
      </div>
      <a
        href={FIBA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="horaris-banner-cta"
      >
        Consulta el programa →
      </a>
    </div>
  );
}
