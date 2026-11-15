import { useEffect, useState } from "react";
import TicketCard from "../components/TicketCard";
import { api } from "../services/api";

function formatearFecha(iso) {
  if (!iso) return "Por confirmar";
  const fecha = new Date(`${iso}T00:00:00`);
  return fecha.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let vigente = true;
    api("/api/tickets/mis-tickets")
      .then((datos) => {
        if (vigente) setTickets(datos);
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

  return (
    <main>
      <div className="tickets-list">
        <h1
          style={{
            fontFamily: "var(--font-display)",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Tus Entradas
        </h1>

        {cargando && <p className="text-center">Cargando tickets...</p>}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!cargando && !error && tickets.length === 0 && (
          <p className="text-center">Todavía no tienes tickets. Reserva y paga una visita para obtener uno.</p>
        )}

        {tickets.map((t) => (
          <TicketCard
            key={t.id}
            museo={t.museo}
            fecha={formatearFecha(t.fecha)}
            personas={t.personas}
            codigo={t.codigo}
            estado={t.estado}
          />
        ))}
      </div>
    </main>
  );
}

export default Tickets;
