import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import Reservas from "./Reservas.jsx";

// Página falsa de destino: permite verificar a qué URL navegó el formulario
function DestinoPagos() {
  const location = useLocation();
  return <p data-testid="url">{location.pathname + location.search}</p>;
}

describe("Página Reservas", () => {
  it("al enviar el formulario navega a /pagos con los datos en la URL", () => {
    render(
      <MemoryRouter initialEntries={["/reservas"]}>
        <Routes>
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/pagos" element={<DestinoPagos />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Museo"), {
      target: { value: "Museo de Historia Natural" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de visita"), {
      target: { value: "2026-11-20" },
    });
    fireEvent.change(screen.getByLabelText("Cantidad de personas"), {
      target: { value: "4" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: "Continuar al pago" }).closest("form")
    );

    const url = screen.getByTestId("url").textContent;
    expect(url).toContain("/pagos?");
    expect(url).toContain("fecha=2026-11-20");
    expect(url).toContain("personas=4");
  });
});