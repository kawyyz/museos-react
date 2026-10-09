import { render, screen, fireEvent } from "@testing-library/react";
import TicketCard from "./TicketCard.jsx";

describe("TicketCard", () => {
  beforeEach(() => {
    render(
      <TicketCard
        museo="Museo de Historia Natural"
        fecha="02 de octubre de 2026"
        personas={3}
      />
    );
  });

  it("muestra el museo, la fecha y la cantidad de personas", () => {
    expect(screen.getByText("Museo de Historia Natural")).toBeTruthy();
    expect(screen.getByText(/02 de octubre de 2026/)).toBeTruthy();
    expect(screen.getByText(/Personas: 3/)).toBeTruthy();
  });

  it("muestra el estado 'Pagado & Confirmado'", () => {
    expect(screen.getByText("Pagado & Confirmado")).toBeTruthy();
  });

  it("llama a window.print al pulsar 'Descargar PDF' (mock con spyOn)", () => {
    const imprimir = spyOn(window, "print"); // mock: evita abrir el diálogo real
    fireEvent.click(screen.getByRole("button", { name: "Descargar PDF" }));
    expect(imprimir).toHaveBeenCalledTimes(1);
  });
});