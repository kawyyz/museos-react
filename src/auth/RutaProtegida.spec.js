import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext.jsx";
import RutaProtegida from "./RutaProtegida.jsx";
import { limpiarSesion, sembrarSesion } from "../pruebas/ayudas.js";

function renderizar(roles) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/privada"]}>
        <Routes>
          <Route path="/login" element={<p>Pantalla de login</p>} />
          <Route element={<RutaProtegida roles={roles} />}>
            <Route path="/privada" element={<p>Contenido privado</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("RutaProtegida (restricciones de acceso en el frontend)", () => {
  afterEach(() => limpiarSesion());

  it("sin sesión redirige a /login", () => {
    renderizar();
    expect(screen.getByText("Pantalla de login")).toBeTruthy();
    expect(screen.queryByText("Contenido privado")).toBeNull();
  });

  it("con sesión y sin restricción de rol deja pasar", () => {
    sembrarSesion("CLIENTE");
    renderizar();
    expect(screen.getByText("Contenido privado")).toBeTruthy();
  });

  it("un CLIENTE no puede entrar a una ruta solo para ADMIN", () => {
    sembrarSesion("CLIENTE");
    renderizar(["ADMIN"]);
    expect(screen.getByRole("heading", { name: "Acceso denegado" })).toBeTruthy();
    expect(screen.queryByText("Contenido privado")).toBeNull();
  });

  it("un ADMIN sí puede entrar a una ruta solo para ADMIN", () => {
    sembrarSesion("ADMIN");
    renderizar(["ADMIN"]);
    expect(screen.getByText("Contenido privado")).toBeTruthy();
  });
});
