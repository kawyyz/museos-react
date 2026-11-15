import { api, ApiError, registrarExpiracion } from "./api.js";
import { CLAVE_SESION } from "../auth/session.js";
import { fabricarToken, limpiarSesion, respuestaJson, sembrarSesion } from "../pruebas/ayudas.js";

describe("Servicio api (comunicación con el backend)", () => {
  afterEach(() => {
    limpiarSesion();
    registrarExpiracion(() => {});
  });

  it("envía el access token en la cabecera Authorization", async () => {
    const sesion = sembrarSesion("CLIENTE");
    spyOn(window, "fetch").and.callFake(() => respuestaJson({ ok: true }));

    await api("/api/perfil");

    const [, init] = window.fetch.calls.argsFor(0);
    expect(init.headers.Authorization).toBe(`Bearer ${sesion.accessToken}`);
  });

  it("no envía token en las rutas públicas (auth: false)", async () => {
    sembrarSesion("CLIENTE");
    spyOn(window, "fetch").and.callFake(() => respuestaJson([]));

    await api("/api/museos", { auth: false });

    const [, init] = window.fetch.calls.argsFor(0);
    expect(init.headers.Authorization).toBeUndefined();
  });

  it("si el access token venció, renueva los tokens con el refresh token y reintenta", async () => {
    sembrarSesion("CLIENTE");
    const nuevoAccess = fabricarToken(900);
    let intentosPerfil = 0;
    spyOn(window, "fetch").and.callFake((url) => {
      if (url.endsWith("/api/auth/refresh")) {
        return respuestaJson({
          accessToken: nuevoAccess,
          refreshToken: fabricarToken(3600),
          nombre: "Juan Pérez",
          rol: "CLIENTE",
        });
      }
      intentosPerfil += 1;
      return intentosPerfil === 1
        ? respuestaJson({ error: "No autenticado" }, 401)
        : respuestaJson({ nombre: "Juan Pérez" });
    });

    const resultado = await api("/api/perfil");

    expect(resultado.nombre).toBe("Juan Pérez");
    expect(intentosPerfil).toBe(2);
    expect(JSON.parse(localStorage.getItem(CLAVE_SESION)).accessToken).toBe(nuevoAccess);
  });

  it("si la renovación falla, cierra la sesión y avisa", async () => {
    sembrarSesion("CLIENTE");
    const aviso = jasmine.createSpy("sesionExpirada");
    registrarExpiracion(aviso);
    spyOn(window, "fetch").and.callFake(() => respuestaJson({ error: "No autenticado" }, 401));

    await expectAsync(api("/api/perfil")).toBeRejected();

    expect(aviso).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull();
  });

  it("convierte los errores del backend en ApiError con su mensaje", async () => {
    spyOn(window, "fetch").and.callFake(() => respuestaJson({ error: "La reserva ya fue pagada" }, 400));

    try {
      await api("/api/reservas/1/pago", { metodo: "POST", cuerpo: {} });
      fail("Debió lanzar un error");
    } catch (e) {
      expect(e instanceof ApiError).toBeTrue();
      expect(e.message).toBe("La reserva ya fue pagada");
      expect(e.estado).toBe(400);
    }
  });
});
