// Dirección del backend. En desarrollo apunta a localhost; en producción se define con VITE_API_URL
export const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";
