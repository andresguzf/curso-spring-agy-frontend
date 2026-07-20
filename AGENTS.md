# AGENTS.md

Este archivo proporciona contexto, guías operativas, comandos clave, habilidades (skills) y reglas de estilo para que los agentes de IA (como Antigravity) y desarrolladores puedan comprender y modificar este proyecto de manera consistente y eficiente.

---

## 1. Descripción del Proyecto
Este proyecto es una aplicación frontend moderna para la **Gestión de Clientes y Administración de Usuarios** construida como Single Page Application (SPA). Funciona de forma integrada con un backend (generalmente en Spring Boot) que provee una API segura.

### Tech Stack Principal
* **Core:** React 19.2+ (TypeScript)
* **Build System:** Vite
* **Rutas:** React Router DOM v7
* **Estilos:** Tailwind CSS v4 (mediante `@tailwindcss/vite`)
* **Estado Global:** Zustand v5 (con middleware de persistencia en local storage)
* **Validación de Esquemas:** Zod v4 (para seguridad y validación de tipos de datos en tiempo de ejecución)
* **Cliente API:** Axios (configurado con credenciales cruzadas para cookies HTTP-only de JWT)

---

## 2. Habilidades del Agente (Skills) y Cuándo Activarlas
Este proyecto cuenta con las siguientes habilidades especiales cargadas que guían la ejecución y revisión de código:

### 1. **antigravity-guide**
* **Ruta de Referencia:** `/Users/andres/.gemini/antigravity-cli/builtin/skills/antigravity_guide/SKILL.md`
* **Cuándo Gatillar/Usar:** Actívalo cuando necesites consultar o responder preguntas sobre el funcionamiento, configuración o personalización de la plataforma Google Antigravity, la herramienta CLI `agy`, el IDE Antigravity, Antigravity 2.0 o el SDK de Python.

### 2. **vercel-react-best-practices**
* **Ruta de Referencia:** `file:///Users/andres/Desktop/SpringAntigravityAI/4-react-app/.agents/skills/vercel-react-best-practices/SKILL.md`
* **Cuándo Gatillar/Usar:** Debe usarse al escribir, revisar o refactorear componentes React para asegurar patrones de rendimiento óptimos (renderizado, optimización de bundles, control de efectos, etc.). Gatillar en tareas que involucren optimización de rendimiento o refactorizaciones complejas de React.

### 3. **web-design-guidelines**
* **Ruta de Referencia:** `file:///Users/andres/Desktop/SpringAntigravityAI/4-react-app/.agents/skills/web-design-guidelines/SKILL.md`
* **Cuándo Gatillar/Usar:** Utilízalo para auditar componentes visuales y verificar la conformidad del diseño UI/UX. Gatillar cuando el usuario pida "revisar la UI", "verificar accesibilidad", "auditar diseño", "revisar experiencia de usuario (UX)" o verificar contra las mejores prácticas de interfaz web premium.

---

## 3. Comandos del Ciclo de Vida
Ejecuta los siguientes comandos desde la raíz del proyecto para tareas comunes:

* **Instalar dependencias:**
  ```bash
  npm install
  ```
* **Iniciar servidor de desarrollo:**
  ```bash
  npm run dev
  ```
  *(Por defecto, corre en el puerto `5173` y proxies `/api` hacia `http://localhost:8080`)*
* **Construir para producción:**
  ```bash
  npm run build
  ```
* **Validar código (Linter):**
  ```bash
  npx oxlint
  ```

---

## 4. Estructura de Directorios Clave
El código fuente reside principalmente en `src/`:

* **`src/types/index.ts`:** Contiene todas las definiciones de tipos e interfaces de TypeScript (DTOs para Customers, Users, LoginRequest, etc.). **Siempre añade nuevos tipos aquí**.
* **`src/services/api.ts`:** Cliente Axios unificado y servicios de consumo de API agrupados (`authService`, `userService`, `customerService`).
* **`src/store/`:** Stores globales de Zustand:
  * `authStore.ts`: Maneja autenticación, roles (`hasRole`), estados de carga e inicio de sesión.
  * `themeStore.ts`: Controla el tema claro/oscuro persistente y la inyección de la clase `dark` en el DOM raíz.
* **`src/components/`:** Componentes de UI modulares.
  * `ProtectedRoute.tsx`: Guardia de rutas. Valida si el usuario está autenticado y si cuenta con el `requiredRole` (ej. `ROLE_ADMIN`).
  * `Layout.tsx`: Estructura principal con barra lateral, barra superior y área de contenido principal.
  * Componentes compartidos: `Toast.tsx`, `ConfirmModal.tsx`, `Pagination.tsx`, `SearchBar.tsx`.
* **`src/pages/`:** Páginas completas asociadas a las rutas:
  * `Login.tsx` / `Register.tsx` (Rutas públicas)
  * `Dashboard.tsx` (Métricas y resumen)
  * `Customers.tsx` (Gestión de Clientes)
  * `Users.tsx` (Gestión de Usuarios, restringido a Administradores)

---

## 5. Guías de Estilo y UI
Este proyecto utiliza un sistema de diseño altamente premium y moderno. Sigue estas pautas al crear o modificar componentes:

* **Tema Oscuro:** La aplicación está optimizada con un tema oscuro por defecto. Las clases personalizadas deben usar la variante `dark:` de Tailwind CSS v4.
* **Clases Premium Definidas en `src/index.css`:**
  * **Efecto de Cristal:** Usa `.glass-panel` para componentes tipo tarjeta o contenedores destacados.
  * **Hover en Tarjetas:** Usa `.glass-card-hover` para añadir micro-animaciones en tarjetas interactivas.
  * **Textos Estilizados:** Usa `.text-gradient` para degradados modernos en títulos y textos destacados.
  * **Fondos Dinámicos:** Usa `.bg-gradient-premium` para el fondo degradado radial del cuerpo del sitio.
* **Animaciones:** Usa clases como `animate-pulse-slow` o `animate-slide-down` para mejorar el feedback de usuario.

---

## 6. Reglas y Restricciones para Agentes de IA
Al realizar tareas en este repositorio, adhiérete estrictamente a las siguientes reglas:

1. **Definición de Tipos Primero:** Antes de consumir un nuevo servicio en `src/services/api.ts`, define o actualiza su tipo en `src/types/index.ts`. No utilices tipos `any`.
2. **Autorización y Roles:** Al agregar botones, opciones o nuevas páginas, asegura la visibilidad usando la función `hasRole` de `useAuthStore` (ej: `hasRole('ROLE_ADMIN')`).
3. **Manejo de API y Cookies:** No modifiques `withCredentials: true` en `src/services/api.ts`, ya que las sesiones dependen de cookies HttpOnly seguras configuradas por el backend.
4. **Preservar Comentarios:** No elimines los comentarios explicativos existentes en los componentes o configuraciones.
5. **No Crear Estilos Ad-Hoc:** Usa el sistema de diseño existente y las variables globales. Evita agregar colores directos o configuraciones personalizadas fuera de la paleta establecida en `index.css`.

---

## 7. Repositorio Remoto
* **GitHub Repository**: [curso-spring-agy-frontend](https://github.com/andresguzf/curso-spring-agy-frontend)

