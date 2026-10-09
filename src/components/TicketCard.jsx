function TicketCard({ museo, fecha, personas }) {
  return (
    <div className="ticket-card flex-column flex-md-row gap-3">
      <div className="ticket-info">
        <h3>{museo}</h3>
        <p>
          Fecha: {fecha} | Personas: {personas}
        </p>
        <span className="ticket-status">Pagado &amp; Confirmado</span>
      </div>
      <button className="btn-print" onClick={() => window.print()}>
        Descargar PDF
      </button>
    </div>
  );
}

export default TicketCard;