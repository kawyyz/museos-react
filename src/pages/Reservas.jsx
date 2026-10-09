import { useState } from "react";
import { useNavigate } from "react-router-dom";

const museos = [
  "Museo de Arte Contemporáneo",
  "Museo de Historia Natural",
  "Museo de Ciencia y Tecnología",
  "Museo de Artes Visuales",
];

function Reservas() {
  const navigate = useNavigate();
  const [museo, setMuseo] = useState("");
  const [fecha, setFecha] = useState("");
  const [personas, setPersonas] = useState(1);

  const enviar = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ museo, fecha, personas });
    navigate(`/pagos?${params.toString()}`);
  };

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

        <form className="form" onSubmit={enviar}>
          <div className="form__field">
            <label htmlFor="museo">Museo</label>
            <select
              className="form-select"
              id="museo"
              name="museo"
              value={museo}
              onChange={(e) => setMuseo(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecciona un museo
              </option>
              {museos.map((m) => (
                <option key={m} value={m}>
                  {m}
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

          <button type="submit" className="form__submit">
            Continuar al pago
          </button>
        </form>
      </div>
    </main>
  );
}

export default Reservas;