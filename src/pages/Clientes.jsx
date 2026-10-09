const cliente = {
  nombre: "Juan Pérez",
  tipo: "Cliente Premium",
  correo: "juan.perez@email.com",
  telefono: "+56 9 1234 5678",
  ciudad: "Santiago, Chile",
  rol: "Usuario Final",
};

const detalles = [
  { etiqueta: "Correo:", valor: cliente.correo },
  { etiqueta: "Teléfono:", valor: cliente.telefono },
  { etiqueta: "Ciudad:", valor: cliente.ciudad },
  { etiqueta: "Rol:", valor: cliente.rol },
];

function Clientes() {
  return (
    <main>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-display)" }}>
              {cliente.nombre}
            </h1>
            <p style={{ margin: 0, color: "#5b5648" }}>{cliente.tipo}</p>
          </div>
        </div>

        {detalles.map((d) => (
          <div className="detail-row" key={d.etiqueta}>
            <span className="detail-label">{d.etiqueta}</span>
            <span>{d.valor}</span>
          </div>
        ))}

        <button className="btn-edit">Editar Información</button>
      </div>
    </main>
  );
}

export default Clientes;