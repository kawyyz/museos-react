import { useState } from "react";
import MuseoCard from "../components/MuseoCard";

const museos = [
  { id: 1, sigla: "AC", nombre: "Museo de Arte Contemporáneo", zona: "Santiago Centro", desc: "Colecciones de arte moderno y exposiciones temporales de artistas nacionales." },
  { id: 2, sigla: "HN", nombre: "Museo de Historia Natural", zona: "Providencia", desc: "Fósiles, minerales y muestras de flora y fauna de la región." },
  { id: 3, sigla: "CT", nombre: "Museo de Ciencia y Tecnología", zona: "Ñuñoa", desc: "Salas interactivas sobre física, astronomía e innovación tecnológica." },
  { id: 4, sigla: "AV", nombre: "Museo de Artes Visuales", zona: "Lastarria", desc: "Fotografía, escultura y muestras itinerantes de artistas emergentes." },
];

function Museos() {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = museos.filter((m) =>
    `${m.nombre} ${m.zona}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="museums">
      <div className="museums__intro">
        <p className="museums__tag">Catálogo</p>
        <h1 className="museums__title">Museos Disponibles</h1>
        <p className="museums__subtitle">
          Elige un museo para revisar sus datos y reservar tu visita.
        </p>
        <input
          type="search"
          className="form-control mx-auto"
          style={{ maxWidth: "400px" }}
          placeholder="Buscar por nombre o zona"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {filtrados.length === 0 ? (
        <p className="text-center">No se encontraron museos.</p>
      ) : (
        <ul className="row g-4 list-unstyled p-0 m-0">
          {filtrados.map((m) => (
            <li className="col-12 col-sm-6 col-lg-3" key={m.id}>
              <MuseoCard
                sigla={m.sigla}
                nombre={m.nombre}
                zona={m.zona}
                desc={m.desc}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Museos;