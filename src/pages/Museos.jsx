import { Link } from "react-router-dom";

const museos = [
  {
    id: 1,
    sigla: "AC",
    nombre: "Museo de Arte Contemporáneo",
    zona: "Santiago Centro",
    desc: "Colecciones de arte moderno y exposiciones temporales de artistas nacionales.",
  },
  {
    id: 2,
    sigla: "HN",
    nombre: "Museo de Historia Natural",
    zona: "Providencia",
    desc: "Fósiles, minerales y muestras de flora y fauna de la región.",
  },
  {
    id: 3,
    sigla: "CT",
    nombre: "Museo de Ciencia y Tecnología",
    zona: "Ñuñoa",
    desc: "Salas interactivas sobre física, astronomía e innovación tecnológica.",
  },
  {
    id: 4,
    sigla: "AV",
    nombre: "Museo de Artes Visuales",
    zona: "Lastarria",
    desc: "Fotografía, escultura y muestras itinerantes de artistas emergentes.",
  },
];

function Museos() {
  return (
    <main className="museums">
      <div className="museums__intro">
        <p className="museums__tag">Catálogo</p>
        <h1 className="museums__title">Museos Disponibles</h1>
        <p className="museums__subtitle">
          Elige un museo para revisar sus datos y reservar tu visita.
        </p>
      </div>

      <ul className="museums__grid">
        {museos.map((m) => (
          <li className="museum-card" key={m.id}>
            <div className="museum-card__cover">{m.sigla}</div>
            <div className="museum-card__body">
              <h2 className="museum-card__name">{m.nombre}</h2>
              <p className="museum-card__meta">{m.zona}</p>
              <p className="museum-card__desc">{m.desc}</p>
              <Link className="museum-card__link" to="/reservas">
                Reservar visita
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Museos;