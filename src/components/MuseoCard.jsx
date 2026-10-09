import { Link } from "react-router-dom";

function MuseoCard({ sigla, nombre, zona, desc }) {
  return (
    <div className="museum-card h-100">
      <div className="museum-card__cover">{sigla}</div>
      <div className="museum-card__body">
        <h2 className="museum-card__name">{nombre}</h2>
        <p className="museum-card__meta">{zona}</p>
        <p className="museum-card__desc">{desc}</p>
        <Link className="museum-card__link" to="/reservas">
          Reservar visita
        </Link>
      </div>
    </div>
  );
}

export default MuseoCard;