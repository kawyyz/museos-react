import { useSearchParams } from "react-router-dom";

const ticketsEjemplo = [
  {
    id: 1,
    museo: "Museo de Arte Contemporáneo",
    fecha: "25 de Septiembre, 2026",
    personas: 2,
  },
  {
    id: 2,
    museo: "Museo de Historia Natural",
    fecha: "02 de Octubre, 2026",
    personas: 1,
  },
];

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
  const [searchParams] = useSearchParams();
  const museoNuevo = searchParams.get("museo");

  const tickets = museoNuevo
    ? [
        {
          id: "nuevo",
          museo: museoNuevo,
          fecha: formatearFecha(searchParams.get("fecha")),
          personas: Number(searchParams.get("personas")) || 1,
        },
        ...ticketsEjemplo,
      ]
    : ticketsEjemplo;

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

        {tickets.map((t) => (
          <div className="ticket-card" key={t.id}>
            <div className="ticket-info">
              <h3>{t.museo}</h3>
              <p>
                Fecha: {t.fecha} | Personas: {t.personas}
              </p>
              <span className="ticket-status">Pagado &amp; Confirmado</span>
            </div>
            <button className="btn-print">Descargar PDF</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Tickets;