import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Museos from "./Museos.jsx";
import { museosApi, respuestaJson } from "../pruebas/ayudas.js";

function renderMuseos() {
  return render(
    <MemoryRouter>
      <Museos />
    </MemoryRouter>
  );
}

describe("Página Museos (con la API simulada)", () => {
  beforeEach(() => {
    // Mock de fetch: la prueba no depende de que el backend esté encendido
    spyOn(window, "fetch").and.callFake(() => respuestaJson(museosApi));
  });

  it("carga los museos activos desde GET /api/museos", async () => {
    renderMuseos();
    expect((await screen.findAllByRole("listitem")).length).toBe(4); // el museo inactivo no aparece
    expect(window.fetch.calls.argsFor(0)[0]).toContain("/api/museos");
    expect(screen.queryByText("Museo Cerrado")).toBeNull();
  });

  it("filtra los museos según el texto del buscador (estado)", async () => {
    renderMuseos();
    await screen.findAllByRole("listitem");
    fireEvent.change(screen.getByPlaceholderText("Buscar por nombre o zona"), {
      target: { value: "providencia" },
    });
    expect(screen.getAllByRole("listitem").length).toBe(1);
    expect(screen.getByText("Museo de Historia Natural")).toBeTruthy();
  });

  it("muestra un mensaje cuando la búsqueda no tiene resultados", async () => {
    renderMuseos();
    await screen.findAllByRole("listitem");
    fireEvent.change(screen.getByPlaceholderText("Buscar por nombre o zona"), {
      target: { value: "xyz" },
    });
    expect(screen.getByText("No se encontraron museos.")).toBeTruthy();
  });

  it("muestra un aviso si no se puede conectar con el servidor", async () => {
    window.fetch.and.callFake(() => Promise.reject(new TypeError("Failed to fetch")));
    renderMuseos();
    const alerta = await screen.findByRole("alert");
    expect(alerta.textContent).toContain("No se pudo conectar con el servidor");
  });
});
