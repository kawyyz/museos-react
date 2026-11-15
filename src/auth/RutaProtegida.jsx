import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

function AccesoDenegado() {
  return (
    <main className="container text-center my-5">
      <h1>Acceso denegado</h1>
      <p>Tu cuenta no tiene permisos para ver esta página.</p>
      <Link to="/">Volver al inicio</Link>
    </main>
  );
}

/**
 * Protege un grupo de rutas.
 * - Sin sesión: redirige a /login y recuerda a qué página quería entrar el usuario.
 * - Con sesión pero sin el rol necesario: muestra "Acceso denegado".
 * Importante: esto mejora la experiencia, pero la seguridad real la aplica el backend (401 y 403).
 */
function RutaProtegida({ roles }) {
  const { autenticado, usuario } = useAuth();
  const location = useLocation();

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }
  if (roles && !roles.includes(usuario.rol)) {
    return <AccesoDenegado />;
  }
  return <Outlet />;
}

export default RutaProtegida;
