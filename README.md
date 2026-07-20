# Curso Spring & Antigravity AI - Frontend

Este proyecto es la aplicación frontend moderna para la **Gestión de Clientes y Administración de Usuarios**, construida como una Single Page Application (SPA).

## Tech Stack Principal

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Enrutamiento**: [React Router DOM v7](https://reactrouter.com/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) (integrado mediante `@tailwindcss/vite`)
- **Estado Global**: [Zustand v5](https://github.com/pmndrs/zustand) (con persistencia en LocalStorage)
- **Validaciones**: [Zod v4](https://zod.dev/) para esquemas y validación de tipos
- **Cliente HTTP**: [Axios](https://axios-http.com/) configurado con `withCredentials: true` para el manejo automático de cookies JWT HttpOnly del backend (compatible con CORS SameSite=None y Secure).

## Características

- **Tema Oscuro Persistente**: Sistema de tema claro/oscuro que inyecta dinámicamente clases en el DOM y se persiste automáticamente en Zustand.
- **Paneles Visuales Premium**: Uso de estilos avanzados como `.glass-panel` (Glassmorphism), degradados premium y micro-animaciones en interacciones.
- **Rutas Protegidas**: Guardia de rutas (`ProtectedRoute`) que valida la autenticación y los permisos requeridos (`hasRole`) antes de permitir el acceso a ciertas vistas (ej: `/users` requiere `ROLE_ADMIN`).

## Requisitos de Ejecución

- **Node.js**: v18 o superior.
- **npm** o **yarn**.

## Comandos Útiles

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```

2. **Servidor de Desarrollo**:
   ```bash
   npm run dev
   ```
   *Nota: Por defecto corre en `http://localhost:5173` y tiene configurado un proxy de Vite `/api` hacia `http://localhost:8080` (puerto predeterminado del backend).*

3. **Compilar para Producción**:
   ```bash
   npm run build
   ```

4. **Validación de Código (Oxlint)**:
   ```bash
   npx oxlint
   ```
