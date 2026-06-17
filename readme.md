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
| H-007 | Refinamiento de Funcionalidades y Estabilidad       | ✅ Completado |

---

## Fase Actual: Mantenimiento y Evolución

El proyecto ha completado los hitos originales (H-001 a H-006) y la fase de refinamiento (H-007). Actualmente trabajamos en mejoras de UX, gamificación (Leaderboard) y gestión de cuenta.

### Actualizaciones recientes
- **Integración de Versión**: Footer informativo con versión dinámica.
- **Estadísticas precisas**: Cálculo basado únicamente en partidas completadas.
- **Leaderboard**: Sistema de ranking competitivo con diseño visual.
- **Gestión de Cuenta**: Panel de usuario para edición de perfil y sesión.


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
