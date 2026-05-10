// ─── Dificultad ───────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard'

// ─── Celda ────────────────────────────────────────────────────────────────────

/**
 * Representa una celda individual del tablero 9x9.
 *
 * - `value`   → El número en la celda (1-9) o null si está vacía.
 * - `isClue`  → Si es true, fue generado por el sistema y NO puede modificarse.
 * - `isError` → Si es true, el valor actual viola las reglas del Sudoku.
 *               El sistema notifica visualmente pero NO bloquea la entrada (modo permisivo).
 */
export interface Cell {
  value: number | null
  isClue: boolean
  isError: boolean
}

// ─── Tablero ──────────────────────────────────────────────────────────────────

/** Matriz 9x9 de celdas que representa el estado completo de una partida. */
export type Board = Cell[][]

/**
 * Representación numérica plana del tablero.
 * 0 indica celda vacía. Usada internamente por el motor de generación.
 */
export type Grid = number[][]

// ─── Movimiento ───────────────────────────────────────────────────────────────

/**
 * Describe un movimiento del jugador.
 *
 * - `row`   → Fila (0-8)
 * - `col`   → Columna (0-8)
 * - `value` → Número introducido (1-9) o null para borrar la celda.
 */
export interface Move {
  row: number
  col: number
  value: number | null
}
