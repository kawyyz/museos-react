// Almacenamiento de la sesión en el navegador (localStorage), para que sobreviva a las recargas de página.
export const CLAVE_SESION = "museogestion.sesion";

export function leerSesion() {
  try {
    const crudo = localStorage.getItem(CLAVE_SESION);
    return crudo ? JSON.parse(crudo) : null;
  } catch {
    return null;
  }
}

export function guardarSesion(sesion) {
  try {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  } catch {
    // Si el navegador bloquea el almacenamiento, la sesión dura solo mientras la página siga abierta
  }
}

export function borrarSesion() {
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch {
    // sin acción
  }
}

// Lee la fecha de expiración (en milisegundos) de un JWT. Solo sirve para decidir si conviene
// conservar la sesión: la validez real la verifica siempre el backend con la firma.
export function expiraEn(token) {
  try {
    const carga = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(carga)).exp * 1000;
  } catch {
    return 0;
  }
}

// La sesión sigue vigente mientras el refresh token no haya vencido
export function sesionVigente(sesion) {
  return Boolean(sesion?.refreshToken) && expiraEn(sesion.refreshToken) > Date.now();
}
