import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const enviar = (e) => {
    e.preventDefault();
    // Aquí iría la validación real contra el backend
    navigate("/");
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Iniciar Sesión</h1>

      <form onSubmit={enviar}>
        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico</label>
          <input
            id="correo"
            type="email"
            required
            placeholder="usuario@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            required
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="login-btn">
          Ingresar
        </button>
      </form>

      <div className="login-footer">
        ¿No tienes cuenta?{" "}
        <a href="#" style={{ color: "var(--clay)" }}>
          Regístrate aquí
        </a>
      </div>
    </div>
  );
}

export default Login;