import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import { CLAVE_SESION } from "./session.js";
import { fabricarToken, limpiarSesion, respuestaJson, sembrarSesion } from "../pruebas/ayudas.js";

// Componente de prueba que muestra el estado de la sesión y expone los botones
function Sonda() {
  const { usuario, login, cerrarSesion } = useAuth();
  return (
    <div>
      <p data-testid="usuario">{usuario ? `${usuario.nombre} (${usuario.rol})` : "anónimo"}</p>
      <button onClick={() => login("ana@museos.cl", "clave12345")}>Entrar</button>
      <button onClick={cerrarSesion}>Salir</button>
    </div>
  );
}

function renderizar() {
  return render(
    <AuthProvider>
      <Sonda />
    </AuthProvider>
  );
}

describe("AuthContext (gestión de sesión)", () => {
  afterEach(() => limpiarSesion());

  it("recupera la sesión guardada al cargar, como si se recargara la página", () => {
    sembrarSesion("CLIENTE");
    renderizar();
    expect(screen.getByTestId("usuario").textContent).toBe("Juan Pérez (CLIENTE)");
  });

  it("descarta la sesión si el refresh token ya venció", () => {
    sembrarSesion("CLIENTE", { refreshToken: fabricarToken(-60) });
    renderizar();
    expect(screen.getByTestId("usuario").textContent).toBe("anónimo");
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull();
  });

  it("login guarda los tokens y el rol en el almacenamiento", async () => {
    spyOn(window, "fetch").and.callFake(() =>
      respuestaJson({
        accessToken: fabricarToken(900),
        refreshToken: fabricarToken(3600),
        tipo: "Bearer",
        nombre: "Ana Admin",
        correo: "ana@museos.cl",
        rol: "ADMIN",
      })
    );
    renderizar();
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect((await screen.findByText("Ana Admin (ADMIN)")).textContent).toBe("Ana Admin (ADMIN)");
    const guardada = JSON.parse(localStorage.getItem(CLAVE_SESION));
    expect(guardada.rol).toBe("ADMIN");
    expect(guardada.accessToken).toBeTruthy();
  });

  it("cerrarSesion elimina la sesión", () => {
    sembrarSesion("CLIENTE");
    renderizar();
    fireEvent.click(screen.getByRole("button", { name: "Salir" }));
    expect(screen.getByTestId("usuario").textContent).toBe("anónimo");
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull();
  });
});
