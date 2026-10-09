import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Museos from "./Museos.jsx";

function renderMuseos() {
  return render(
    <MemoryRouter>
      <Museos />
    </MemoryRouter>
  );
}

describe("Página Museos", () => {
  it("muestra los 4 museos al cargar", () => {
    renderMuseos();
    expect(screen.getAllByRole("listitem").length).toBe(4);
  });

  it("filtra los museos según el texto del buscador (estado)", () => {
    renderMuseos();
    const buscador = screen.getByPlaceholderText("Buscar por nombre o zona");
    fireEvent.change(buscador, { target: { value: "providencia" } });
    expect(screen.getAllByRole("listitem").length).toBe(1);
    expect(screen.getByText("Museo de Historia Natural")).toBeTruthy();
  });

  it("muestra un mensaje cuando la búsqueda no tiene resultados", () => {
    renderMuseos();
    const buscador = screen.getByPlaceholderText("Buscar por nombre o zona");
    fireEvent.change(buscador, { target: { value: "xyz" } });
    expect(screen.getByText("No se encontraron museos.")).toBeTruthy();
    expect(screen.queryAllByRole("listitem").length).toBe(0);
  });
});