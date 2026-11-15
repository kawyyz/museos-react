import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Collapse } from "bootstrap";
import { useAuth } from "../auth/AuthContext";

// "roles" indica quién ve el enlace; sin "roles" lo ve cualquiera
const enlaces = [
  { to: "/", texto: "Inicio" },
  { to: "/museos", texto: "Museos" },
  { to: "/reservas", texto: "Reservas", roles: ["CLIENTE"] },
  { to: "/tickets", texto: "Tickets", roles: ["CLIENTE"] },
  { to: "/clientes", texto: "Mi Perfil", roles: ["CLIENTE", "ADMIN"] },
  { to: "/admin", texto: "Administración", roles: ["ADMIN"] },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth();

  const visibles = enlaces.filter((e) => !e.roles || (usuario && e.roles.includes(usuario.rol)));

  // Cierra el menú móvil al navegar a otra página
  useEffect(() => {
    const menu = document.getElementById("menuPrincipal");
    if (menu && menu.classList.contains("show")) {
      Collapse.getOrCreateInstance(menu).hide();
    }
  }, [location.pathname]);

  const salir = () => {
    cerrarSesion();
    navigate("/login");
  };

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-md w-100 p-0" aria-label="Navegación principal">
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
              {visibles.map((e) => (
                <NavLink
                  key={e.to}
                  to={e.to}
                  end={e.to === "/"}
                  className={({ isActive }) =>
                    "nav-link site-nav__link" + (isActive ? " site-nav__link--active" : "")
                  }
                >
                  {e.texto}
                </NavLink>
              ))}
            </div>

            {usuario ? (
              <div className="site-header__actions">
                <span className="small text-secondary">Hola, {usuario.nombre}</span>
                <button
                  type="button"
                  className="site-header__auth btn btn-link p-0"
                  onClick={salir}
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link to="/login" className="site-header__auth">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
