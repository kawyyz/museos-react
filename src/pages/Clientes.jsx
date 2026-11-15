import { useEffect, useState } from "react";
import { api } from "../services/api";

const etiquetasRol = { CLIENTE: "Cliente", ADMIN: "Administrador" };

function Clientes() {
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombre: "", telefono: "", ciudad: "" });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let vigente = true;
    api("/api/perfil")
      .then((datos) => {
        if (vigente) setPerfil(datos);
      })
      .catch((e) => {
        if (vigente) setError(e.message);
      });
    return () => {
      vigente = false;
    };
  }, []);

  const empezarEdicion = () => {
    setForm({
      nombre: perfil.nombre || "",
      telefono: perfil.telefono || "",
      ciudad: perfil.ciudad || "",
    });
    setMensaje("");
    setEditando(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setPerfil(await api("/api/perfil", { metodo: "PUT", cuerpo: form }));
      setEditando(false);
      setMensaje("Datos actualizados correctamente.");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!perfil) {
    return (
      <main className="container my-5">
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <p>Cargando perfil...</p>
        )}
      </main>
    );
  }

  const detalles = [
    { etiqueta: "Correo:", valor: perfil.correo },
    { etiqueta: "Teléfono:", valor: perfil.telefono || "—" },
    { etiqueta: "Ciudad:", valor: perfil.ciudad || "—" },
    { etiqueta: "Rol:", valor: etiquetasRol[perfil.rol] || perfil.rol },
  ];

  return (
    <main>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-display)" }}>{perfil.nombre}</h1>
            <p style={{ margin: 0, color: "#5b5648" }}>{etiquetasRol[perfil.rol] || perfil.rol}</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {mensaje && (
          <div className="alert alert-success" role="status">
            {mensaje}
          </div>
        )}

        {editando ? (
          <form onSubmit={guardar}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="ciudad">Ciudad</label>
              <input
                id="ciudad"
                value={form.ciudad}
                onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-edit me-2">
              Guardar
            </button>
            <button type="button" className="btn btn-outline-secondary mt-4" onClick={() => setEditando(false)}>
              Cancelar
            </button>
          </form>
        ) : (
          <>
            {detalles.map((d) => (
              <div className="detail-row" key={d.etiqueta}>
                <span className="detail-label">{d.etiqueta}</span>
                <span>{d.valor}</span>
              </div>
            ))}
            <button className="btn-edit" onClick={empezarEdicion}>
              Editar Información
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default Clientes;
