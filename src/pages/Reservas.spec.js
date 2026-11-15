import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useParams } from "react-router-dom";
import Reservas from "./Reservas.jsx";
import { limpiarSesion, museosApi, respuestaJson, sembrarSesion } from "../pruebas/ayudas.js";

// Página falsa de destino: muestra a qué reserva se navegó
function DestinoPagos() {
  const { id } = useParams();
  return <p data-testid="destino">Pagando la reserva {id}</p>;
}

// Simula el backend: museos, mis reservas y la creación de una reserva
function simularApi(errorAlCrear) {
  spyOn(window, "fetch").and.callFake((url, init = {}) => {
    const metodo = init.method || "GET";
    if (url.endsWith("/api/museos")) return respuestaJson(museosApi);
    if (url.endsWith("/api/reservas/mis-reservas")) return respuestaJson([]);
    if (url.endsWith("/api/reservas") && metodo === "POST") {
      return errorAlCrear
        ? respuestaJson({ error: errorAlCrear }, 400)
        : respuestaJson({ id: 7, estado: "PENDIENTE" }, 201);
    }
    return respuestaJson({ error: "Ruta no simulada" }, 404);
  });
}

function renderReservas() {
  return render(
    <MemoryRouter initialEntries={["/reservas"]}>
      <Routes>
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/pagos/:id" element={<DestinoPagos />} />
      </Routes>
    </MemoryRouter>
  );
}

async function completarFormulario() {
  await screen.findByRole("option", { name: "Museo de Historia Natural" });
  fireEvent.change(screen.getByLabelText("Museo"), { target: { value: "2" } });
  fireEvent.change(screen.getByLabelText("Fecha de visita"), { target: { value: "2026-12-20" } });
  fireEvent.change(screen.getByLabelText("Cantidad de personas"), { target: { value: "4" } });
  fireEvent.submit(screen.getByRole("button", { name: "Continuar al pago" }).closest("form"));
}

describe("Página Reservas (con la API simulada)", () => {
  beforeEach(() => sembrarSesion("CLIENTE"));
  afterEach(() => limpiarSesion());

  it("envía la reserva con POST /api/reservas y navega a la página de pago", async () => {
    simularApi();
    renderReservas();
    await completarFormulario();

    expect((await screen.findByTestId("destino")).textContent).toBe("Pagando la reserva 7");

    const [, init] = window.fetch.calls.allArgs().find(([, i]) => i?.method === "POST");
    expect(JSON.parse(init.body)).toEqual({ museoId: 2, fecha: "2026-12-20", personas: 4 });
    expect(init.headers.Authorization).toMatch(/^Bearer /);
  });

  it("muestra el mensaje del backend cuando no hay cupos disponibles", async () => {
    simularApi("No hay cupos suficientes para esa fecha. Quedan 3 lugares disponibles");
    renderReservas();
    await completarFormulario();

    const alerta = await screen.findByRole("alert");
    expect(alerta.textContent).toContain("No hay cupos suficientes");
    expect(screen.queryByTestId("destino")).toBeNull();
  });
});
