import { Link, NavLink } from "react-router-dom";

const enlaces = [
  { to: "/", texto: "Inicio" },
  { to: "/museos", texto: "Museos" },
  { to: "/reservas", texto: "Reservas" },
  { to: "/tickets", texto: "Tickets" },
  { to: "/clientes", texto: "Mi Perfil" },
];

function Navbar() {
  return (
    <header className="site-header">
      <Link className="site-header__logo" to="/">
        MuseoGestión
      </Link>

      <nav className="site-nav" aria-label="Navegación principal">
        {enlaces.map((e) => (
          <NavLink
            key={e.to}
            to={e.to}
            end={e.to === "/"}
            className={({ isActive }) =>
              "site-nav__link" + (isActive ? " site-nav__link--active" : "")
            }
          >
            {e.texto}
          </NavLink>
        ))}
      </nav>

      <div className="site-header__actions">
        <Link to="/login" className="site-header__auth">
          Cerrar sesión
        </Link>
      </div>
    </header>
  );
}

export default Navbar;