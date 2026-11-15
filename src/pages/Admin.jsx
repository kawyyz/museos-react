import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

const museoVacio = {
  nombre: "",
  sigla: "",
  zona: "",
  descripcion: "",
  precioEntrada: 5000,
  capacidadDiaria: 100,
  activo: true,
};

// Página solo para ADMIN: administra el catálogo de museos y consulta todas las reservas
function Admin() {
  const [museos, setMuseos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState(museoVacio);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargar = useCallback(async () => {
    try {
      setMuseos(await api("/api/museos", { auth: false }));
      setReservas(await api("/api/reservas"));
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [campo]: valor });
  };

  const limpiar = () => {
    setForm(museoVacio);
    setEditandoId(null);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    const cuerpo = {
      ...form,
      precioEntrada: Number(form.precioEntrada),
      capacidadDiaria: Number(form.capacidadDiaria),
    };
    try {
      if (editandoId) {
        await api(`/api/museos/${editandoId}`, { metodo: "PUT", cuerpo });
        setMensaje("Museo actualizado.");
      } else {
        await api("/api/museos", { metodo: "POST", cuerpo });
        setMensaje("Museo creado.");
      }
      limpiar();
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const editar = (m) => {
    setEditandoId(m.id);
    setForm({
      nombre: m.nombre,
      sigla: m.sigla,
      zona: m.zona,
      descripcion: m.descripcion || "",
      precioEntrada: m.precioEntrada,
      capacidadDiaria: m.capacidadDiaria,
      activo: m.activo,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = async (m) => {
    if (!window.confirm(`¿Eliminar el museo "${m.nombre}"?`)) return;
    setError("");
    setMensaje("");
    try {
      await api(`/api/museos/${m.id}`, { metodo: "DELETE" });
      setMensaje("Museo eliminado.");
      await cargar();
    } catch (err) {
      setError(
        err.estado === 500
          ? "No se puede eliminar un museo que ya tiene reservas. Desactívalo en su lugar."
          : err.message
      );
    }
  };

  return (
    <main className="container my-5">
      <h1 className="h3 mb-4">Panel de administración</h1>

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

      <section className="mb-5">
        <h2 className="h5">{editandoId ? "Editar museo" : "Nuevo museo"}</h2>
        <form className="row g-3" onSubmit={guardar}>
          <div className="col-md-6">
            <label className="form-label" htmlFor="a-nombre">Nombre</label>
            <input id="a-nombre" className="form-control" required value={form.nombre} onChange={cambiar("nombre")} />
          </div>
          <div className="col-md-2">
            <label className="form-label" htmlFor="a-sigla">Sigla</label>
            <input id="a-sigla" className="form-control" required minLength={2} maxLength={3} value={form.sigla} onChange={cambiar("sigla")} />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="a-zona">Zona</label>
            <input id="a-zona" className="form-control" required value={form.zona} onChange={cambiar("zona")} />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="a-desc">Descripción</label>
            <textarea id="a-desc" className="form-control" rows={2} maxLength={500} value={form.descripcion} onChange={cambiar("descripcion")} />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="a-precio">Precio de entrada (CLP)</label>
            <input id="a-precio" type="number" min="0" className="form-control" required value={form.precioEntrada} onChange={cambiar("precioEntrada")} />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="a-cap">Capacidad diaria</label>
            <input id="a-cap" type="number" min="1" className="form-control" required value={form.capacidadDiaria} onChange={cambiar("capacidadDiaria")} />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <div className="form-check">
              <input id="a-activo" type="checkbox" className="form-check-input" checked={form.activo} onChange={cambiar("activo")} />
              <label className="form-check-label" htmlFor="a-activo">Activo (visible para reservas)</label>
            </div>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-dark me-2">
              {editandoId ? "Guardar cambios" : "Crear museo"}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-outline-secondary" onClick={limpiar}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="mb-5">
        <h2 className="h5">Museos</h2>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Museo</th>
                <th>Zona</th>
                <th>Precio</th>
                <th>Capacidad</th>
                <th>Activo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {museos.map((m) => (
                <tr key={m.id}>
                  <td>{m.nombre}</td>
                  <td>{m.zona}</td>
                  <td>${m.precioEntrada.toLocaleString("es-CL")}</td>
                  <td>{m.capacidadDiaria}</td>
                  <td>{m.activo ? "Sí" : "No"}</td>
                  <td className="text-end">
                    <button type="button" className="btn btn-sm btn-outline-dark me-2" onClick={() => editar(m)}>
                      Editar
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminar(m)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="h5">Reservas de todos los clientes</h2>
        {reservas.length === 0 ? (
          <p>No hay reservas registradas.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Museo</th>
                  <th>Fecha</th>
                  <th>Personas</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.cliente}</td>
                    <td>{r.museoNombre}</td>
                    <td>{r.fecha}</td>
                    <td>{r.personas}</td>
                    <td>${r.total.toLocaleString("es-CL")}</td>
                    <td>{r.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Admin;
