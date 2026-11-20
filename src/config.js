// Dirección del backend.
// - Desarrollo: si no se define VITE_API_URL, apunta a http://localhost:8080
// - Despliegue con nginx: VITE_API_URL se define vacío y las llamadas van a la misma dirección (/api/...)
export const API_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:8080";
