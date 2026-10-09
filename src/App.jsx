import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Museos from "./pages/Museos";
import Reservas from "./pages/Reservas";
import Pagos from "./pages/Pagos";
import Tickets from "./pages/Tickets";
import Clientes from "./pages/Clientes";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/museos" element={<Museos />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/clientes" element={<Clientes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;