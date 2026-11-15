import { API_URL } from "../config.js";
import { borrarSesion, guardarSesion, leerSesion } from "../auth/session.js";

export class ApiError extends Error {
  constructor(mensaje, estado) {
    super(mensaje);
    this.estado = estado;
  }
}

// El contexto de autenticación se registra aquí para enterarse cuando la sesión expira
let alExpirarSesion = () => {};
export function registrarExpiracion(funcion) {
  alExpirarSesion = funcion;
}

async function leerRespuesta(res) {
  if (res.status === 204) return null;
  const texto = await res.text();
  let datos = null;
  try {
    datos = texto ? JSON.parse(texto) : null;
  } catch {
    datos = null;
  }
  if (!res.ok) {
    const mensaje =
      datos?.error ||
      (datos && typeof datos === "object" ? Object.values(datos).join(". ") : "") ||
      `Error ${res.status}`;
    throw new ApiError(mensaje, res.status);
  }
  return datos;
}

// Pide un par de tokens nuevo con el refresh token. Devuelve true si lo logró.
async function renovarTokens() {
  const sesion = leerSesion();
  if (!sesion?.refreshToken) return false;
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: sesion.refreshToken }),
    });
    if (!res.ok) return false;
    const datos = await res.json();
    guardarSesion({
      ...sesion,
      accessToken: datos.accessToken,
      refreshToken: datos.refreshToken,
      nombre: datos.nombre,
      rol: datos.rol,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Llamada al backend. Agrega el token en la cabecera Authorization y, si el servidor responde 401
 * (access token vencido), intenta renovarlo una vez antes de rendirse y cerrar la sesión.
 */
export async function api(ruta, { metodo = "GET", cuerpo, auth = true } = {}) {
  const intentar = () => {
    const headers = {};
    if (cuerpo !== undefined) headers["Content-Type"] = "application/json";
    const sesion = leerSesion();
    if (auth && sesion?.accessToken) headers.Authorization = `Bearer ${sesion.accessToken}`;
    return fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  };

  let res;
  try {
    res = await intentar();
    if (res.status === 401 && auth && (await renovarTokens())) {
      res = await intentar();
    }
  } catch {
    throw new ApiError("No se pudo conectar con el servidor. Intenta nuevamente.", 0);
  }

  if (res.status === 401 && auth && leerSesion()) {
    borrarSesion();
    alExpirarSesion();
  }
  return leerRespuesta(res);
}
