import { CLAVE_SESION } from "../auth/session.js";

// Respuesta falsa de fetch con cuerpo JSON
export function respuestaJson(datos, estado = 200) {
  const cuerpo = estado === 204 ? null : JSON.stringify(datos);
  return Promise.resolve(
    new Response(cuerpo, { status: estado, headers: { "Content-Type": "application/json" } })
  );
}

// Token con la forma de un JWT cuyo "exp" es dentro de N segundos (negativo = ya vencido)
export function fabricarToken(segundos) {
  const carga = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + segundos }));
  return `cabecera.${carga}.firma`;
}

// Deja una sesión guardada, como si el usuario ya hubiera iniciado sesión antes de recargar
export function sembrarSesion(rol = "CLIENTE", extra = {}) {
  const sesion = {
    accessToken: fabricarToken(900),
    refreshToken: fabricarToken(3600),
    nombre: "Juan Pérez",
    correo: "juan.perez@email.com",
    rol,
    ...extra,
  };
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  return sesion;
}

export function limpiarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

export const museosApi = [
  { id: 1, sigla: "AC", nombre: "Museo de Arte Contemporáneo", zona: "Santiago Centro", descripcion: "Arte moderno.", precioEntrada: 5000, capacidadDiaria: 200, activo: true },
  { id: 2, sigla: "HN", nombre: "Museo de Historia Natural", zona: "Providencia", descripcion: "Fósiles y minerales.", precioEntrada: 4500, capacidadDiaria: 150, activo: true },
  { id: 3, sigla: "CT", nombre: "Museo de Ciencia y Tecnología", zona: "Ñuñoa", descripcion: "Salas interactivas.", precioEntrada: 6000, capacidadDiaria: 180, activo: true },
  { id: 4, sigla: "AV", nombre: "Museo de Artes Visuales", zona: "Lastarria", descripcion: "Fotografía y escultura.", precioEntrada: 4000, capacidadDiaria: 120, activo: true },
  { id: 5, sigla: "XX", nombre: "Museo Cerrado", zona: "Centro", descripcion: "No disponible.", precioEntrada: 1000, capacidadDiaria: 10, activo: false },
];
