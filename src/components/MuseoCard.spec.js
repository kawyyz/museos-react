import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MuseoCard from "./MuseoCard.jsx";

const props = {
  sigla: "AC",
  nombre: "Museo de Arte Contemporáneo",
  zona: "Santiago Centro",
  desc: "Colecciones de arte moderno.",
};

function renderCard(extra = {}) {
  return render(
    <MemoryRouter>
      <MuseoCard {...props} {...extra} />
    </MemoryRouter>
  );
}

describe("MuseoCard", () => {
  it("muestra el nombre, la zona y la descripción recibidos por props", () => {
    renderCard();
    expect(screen.getByText("Museo de Arte Contemporáneo")).toBeTruthy();
    expect(screen.getByText("Santiago Centro")).toBeTruthy();
    expect(screen.getByText("Colecciones de arte moderno.")).toBeTruthy();
  });

  it("muestra la sigla en la portada", () => {
    renderCard({ sigla: "HN" });
    expect(screen.getByText("HN")).toBeTruthy();
  });

  it("incluye un enlace 'Reservar visita' que apunta a /reservas", () => {
    renderCard();
    const enlace = screen.getByRole("link", { name: "Reservar visita" });
    expect(enlace.getAttribute("href")).toBe("/reservas");
  });
});