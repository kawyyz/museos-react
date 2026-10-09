import { Link } from "react-router-dom";

const accesos = [
  { emoji: "🏛️", nombre: "Catálogo de Museos", desc: "Consulta disponibilidad", to: "/museos", boton: "Ir ahora" },
  { emoji: "📅", nombre: "Mis Reservas", desc: "Gestiona tus citas", to: "/reservas", boton: "Ver reservas" },
  { emoji: "🎫", nombre: "Mis Tickets", desc: "Descarga tus entradas", to: "/tickets", boton: "Ver tickets" },
  { emoji: "👤", nombre: "Mi Perfil", desc: "Datos personales", to: "/clientes", boton: "Editar perfil" },
];

function Dashboard() {
  return (
    <main>
      <section className="hero">
        <div className="hero__text">
          <p className="hero__tag">Bienvenido al sistema</p>
          <h1 className="hero__title">
            Gestiona tus visitas<br />culturales en un solo lugar
          </h1>
          <p className="hero__desc">
            Explora los museos disponibles, reserva tu entrada y gestiona tus pagos de forma rápida y sencilla.
          </p>
          <Link to="/museos" className="hero__cta">
            Explorar Museos
          </Link>
        </div>
        <div
          className="hero__image"
          aria-hidden="true"
          style={{ background: "linear-gradient(135deg, #ded9c7, #c1633d)" }}
        ></div>
      </section>

      <section className="products" id="servicios">
        <h2 className="products__title">Acceso Rápido</h2>
        <ul className="row g-4 list-unstyled p-0 m-0">
          {accesos.map((a) => (
            <li className="col-12 col-sm-6 col-lg-3" key={a.to}>
              <div className="product-card h-100">
                <div className="product-card__image" data-emoji={a.emoji}></div>
                <h3 className="product-card__name">{a.nombre}</h3>
                <p className="product-card__price">{a.desc}</p>
                <Link
                  to={a.to}
                  className="product-card__add"
                  style={{ textDecoration: "none", textAlign: "center", display: "block" }}
                >
                  {a.boton}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Dashboard;