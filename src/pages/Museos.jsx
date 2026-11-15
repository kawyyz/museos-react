import { useEffect, useState } from "react";
import MuseoCard from "../components/MuseoCard";
import { api } from "../services/api";

function Museos() {
  const [museos, setMuseos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Los museos vienen del backend (GET /api/museos, endpoint público)
  useEffect(() => {
    let vigente = true;
    api("/api/museos", { auth: false })
      .then((datos) => {
        if (vigente) setMuseos(datos.filter((m) => m.activo));
      })
      .catch((e) => {
        if (vigente) setError(e.message);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, []);

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

      {cargando && <p className="text-center">Cargando museos...</p>}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && filtrados.length === 0 && (
        <p className="text-center">No se encontraron museos.</p>
      )}

      {filtrados.length > 0 && (
        <ul className="row g-4 list-unstyled p-0 m-0">
          {filtrados.map((m) => (
            <li className="col-12 col-sm-6 col-lg-3" key={m.id}>
              <MuseoCard
                sigla={m.sigla}
                nombre={m.nombre}
                zona={m.zona}
                desc={m.descripcion}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Museos;
