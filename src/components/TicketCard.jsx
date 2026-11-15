// "estado" y "codigo" son opcionales: sin ellos el ticket se muestra como vigente
function TicketCard({ museo, fecha, personas, codigo, estado = "VIGENTE" }) {
  const anulado = estado === "ANULADO";

  return (
    <div className="ticket-card flex-column flex-md-row gap-3">
      <div className="ticket-info">
        <h3>{museo}</h3>
        <p>
          Fecha: {fecha} | Personas: {personas}
        </p>
        {codigo && <p className="mb-2">Código: <strong>{codigo}</strong></p>}
        <span className="ticket-status">{anulado ? "Anulado" : "Pagado & Confirmado"}</span>
      </div>
      {!anulado && (
        <button className="btn-print" onClick={() => window.print()}>
          Descargar PDF
        </button>
      )}
    </div>
  );
}

export default TicketCard;
