# MuseoGestión (frontend)

Frontend en React del **Sistema de Gestión de Museos**, desarrollado para el ramo Desarrollo Fullstack II (DSY1104). Permite explorar museos, reservar una visita, simular el pago y ver los tickets generados.

## Tecnologías

- React 19 con Vite
- React Router (navegación entre páginas)
- Bootstrap 5 (diseño responsivo)
- Karma + Jasmine + React Testing Library (pruebas unitarias)

## Requisitos

- Node.js (versión LTS recomendada) y npm
- Firefox (lo usa Karma para ejecutar las pruebas)

## Instalación y ejecución

```bash
git clone https://github.com/kawyyz/museos-react.git
cd museos-react
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

Para probarla desde un celular en la misma red wifi:

```bash
npm run dev -- --host
```

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Inicio con accesos rápidos |
| `/museos` | Catálogo de museos con buscador |
| `/reservas` | Formulario de reserva de visita |
| `/pagos` | Resumen y pago de la reserva |
| `/tickets` | Entradas generadas |
| `/clientes` | Perfil del cliente |
| `/login` | Inicio de sesión |

## Estructura del proyecto

```
src/
├── components/   Navbar, Footer, Layout, MuseoCard, TicketCard (y sus pruebas)
├── pages/        Una página por ruta (y sus pruebas)
├── App.jsx       Definición de rutas
├── main.jsx      Punto de entrada
└── index.css     Estilos globales
karma.conf.mjs    Configuración de las pruebas
```

## Componentes, props y estado

- **Props:** `MuseoCard` recibe `sigla`, `nombre`, `zona` y `desc`; `TicketCard` recibe `museo`, `fecha` y `personas`. Un mismo componente dibuja todos los elementos de la lista.
- **Estado (`useState`):** el buscador de `Museos` filtra la lista según lo que se escribe; los formularios de `Reservas`, `Pagos` y `Login` controlan cada campo con su propio estado.
- **Datos entre páginas:** `Reservas` envía museo, fecha y personas por la URL; `Pagos` y `Tickets` los leen con `useSearchParams`.
- **Layout compartido:** `Layout` agrupa `Navbar`, la página actual (`Outlet`) y `Footer`. La ruta `/login` queda fuera de él.

## Diseño responsivo con Bootstrap

- **Navbar colapsable:** con `navbar-expand-md`, el menú es horizontal desde 768 px y pasa a un botón de hamburguesa en pantallas más chicas.
- **Grillas:** las tarjetas de museos y los accesos rápidos usan `row` y `col-12 col-sm-6 col-lg-3` (1 columna en móvil, 2 en tablet y 4 en escritorio).
- **Formulario de reservas:** fecha y cantidad de personas van lado a lado desde 768 px y una bajo la otra en móvil (`col-12 col-md-6`).
- **Estilos propios:** `index.css` se importa después de Bootstrap, así que mantiene la identidad visual del proyecto.

## Pruebas unitarias

Se usan **Karma** (ejecutor), **Jasmine** (framework de pruebas) y **React Testing Library** (renderiza los componentes en un DOM real). Las pruebas se ejecutan en Firefox sin ventana (headless).

```bash
npm test
```

Al terminar se muestra cada prueba, el total ejecutado y una tabla de cobertura. El reporte visual queda en `coverage/index.html`.

### Pruebas implementadas (10)

| Archivo | Qué verifica |
|---|---|
| `MuseoCard.spec.js` (3) | Props mostradas, sigla en la portada y enlace a `/reservas` |
| `TicketCard.spec.js` (3) | Datos del ticket, estado "Pagado & Confirmado" y clic en "Descargar PDF" (mock de `window.print`) |
| `Museos.spec.js` (3) | Lista inicial, filtro del buscador y mensaje sin resultados |
| `Reservas.spec.js` (1) | Envío del formulario y navegación a `/pagos` con los datos en la URL |

### Notas de configuración

- Las pruebas se nombran `*.spec.js` (aunque contengan JSX), por una limitación de `karma-esbuild` con la extensión `.jsx`.
- Un plugin de esbuild definido en `karma.conf.mjs` instrumenta los `.jsx` con Istanbul para medir la cobertura.
- La cobertura solo cuenta los archivos que alguna prueba importa. El detalle de lo cubierto y lo no cubierto está en el documento de cobertura de testing.

## Autor

- Arion Ruiz-Tagle

## Estado del proyecto

Proyecto académico. Los datos de museos, tickets y perfil son de ejemplo; aún no hay conexión con el backend de microservicios.