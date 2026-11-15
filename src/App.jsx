import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RutaProtegida from "./auth/RutaProtegida";
import Dashboard from "./pages/Dashboard";
import Museos from "./pages/Museos";
import Reservas from "./pages/Reservas";
import Pagos from "./pages/Pagos";
import Tickets from "./pages/Tickets";
import Clientes from "./pages/Clientes";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Registro from "./pages/Registro";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route element={<Layout />}>
          {/* Públicas */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/museos" element={<Museos />} />

          {/* Cualquier usuario con sesión */}
          <Route element={<RutaProtegida />}>
            <Route path="/clientes" element={<Clientes />} />
          </Route>

          {/* Solo CLIENTE */}
          <Route element={<RutaProtegida roles={["CLIENTE"]} />}>
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/pagos/:id" element={<Pagos />} />
            <Route path="/tickets" element={<Tickets />} />
          </Route>

          {/* Solo ADMIN */}
          <Route element={<RutaProtegida roles={["ADMIN"]} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
