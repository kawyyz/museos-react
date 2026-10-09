import { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Collapse } from "bootstrap";

const enlaces = [
  { to: "/", texto: "Inicio" },
  { to: "/museos", texto: "Museos" },
  { to: "/reservas", texto: "Reservas" },
  { to: "/tickets", texto: "Tickets" },
  { to: "/clientes", texto: "Mi Perfil" },
];

function Navbar() {
  const location = useLocation();

  // Cierra el menú móvil al navegar a otra página
  useEffect(() => {
    const menu = document.getElementById("menuPrincipal");
    if (menu && menu.classList.contains("show")) {
      Collapse.getOrCreateInstance(menu).hide();
    }
  }, [location.pathname]);

  return (
    <header className="site-header">
      <nav
        className="navbar navbar-expand-md w-100 p-0"
        aria-label="Navegación principal"
      >
        <div className="container-fluid p-0">
          <Link className="site-header__logo navbar-brand" to="/">
            MuseoGestión
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuPrincipal"
            aria-controls="menuPrincipal"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menuPrincipal">
            <div className="navbar-nav mx-auto gap-md-3">
              {enlaces.map((e) => (
                <NavLink
                  key={e.to}
                  to={e.to}
                  end={e.to === "/"}
                  className={({ isActive }) =>
                    "nav-link site-nav__link" +
                    (isActive ? " site-nav__link--active" : "")
                  }
                >
                  {e.texto}
                </NavLink>
              ))}
            </div>
            <Link to="/login" className="site-header__auth">
              Cerrar sesión
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;