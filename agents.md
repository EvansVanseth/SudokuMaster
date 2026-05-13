# Agents.md - SudokuMaster Project Guide

## Project Overview

**SudokuMaster** is a web application for playing Sudoku with user authentication, game persistence, and progress tracking. Built with **React 19 + Vite + TypeScript** using Supabase as BaaS and deployed on Vercel.

---

## Architecture

The project uses **Feature-Sliced Design (FSD)** combined with **Hexagonal Architecture** for the game engine.

```
src/
├── app/              # App initialization, providers, router, global styles
├── domain/           # PURE TYPEScript: Sudoku engine, validator, types (NO React/Supabase deps)
├── features/         # Functional modules: auth, game, history
├── shared/          # Reusable: UI components, API client, utilities
└── main.tsx         # Entry point
```

---

## Key Technologies

| Category | Technology |
|----------|------------|
| Frontend | React 19 + Vite + TypeScript |
| Backend | Supabase (PostgreSQL + Auth + REST API) |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

---

## Domain Layer (src/domain/)

This is the **isolated core** with NO external dependencies. Pure TypeScript logic.

### Files:
- **`types.ts`** - Core interfaces: `Cell`, `Board`, `Grid`, `Move`, `Difficulty`
- **`validator.ts`** - Pure functions for rule validation (rows, cols, 3x3 boxes)
- **`sudokuEngine.ts`** - High-performance generator and solver using backtracking + MRV heuristic + bitmasks

### Key Types:
```typescript
type Difficulty = 'easy' | 'medium' | 'hard'
interface Cell { value: number | null; isClue: boolean; isError: boolean }
interface Move { row: number; col: number; value: number | null }
type Board = Cell[][]
type Grid = number[][]
```

---

## Commands

```bash
npm run dev          # Start dev server with HMR
npm run build       # Production build
npm run test        # Run tests once
npm run test:watch  # Run tests in watch mode
npm run lint        # Run ESLint
```

---

## Status

| Milestone | Status |
|-----------|--------|
| H-001: Base Setup & Infrastructure | ✅ Complete |
| H-002: Domain Logic (Hexagonal Core) | ✅ Complete |
| H-003: Auth & Supabase Integration | ✅ Complete |
| H-003.5: Landing Page & Auth Flow | ✅ Complete |
| H-004: Game UI | ✅ Complete |
| H-005: Persistence & Auto-save | 🔲 Pending |
| H-006: History & Dashboard | 🔲 Pending |

---

## Important Notes for AI Agents

1. **Domain layer isolation**: The `src/domain/` folder contains pure TypeScript with NO React, NO Supabase dependencies. Keep it that way.

2. **Testing**: Tests are in `__tests__` folders. Run with `npm run test`.

3. **Generation performance**: Goal is <5ms generation time with unique solution guarantee.

4. **Current Hito**: The domain logic is complete (H-002). Next work should focus on H-005 (Persistence & Auto-save).

5. **Validation approach**: The system uses a "permissive mode" - cells show errors visually but don't block input.

6. **Security & Credentials**: 
   - All connection URLs and API keys (Supabase, Google OAuth, etc.) are stored in `security_connections.md` at the root of the project.
   - **CRITICAL**: These keys must **JAMÁS** (NEVER) be shared publicly, uploaded to version control, or included in any public documentation.
   - Ensure `security_connections.md` is always listed in `.gitignore`.

7. **Database & Context**:
   - The database schema (PostgreSQL) is defined in `CONTEXT/supabase_schema.sql`.
   - Use this folder for all architectural and database documentation that should be persisted for future agent sessions.