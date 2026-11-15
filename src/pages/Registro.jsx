import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Registro() {
  const navigate = useNavigate();
  const { registrar, autenticado } = useAuth();
  const [datos, setDatos] = useState({
    nombre: "",
    correo: "",
    password: "",
    telefono: "",
    ciudad: "",
  });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (autenticado) return <Navigate to="/" replace />;

  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await registrar(datos);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Crear cuenta</h1>

      <form onSubmit={enviar}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" required value={datos.nombre} onChange={cambiar("nombre")} />
        </div>
        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico</label>
          <input id="correo" type="email" required value={datos.correo} onChange={cambiar("correo")} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña (mínimo 8 caracteres)</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={datos.password}
            onChange={cambiar("password")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input id="telefono" value={datos.telefono} onChange={cambiar("telefono")} />
        </div>
        <div className="form-group">
          <label htmlFor="ciudad">Ciudad</label>
          <input id="ciudad" value={datos.ciudad} onChange={cambiar("ciudad")} />
        </div>

        <button type="submit" className="login-btn" disabled={enviando}>
          {enviando ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>

      <div className="login-footer">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" style={{ color: "var(--clay)" }}>
          Inicia sesión
        </Link>
      </div>
    </div>
  );
}

export default Registro;
