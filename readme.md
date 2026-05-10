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
│   ├── providers/       # Contextos globales (ej. AuthProvider)
│   ├── router/          # Configuración de rutas (React Router)
│   └── styles/          # Estilos globales y variables CSS
│
├── domain/              # NÚCLEO AISLADO: Lógica pura del Sudoku
│   ├── sudokuEngine.ts  # Algoritmos de generación y resolución
│   ├── validator.ts     # Reglas matemáticas (filas, columnas, cuadrantes)
│   └── types.ts         # Interfaces de las entidades (Board, Cell, Move)
│
├── features/
│   ├── auth/            # Login, registro y perfil de usuario
│   ├── game/            # Tablero, Numpad, Timer y controles
│   └── history/         # Historial de partidas
│
├── shared/
│   ├── ui/              # Componentes base (Button, Modal, Card)
│   ├── api/             # Configuración del cliente de Supabase
│   └── utils/           # Funciones de formateo
│
└── main.tsx             # Punto de entrada principal
```

---

## Hitos del Proyecto

| ID    | Hito                                               | Estado       |
| :---- | :------------------------------------------------- | :----------- |
| H-001 | Configuración Base e Infraestructura (App / Shared) | ✅ Completado |
| H-002 | Lógica de Dominio (Núcleo Hexagonal)               | ✅ Completado |
| H-003 | Autenticación, Seguridad y Base de Datos (Supabase) | 🔲 Pendiente  |
| H-004 | Interfaz de Usuario Core (UI del Juego)            | 🔲 Pendiente  |
| H-005 | Persistencia de Datos y Autoguardado               | 🔲 Pendiente  |
| H-006 | Historial, Dashboard y Cierre                      | 🔲 Pendiente  |

---

## Hito 1 — Configuración Base e Infraestructura

**Objetivo:** Establecer los cimientos del proyecto: scaffolding de la aplicación React + Vite, estructura de carpetas FSD, entorno de testing y pipeline de despliegue continuo hacia Vercel.

### Pasos realizados

#### 1. Scaffolding del proyecto

Se inicializó el proyecto usando la plantilla oficial de Vite con React y TypeScript:

```bash
npx create-vite@latest ./ --template react-ts
npm install
```

Versiones clave instaladas:
- `react` y `react-dom`: `^19.2.5`
- `vite`: `^8.0.10`
- `typescript`: `~6.0.2`

---

#### 2. Configuración del entorno de testing (Vitest)

Se instaló y configuró **Vitest** junto con **Testing Library** para poder ejecutar tests unitarios y de componentes:

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom
```

Se añadieron los scripts de test en `package.json`:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

Se actualizó `vite.config.ts` para integrar Vitest con `jsdom` como entorno de ejecución y un fichero de setup global:

```ts
/// <reference types="vitest/config" />
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

Se creó el fichero de setup `src/test/setup.ts` para importar los matchers de `@testing-library/jest-dom`.

---

#### 3. Estructura de carpetas FSD

Se creó la estructura de directorios siguiendo **Feature-Sliced Design** combinado con la **Arquitectura Hexagonal**:

```
src/
├── app/
│   ├── providers/
│   ├── router/
│   └── styles/
│       └── index.css      # Variables CSS globales y reset
├── domain/                # Reservado para H-002 (motor puro de TS)
├── features/
│   ├── auth/
│   ├── game/
│   └── history/
├── shared/
│   ├── api/               # Reservado para H-003 (cliente Supabase)
│   ├── ui/
│   └── utils/
└── test/
    └── setup.ts
```

---

#### 4. Test de humo del componente raíz

Se creó el primer test funcional en `src/app/App.test.tsx` para verificar que el componente raíz de la aplicación renderiza correctamente:

```tsx
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByText(/SudokuMaster/i)).toBeInTheDocument()
  })
})
```

---

#### 5. Configuración del despliegue continuo (CI/CD) en Vercel

Se creó el fichero `vercel.json` en la raíz del proyecto para configurar el pipeline de despliegue automático. Cada `push` a la rama `main` del repositorio **EvansVanseth/SudokuMaster** desencadena un despliegue en Vercel.

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

> La regla de rutas garantiza que la SPA (Single Page Application) gestione correctamente la navegación del lado del cliente en Vercel.

---

### Resultado de la validación del Hito 1

- ✅ `npm run dev` — Servidor de desarrollo arranca correctamente.
- ✅ `npm run build` — Compilación de producción sin errores TypeScript.
- ✅ `npm run test` — Test de humo del componente `App` pasa correctamente.
- ✅ Pipeline CI/CD hacia Vercel conectado vía `vercel.json`.

---

## Hito 2 — Lógica de Dominio (Núcleo Hexagonal)

**Objetivo:** Implementar el motor lógico del Sudoku de forma totalmente aislada de la interfaz, garantizando un rendimiento óptimo y la generación de puzzles profesionales con solución única.

### Pasos realizados

#### 1. Definición de Entidades de Dominio

Se establecieron los tipos base en `src/domain/types.ts` para representar el tablero, las celdas y los niveles de dificultad, permitiendo que el resto de la aplicación hable un lenguaje común agnóstico a la tecnología.

#### 2. Validador de Reglas Matemáticas

Se implementó `src/domain/validator.ts` con funciones puras para verificar la validez de los movimientos y el estado de resolución del tablero, sin efectos secundarios.

#### 3. Motor de Sudoku de Alto Rendimiento

Se desarrolló un motor en `src/domain/sudokuEngine.ts` que incluye:
- **Solver**: Backtracking optimizado con máscaras de bits y heurística **MRV**.
- **Generador**: Eliminación simétrica de celdas con verificación de unicidad (node-limited).

#### 4. Documentación de la Lógica de Negocio

Se ha creado un documento detallado con el funcionamiento interno del motor:
- [Documentación de Lógica de Negocio (Técnica)](docs/business_logic.md)
- [¿Cómo se genera un Sudoku? (Explicación conceptual)](docs/explicacion_generador.md)

#### 5. Suite de Tests Unitarios

Se implementaron tests exhaustivos en `src/domain/__tests__/`, logrando una cobertura completa de las reglas y el motor de generación.

---

### Resultado de la validación del Hito 2

- ✅ Generación de tableros en < 5ms (todas las dificultades).
- ✅ Garantía de solución única y simetría profesional.
- ✅ 28 tests unitarios pasando en Vitest.
- ✅ Lógica 100% aislada en la capa de `domain/`.

---

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo con HMR
npm run dev

# Ejecutar tests unitarios (una sola pasada)
npm run test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Compilación de producción
npm run build
```

---

## Repositorio

**GitHub:** [EvansVanseth/SudokuMaster](https://github.com/EvansVanseth/SudokuMaster)
