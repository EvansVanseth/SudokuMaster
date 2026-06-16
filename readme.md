# SudokuMaster

Aplicación web para jugar al Sudoku con autenticación de usuarios, persistencia de partidas y seguimiento del progreso. Construida con **React + Vite + TypeScript** y respaldada por **Supabase** y **Vercel**.

---

## Stack Tecnológico

| Capa        | Tecnología          | Función                                                    |
| :---------- | :------------------ | :--------------------------------------------------------- |
| Frontend    | React 19 + Vite     | Interfaz de usuario y lógica del motor de Sudoku.          |
| Hosting     | Vercel              | Despliegue de la SPA y optimización de entrega (CDN).      |
| BaaS        | Supabase            | Gestión de base de datos, Auth y API REST automática.      |
| Base de Datos | PostgreSQL (JSONB) | Almacenamiento relacional del estado de las partidas.      |
| Testing     | Vitest + Testing Library | Tests unitarios y de componentes.                   |

---

## Arquitectura

El proyecto combina **Feature-Sliced Design (FSD)** con una **Arquitectura Hexagonal** para el motor del juego.

- **`domain/`** — Núcleo aislado: lógica pura de TypeScript sin dependencias de React ni Supabase.
- **`features/`** — Módulos funcionales: `auth`, `game`, `history`.
- **`shared/`** — Recursos reutilizables: componentes base, cliente de API y utilidades.
- **`app/`** — Inicialización: proveedores, rutas y estilos globales.

```
src/
├── app/
├── domain/              # NÚCLEO AISLADO
├── features/
├── shared/
└── main.tsx             # Punto de entrada principal
```

---

## Hitos del Proyecto

| ID    | Hito                                               | Estado       |
| :---- | :------------------------------------------------- | :----------- |
| H-001 | Configuración Base e Infraestructura               | ✅ Completado |
| H-002 | Lógica de Dominio (Núcleo Hexagonal)               | ✅ Completado |
| H-003 | Autenticación, Landing Page y Flujo de Usuario     | ✅ Completado |
| H-004 | Interfaz de Usuario Core (UI del Juego)            | ✅ Completado |
| H-005 | Persistencia de Datos y Autoguardado               | ✅ Completado |
| H-006 | Historial, Dashboard y Mejoras UX                  | ✅ Completado |

---

## Fase Actual: Iteración y Mejoras

Actualmente, el proyecto ha completado su fase de hitos principales (H-001 a H-006). Nos encontramos en una fase de **seguimiento, refinamiento estético y desarrollo de nuevas características** orientadas a mejorar la experiencia de usuario (UX) y la comunidad.

### Mejoras recientes (UI/UX Refinements)
- **Refinamiento visual**: Mejora del layout en Landing Page y Dashboard para una experiencia más coherente y profesional.
- **Game Companion**: Integración de trivia dinámica para enriquecer la experiencia de juego en escritorio y móvil.
- **Feedback**: Sistema de sugerencias integrado con Supabase y Resend para recibir feedback directo de los usuarios.
- **Optimización móvil**: Adaptación de componentes para una navegación más fluida en dispositivos móviles.

---

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo con HMR
npm run dev

# Ejecutar tests unitarios
npm run test

# Compilación de producción
npm run build
```

---

## Repositorio

**GitHub:** [EvansVanseth/SudokuMaster](https://github.com/EvansVanseth/SudokuMaster)
