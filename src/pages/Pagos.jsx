import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

function Pagos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [tarjeta, setTarjeta] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    let vigente = true;
    api(`/api/reservas/${id}`)
      .then((datos) => {
        if (vigente) setReserva(datos);
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
  }, [id]);

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await api(`/api/reservas/${id}/pago`, {
        metodo: "POST",
        cuerpo: { numeroTarjeta: tarjeta, vencimiento, cvv },
      });
      navigate("/tickets");
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <main className="container my-5">
        <p>Cargando reserva...</p>
      </main>
    );
  }

  if (!reserva) {
    return (
      <main className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error || "No se encontró la reserva."}
        </div>
        <Link to="/reservas">Volver a mis reservas</Link>
      </main>
    );
  }

  return (
    <main>
      <div className="payment-container">
        <h1 style={{ fontFamily: "var(--font-display)" }}>Finalizar Pago</h1>

        <div className="payment-summary">
          <p><strong>Reserva:</strong> #{reserva.id}</p>
          <p><strong>Museo:</strong> {reserva.museoNombre}</p>
          <p><strong>Fecha:</strong> {reserva.fecha}</p>
          <p><strong>Personas:</strong> {reserva.personas}</p>
          <p><strong>Total a pagar:</strong> ${reserva.total.toLocaleString("es-CL")} CLP</p>
          <p><strong>Estado:</strong> {reserva.estado}</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {reserva.estado !== "PENDIENTE" ? (
          <p>
            Esta reserva está {reserva.estado.toLowerCase()} y no admite pago.{" "}
            <Link to="/reservas">Volver a mis reservas</Link>
          </p>
        ) : (
          <form onSubmit={enviar}>
            <div className="form-group">
              <label htmlFor="tarjeta">Número de Tarjeta</label>
              <input
                id="tarjeta"
                name="cc-number"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="0000 0000 0000 0000"
                value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label htmlFor="vencimiento">Vencimiento</label>
                <input
                  id="vencimiento"
                  name="cc-exp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/AA"
                  maxLength={5}
                  value={vencimiento}
                  onChange={(e) => setVencimiento(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  id="cvv"
                  name="cc-csc"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-pay" disabled={enviando}>
              {enviando ? "Procesando..." : "Confirmar Pago y Generar Ticket"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default Pagos;
