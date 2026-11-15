import { render, screen, fireEvent } from "@testing-library/react";
import TicketCard from "./TicketCard.jsx";

describe("TicketCard", () => {
  describe("ticket vigente", () => {
    beforeEach(() => {
      render(
        <TicketCard
          museo="Museo de Historia Natural"
          fecha="02 de octubre de 2026"
          personas={3}
          codigo="MG-AB12CD34"
        />
      );
    });

    it("muestra el museo, la fecha y la cantidad de personas", () => {
      expect(screen.getByText("Museo de Historia Natural")).toBeTruthy();
      expect(screen.getByText(/02 de octubre de 2026/)).toBeTruthy();
      expect(screen.getByText(/Personas: 3/)).toBeTruthy();
    });

    it("muestra el estado 'Pagado & Confirmado' y el código del ticket", () => {
      expect(screen.getByText("Pagado & Confirmado")).toBeTruthy();
      expect(screen.getByText("MG-AB12CD34")).toBeTruthy();
    });

    it("llama a window.print al pulsar 'Descargar PDF' (mock con spyOn)", () => {
      const imprimir = spyOn(window, "print"); // mock: evita abrir el diálogo real
      fireEvent.click(screen.getByRole("button", { name: "Descargar PDF" }));
      expect(imprimir).toHaveBeenCalledTimes(1);
    });
  });

  it("un ticket anulado muestra 'Anulado' y no permite descargarlo", () => {
    render(<TicketCard museo="Museo X" fecha="01 de enero" personas={1} estado="ANULADO" />);
    expect(screen.getByText("Anulado")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Descargar PDF" })).toBeNull();
  });
});
