import Image from "next/image";
import SlideActionBar from "./SlideActionBar";

type Sponsor = {
  name: string;
  role: string;
  img: string;
  url: string;
  darkLogo?: boolean;
};

const SPONSORS: Sponsor[] = [
  {
    name: "Westfield Glòries",
    role: "Seu oficial",
    img: "/logos/westfield.svg",
    url: "https://www.westfield.com/gloriesbarcelona",
  },
  {
    name: "CB Grup Barna",
    role: "Organitzador",
    img: "/cb-grup-barna-logo-512.png",
    url: "https://cbgrupbarna.com",
  },
  {
    name: "Time Chamber",
    role: "Organitzador",
    img: "/logos/timechamber.webp",
    url: "https://timechamber.es",
    darkLogo: true,
  },
  {
    name: "Eix Clot",
    role: "Patrocinador",
    img: "/logos/eix-clot.png",
    url: "https://eixclot.cat",
  },
  {
    name: "Ajuntament de Barcelona",
    role: "Institucional",
    img: "/logos/ajuntament-barcelona.jpg",
    url: "https://www.barcelona.cat",
  },
];

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="sponsors-section">
      <div className="sponsors-inner">
        <header className="sponsors-header">
          <span className="sponsors-kicker">Amb el suport de</span>
          <h2 className="sponsors-title">Patrocinadors</h2>
        </header>

        <div className="sponsors-grid">
          {SPONSORS.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sponsor-card"
              aria-label={`${s.name} — ${s.role}`}
            >
              <div className={`sponsor-logo-wrap${s.darkLogo ? " sponsor-logo-wrap--dark" : ""}`}>
                <Image
                  src={s.img}
                  alt={s.name}
                  width={120}
                  height={72}
                  className="sponsor-logo-img"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <span className="sponsor-name">{s.name}</span>
              <span className="sponsor-role">{s.role}</span>
            </a>
          ))}
        </div>

        <div className="sponsors-cta">
          <p className="sponsors-cta-text">Vols ser patrocinador del torneig?</p>
          <a
            href="/contacte?contacte=1"
            className="sponsors-cta-btn"
          >
            Deixa les dades i et contactem ↗
          </a>
        </div>

        <SlideActionBar origin="share-sponsors" />
      </div>
    </section>
  );
}
