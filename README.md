# MuseoGestión (frontend)

Frontend en React del **Sistema de Gestión de Museos**, desarrollado para el ramo Desarrollo Fullstack II (DSY1104). Permite explorar museos, reservar una visita, simular el pago y ver los tickets generados.

## Tecnologías

- React
- Vite
- React Router

## Requisitos

- Node.js (versión LTS recomendada)
- npm

## Instalación y ejecución

```bash
git clone https://github.com/kawyyz/museos-react.git
cd museos-react
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Inicio con accesos rápidos |
| `/museos` | Catálogo de museos disponibles |
| `/reservas` | Formulario de reserva de visita |
| `/pagos` | Resumen y pago de la reserva |
| `/tickets` | Entradas generadas |
| `/clientes` | Perfil del cliente |
| `/login` | Inicio de sesión |

## Estructura del proyecto

```
src/
├── components/   Navbar, Footer y Layout compartido
├── pages/        Una página por ruta
├── App.jsx       Definición de rutas
├── main.jsx      Punto de entrada
└── index.css     Estilos globales
```

## Flujo principal

1. El usuario elige un museo en **Museos** y pulsa "Reservar visita".
2. En **Reservas** completa museo, fecha y cantidad de personas.
3. En **Pagos** revisa el resumen y confirma el pago.
4. En **Tickets** ve la entrada generada.

## Integrantes

- Nombre Apellido
- Nombre Apellido
- Nombre Apellido

## Estado del proyecto

Proyecto académico. Los datos de museos, tickets y perfil son de ejemplo; aún no hay conexión con el backend de microservicios.