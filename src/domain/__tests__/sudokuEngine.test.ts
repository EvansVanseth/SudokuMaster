// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'
import { generatePuzzle, generateSolvedGrid, solveBoard, createBoardFromGrid } from '../sudokuEngine'
import type { Difficulty, Grid } from '../types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidSolvedGrid(grid: Grid): boolean {
  const set = new Set<number>()
  for (let r = 0; r < 9; r++) {
    set.clear()
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c]
      if (v < 1 || v > 9 || set.has(v)) return false
      set.add(v)
    }
  }
  for (let c = 0; c < 9; c++) {
    set.clear()
    for (let r = 0; r < 9; r++) {
      const v = grid[r][c]
      if (set.has(v)) return false
      set.add(v)
    }
  }
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      set.clear()
      for (let r = br * 3; r < br * 3 + 3; r++) {
        for (let c = bc * 3; c < bc * 3 + 3; c++) {
          const v = grid[r][c]
          if (set.has(v)) return false
          set.add(v)
        }
      }
    }
  }
  return true
}

// ─── Tests: generateSolvedGrid ────────────────────────────────────────────────

describe('generateSolvedGrid', () => {
  it('genera una grid válida y completa', () => {
    const grid = generateSolvedGrid()
    expect(grid).toHaveLength(9)
    expect(grid.flat().every(v => v !== 0)).toBe(true)
    expect(isValidSolvedGrid(grid)).toBe(true)
  })

  it('produce tableros aleatorios', () => {
    const g1 = generateSolvedGrid()
    const g2 = generateSolvedGrid()
    expect(g1.flat().join('')).not.toBe(g2.flat().join(''))
  })
})

// ─── Tests: solveBoard ────────────────────────────────────────────────────────

describe('solveBoard', () => {
  it('resuelve un tablero conocido', () => {
    const grid: Grid = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ]
    const result = solveBoard(grid)
    expect(result).toBe(true)
    expect(isValidSolvedGrid(grid)).toBe(true)
  })

  it('devuelve false para tableros imposibles o inconsistentes', () => {
    const grid: Grid = Array.from({ length: 9 }, () => Array(9).fill(0))
    grid[0][0] = 1
    grid[0][1] = 1
    expect(solveBoard(grid)).toBe(false)
  })
})

// ─── Tests: generatePuzzle ────────────────────────────────────────────────────

const CLUE_RANGES: Record<Difficulty, [number, number]> = {
  easy:   [40, 50],
  medium: [30, 40],
  hard:   [25, 35],
}

describe.each<Difficulty>(['easy', 'medium', 'hard'])('generatePuzzle(%s)', (difficulty) => {
  let board: ReturnType<typeof generatePuzzle>
  beforeAll(() => { board = generatePuzzle(difficulty) }, 60_000)

  it('genera un Board 9x9 con pistas en rango', () => {
    expect(board).toHaveLength(9)
    const clueCount = board.flat().filter(cell => cell.isClue).length
    const [min, max] = CLUE_RANGES[difficulty]
    expect(clueCount).toBeGreaterThanOrEqual(min)
    expect(clueCount).toBeLessThanOrEqual(max)
  })

  it('no tiene errores al inicio', () => {
    expect(board.flat().every(cell => !cell.isError)).toBe(true)
  })
})

// ─── Tests: createBoardFromGrid ───────────────────────────────────────────────

describe('createBoardFromGrid', () => {
  it('importa una grid correctamente', () => {
    const grid: Grid = Array.from({ length: 9 }, () => Array(9).fill(0))
    grid[0][0] = 5
    const board = createBoardFromGrid(grid)
    expect(board[0][0].value).toBe(5)
    expect(board[0][0].isClue).toBe(true)
    expect(board[1][1].value).toBeNull()
    expect(board[1][1].isClue).toBe(false)
  })
})
