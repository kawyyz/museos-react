import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, registrarExpiracion } from "../services/api.js";
import { CLAVE_SESION, borrarSesion, guardarSesion, leerSesion, sesionVigente } from "./session.js";

const AuthContext = createContext(null);

// Al cargar la página se recupera la sesión guardada: así sobrevive a las recargas.
// Si el refresh token ya venció, la sesión se descarta.
function sesionInicial() {
  const sesion = leerSesion();
  if (sesion && sesionVigente(sesion)) return sesion;
  if (sesion) borrarSesion();
  return null;
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(sesionInicial);

  const cerrarSesion = useCallback(() => {
    borrarSesion();
    setSesion(null);
  }, []);

  // Si el servicio de API detecta que la sesión expiró, se cierra aquí
  useEffect(() => {
    registrarExpiracion(cerrarSesion);
  }, [cerrarSesion]);

  // Si se inicia o cierra sesión en otra pestaña, esta se entera
  useEffect(() => {
    const alCambiar = (e) => {
      if (e.key === CLAVE_SESION || e.key === null) setSesion(sesionInicial());
    };
    window.addEventListener("storage", alCambiar);
    return () => window.removeEventListener("storage", alCambiar);
  }, []);

  const iniciar = useCallback((datos) => {
    const nueva = {
      accessToken: datos.accessToken,
      refreshToken: datos.refreshToken,
      nombre: datos.nombre,
      correo: datos.correo,
      rol: datos.rol,
    };
    guardarSesion(nueva);
    setSesion(nueva);
    return nueva;
  }, []);

  const login = useCallback(
    async (correo, password) => {
      const datos = await api("/api/auth/login", {
        metodo: "POST",
        cuerpo: { correo, password },
        auth: false,
      });
      return iniciar(datos);
    },
    [iniciar]
  );

  const registrar = useCallback(
    async (formulario) => {
      const datos = await api("/api/auth/registro", {
        metodo: "POST",
        cuerpo: formulario,
        auth: false,
      });
      return iniciar(datos);
    },
    [iniciar]
  );

  const valor = useMemo(
    () => ({
      usuario: sesion ? { nombre: sesion.nombre, correo: sesion.correo, rol: sesion.rol } : null,
      autenticado: Boolean(sesion),
      esAdmin: sesion?.rol === "ADMIN",
      login,
      registrar,
      cerrarSesion,
    }),
    [sesion, login, registrar, cerrarSesion]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return contexto;
}
