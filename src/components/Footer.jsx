import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">MuseoGestión</div>
      <nav className="site-footer__links" aria-label="Enlaces del pie de página">
        <Link to="/">Inicio</Link>
        <Link to="/museos">Museos</Link>
        <Link to="/clientes">Soporte</Link>
      </nav>
    </footer>
  );
}

export default Footer;