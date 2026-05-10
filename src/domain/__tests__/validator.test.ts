import { describe, it, expect } from 'vitest'
import {
  isRowValid,
  isColValid,
  isBoxValid,
  isMoveValid,
  isBoardSolved,
} from '../validator'
import type { Board, Cell } from '../types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Crea un Board 9x9 vacío para tests. */
function emptyBoard(): Board {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, (): Cell => ({ value: null, isClue: false, isError: false }))
  )
}

/** Crea un Board 9x9 completamente resuelto (solución conocida y válida). */
function solvedBoard(): Board {
  const values = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ]
  return values.map(row =>
    row.map((v): Cell => ({ value: v, isClue: true, isError: false }))
  )
}

// ─── Tests: isRowValid ────────────────────────────────────────────────────────

describe('isRowValid', () => {
  it('devuelve true cuando el valor no está repetido en la fila', () => {
    const board = emptyBoard()
    board[0][0].value = 5
    expect(isRowValid(board, 0, 1, 3)).toBe(true)
  })

  it('devuelve false cuando el valor ya existe en la fila (diferente columna)', () => {
    const board = emptyBoard()
    board[0][0].value = 5
    expect(isRowValid(board, 0, 1, 5)).toBe(false)
  })

  it('ignora la propia celda al validar (no se autoconflictúa)', () => {
    const board = emptyBoard()
    board[2][3].value = 7
    expect(isRowValid(board, 2, 3, 7)).toBe(true)
  })
})

// ─── Tests: isColValid ────────────────────────────────────────────────────────

describe('isColValid', () => {
  it('devuelve true cuando el valor no está repetido en la columna', () => {
    const board = emptyBoard()
    board[0][4].value = 9
    expect(isColValid(board, 1, 4, 3)).toBe(true)
  })

  it('devuelve false cuando el valor ya existe en la columna (diferente fila)', () => {
    const board = emptyBoard()
    board[0][4].value = 9
    expect(isColValid(board, 1, 4, 9)).toBe(false)
  })

  it('ignora la propia celda al validar', () => {
    const board = emptyBoard()
    board[5][5].value = 4
    expect(isColValid(board, 5, 5, 4)).toBe(true)
  })
})

// ─── Tests: isBoxValid ────────────────────────────────────────────────────────

describe('isBoxValid', () => {
  it('devuelve true cuando el valor no está repetido en el cuadrante', () => {
    const board = emptyBoard()
    board[0][0].value = 1
    board[0][1].value = 2
    expect(isBoxValid(board, 1, 2, 3)).toBe(true)
  })

  it('devuelve false cuando el valor ya existe en el cuadrante 3x3', () => {
    const board = emptyBoard()
    board[0][0].value = 6
    expect(isBoxValid(board, 1, 2, 6)).toBe(false)
  })

  it('detecta conflicto en el cuadrante central (3,3)-(5,5)', () => {
    const board = emptyBoard()
    board[3][3].value = 8
    expect(isBoxValid(board, 4, 4, 8)).toBe(false)
  })

  it('ignora la propia celda al validar', () => {
    const board = emptyBoard()
    board[6][6].value = 9
    expect(isBoxValid(board, 6, 6, 9)).toBe(true)
  })
})

// ─── Tests: isMoveValid ───────────────────────────────────────────────────────

describe('isMoveValid', () => {
  it('acepta un movimiento válido en tablero vacío', () => {
    const board = emptyBoard()
    expect(isMoveValid(board, 0, 0, 5)).toBe(true)
  })

  it('rechaza movimiento que viola la fila', () => {
    const board = emptyBoard()
    board[0][3].value = 5
    expect(isMoveValid(board, 0, 0, 5)).toBe(false)
  })

  it('rechaza movimiento que viola la columna', () => {
    const board = emptyBoard()
    board[4][0].value = 5
    expect(isMoveValid(board, 0, 0, 5)).toBe(false)
  })

  it('rechaza movimiento que viola el cuadrante', () => {
    const board = emptyBoard()
    board[1][1].value = 5
    expect(isMoveValid(board, 0, 0, 5)).toBe(false)
  })
})

// ─── Tests: isBoardSolved ─────────────────────────────────────────────────────

describe('isBoardSolved', () => {
  it('devuelve true para un tablero completamente correcto', () => {
    expect(isBoardSolved(solvedBoard())).toBe(true)
  })

  it('devuelve false si quedan celdas vacías', () => {
    const board = solvedBoard()
    board[8][8].value = null
    expect(isBoardSolved(board)).toBe(false)
  })

  it('devuelve false si alguna celda tiene isError=true', () => {
    const board = solvedBoard()
    board[0][0].isError = true
    expect(isBoardSolved(board)).toBe(false)
  })
})
