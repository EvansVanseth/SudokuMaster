import type { Board, Grid } from './types'

// ─── Helpers internos ─────────────────────────────────────────────────────────

/** Obtiene el índice de la esquina superior-izquierda del cuadrante 3x3 al que pertenece [row, col]. */
const boxStart = (index: number) => Math.floor(index / 3) * 3

// ─── Validación de Fila ───────────────────────────────────────────────────────

/**
 * Comprueba si `value` ya existe en la fila `row`, ignorando la propia celda [row, col].
 */
export function isRowValid(board: Board, row: number, col: number, value: number): boolean {
  for (let c = 0; c < 9; c++) {
    if (c === col) continue
    if (board[row][c].value === value) return false
  }
  return true
}

/**
 * Versión para Grid (matriz numérica). Usada por el motor de generación.
 */
export function isRowValidGrid(grid: Grid, row: number, col: number, value: number): boolean {
  for (let c = 0; c < 9; c++) {
    if (c === col) continue
    if (grid[row][c] === value) return false
  }
  return true
}

// ─── Validación de Columna ────────────────────────────────────────────────────

/**
 * Comprueba si `value` ya existe en la columna `col`, ignorando la propia celda [row, col].
 */
export function isColValid(board: Board, row: number, col: number, value: number): boolean {
  for (let r = 0; r < 9; r++) {
    if (r === row) continue
    if (board[r][col].value === value) return false
  }
  return true
}

/**
 * Versión para Grid. Usada por el motor de generación.
 */
export function isColValidGrid(grid: Grid, row: number, col: number, value: number): boolean {
  for (let r = 0; r < 9; r++) {
    if (r === row) continue
    if (grid[r][col] === value) return false
  }
  return true
}

// ─── Validación de Cuadrante 3x3 ─────────────────────────────────────────────

/**
 * Comprueba si `value` ya existe en el cuadrante 3x3 al que pertenece [row, col],
 * ignorando la propia celda.
 */
export function isBoxValid(board: Board, row: number, col: number, value: number): boolean {
  const rStart = boxStart(row)
  const cStart = boxStart(col)
  for (let r = rStart; r < rStart + 3; r++) {
    for (let c = cStart; c < cStart + 3; c++) {
      if (r === row && c === col) continue
      if (board[r][c].value === value) return false
    }
  }
  return true
}

/**
 * Versión para Grid. Usada por el motor de generación.
 */
export function isBoxValidGrid(grid: Grid, row: number, col: number, value: number): boolean {
  const rStart = boxStart(row)
  const cStart = boxStart(col)
  for (let r = rStart; r < rStart + 3; r++) {
    for (let c = cStart; c < cStart + 3; c++) {
      if (r === row && c === col) continue
      if (grid[r][c] === value) return false
    }
  }
  return true
}

// ─── Validación Compuesta ─────────────────────────────────────────────────────

/**
 * Comprueba si colocar `value` en [row, col] es un movimiento válido:
 * no viola ninguna regla en fila, columna ni cuadrante.
 */
export function isMoveValid(board: Board, row: number, col: number, value: number): boolean {
  return (
    isRowValid(board, row, col, value) &&
    isColValid(board, row, col, value) &&
    isBoxValid(board, row, col, value)
  )
}

/**
 * Versión para Grid. Usada por el motor de generación.
 */
export function isMoveValidGrid(grid: Grid, row: number, col: number, value: number): boolean {
  return (
    isRowValidGrid(grid, row, col, value) &&
    isColValidGrid(grid, row, col, value) &&
    isBoxValidGrid(grid, row, col, value)
  )
}

// ─── Comprobación de Victoria ─────────────────────────────────────────────────

/**
 * Devuelve true si el tablero está completamente resuelto:
 * todas las celdas tienen valor y ninguna está marcada como error.
 */
export function isBoardSolved(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = board[r][c]
      if (cell.value === null || cell.isError) return false
    }
  }
  return true
}
