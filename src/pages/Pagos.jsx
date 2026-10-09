import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PRECIO_ENTRADA = 5000; // CLP por persona, ajústalo al valor real

function Pagos() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const museo = searchParams.get("museo") || "No seleccionado";
  const personas = Number(searchParams.get("personas")) || 1;
  const total = personas * PRECIO_ENTRADA;

  const [tarjeta, setTarjeta] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");

  const enviar = (e) => {
    e.preventDefault();
    navigate(`/tickets?${searchParams.toString()}`);
  };

  return (
    <main>
      <div className="payment-container">
        <h1 style={{ fontFamily: "var(--font-display)" }}>Finalizar Pago</h1>

        <div className="payment-summary">
          <p><strong>Reserva:</strong> #RES-9821</p>
          <p><strong>Museo:</strong> {museo}</p>
          <p><strong>Personas:</strong> {personas}</p>
          <p><strong>Total a pagar:</strong> ${total.toLocaleString("es-CL")} CLP</p>
        </div>

        <form onSubmit={enviar}>
          <div className="form-group">
            <label>Número de Tarjeta</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={tarjeta}
              onChange={(e) => setTarjeta(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label>Vencimiento</label>
              <input
                type="text"
                placeholder="MM/AA"
                value={vencimiento}
                onChange={(e) => setVencimiento(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-pay">
            Confirmar Pago y Generar Ticket
          </button>
        </form>
      </div>
    </main>
  );
}

export default Pagos;