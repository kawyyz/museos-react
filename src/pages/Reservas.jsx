import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

const clasesEstado = {
  PENDIENTE: "text-bg-warning",
  PAGADA: "text-bg-success",
  CANCELADA: "text-bg-secondary",
};

function Reservas() {
  const navigate = useNavigate();
  const [museos, setMuseos] = useState([]);
  const [museoId, setMuseoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [personas, setPersonas] = useState(1);
  const [mias, setMias] = useState([]);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cargarMias = useCallback(async () => {
    try {
      setMias(await api("/api/reservas/mis-reservas"));
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    let vigente = true;
    api("/api/museos", { auth: false })
      .then((datos) => {
        if (vigente) setMuseos(datos.filter((m) => m.activo));
      })
      .catch((e) => {
        if (vigente) setError(e.message);
      });
    cargarMias();
    return () => {
      vigente = false;
    };
  }, [cargarMias]);

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      // El backend valida fecha, cupos y calcula el total; el frontend solo envía los datos
      const reserva = await api("/api/reservas", {
        metodo: "POST",
        cuerpo: { museoId: Number(museoId), fecha, personas: Number(personas) },
      });
      navigate(`/pagos/${reserva.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const cancelar = async (id) => {
    if (!window.confirm("¿Seguro que quieres cancelar esta reserva?")) return;
    setError("");
    try {
      await api(`/api/reservas/${id}`, { metodo: "DELETE" });
      await cargarMias();
    } catch (err) {
      setError(err.message);
    }
  };

  const hoy = new Date().toLocaleDateString("en-CA"); // AAAA-MM-DD en la hora local

  return (
    <main>
      <div className="reserve">
        <div className="reserve__intro">
          <p className="reserve__tag">Reserva</p>
          <h1 className="reserve__title">Reserva tu visita</h1>
          <p className="reserve__subtitle">
            Completa los datos de tu visita. Podrás revisar el pago en el siguiente paso.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form className="form" onSubmit={enviar}>
          <div className="form__field">
            <label htmlFor="museo">Museo</label>
            <select
              className="form-select"
              id="museo"
              name="museo"
              value={museoId}
              onChange={(e) => setMuseoId(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecciona un museo
              </option>
              {museos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="form__field">
                <label htmlFor="fecha">Fecha de visita</label>
                <input
                  className="form-control"
                  type="date"
                  id="fecha"
                  name="fecha"
                  min={hoy}
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form__field">
                <label htmlFor="personas">Cantidad de personas</label>
                <input
                  className="form-control"
                  type="number"
                  id="personas"
                  name="personas"
                  min="1"
                  max="20"
                  value={personas}
                  onChange={(e) => setPersonas(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="form__submit" disabled={enviando}>
            {enviando ? "Reservando..." : "Continuar al pago"}
          </button>
        </form>
      </div>

      <section className="container my-5">
        <h2 className="h4 mb-3">Mis reservas</h2>
        {mias.length === 0 ? (
          <p>Aún no tienes reservas.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Museo</th>
                  <th>Fecha</th>
                  <th>Personas</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mias.map((r) => (
                  <tr key={r.id}>
                    <td>{r.museoNombre}</td>
                    <td>{r.fecha}</td>
                    <td>{r.personas}</td>
                    <td>${r.total.toLocaleString("es-CL")}</td>
                    <td>
                      <span className={`badge ${clasesEstado[r.estado] || "text-bg-light"}`}>
                        {r.estado}
                      </span>
                    </td>
                    <td className="text-end">
                      {r.estado === "PENDIENTE" && (
                        <Link className="btn btn-sm btn-dark me-2" to={`/pagos/${r.id}`}>
                          Pagar
                        </Link>
                      )}
                      {r.estado !== "CANCELADA" && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => cancelar(r.id)}
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Reservas;
