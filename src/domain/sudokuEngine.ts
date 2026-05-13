import type { Board, Cell, Difficulty, Grid } from './types'

// ─── Configuración ────────────────────────────────────────────────────────────

const CELLS_TO_REMOVE: Record<Difficulty, number> = {
  easy:   36,
  medium: 46,
  hard:   52,
}

const UNIQUENESS_NODE_LIMIT = 2000

// ─── Utilidades ───────────────────────────────────────────────────────────────

function createEmptyGrid(): Grid {
  return Array.from({ length: 9 }, () => Array(9).fill(0))
}

function cloneGrid(grid: Grid): Grid {
  return grid.map(row => [...row])
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Cuenta bits encendidos en un número (popcount). */
function countSetBits(n: number): number {
  let count = 0
  for (let i = 1; i <= 9; i++) {
    if (n & (1 << i)) count++
  }
  return count
}

// ─── Bitmask helpers ──────────────────────────────────────────────────────────

function buildConstraints(grid: Grid): { rows: number[]; cols: number[]; boxes: number[] } | null {
  const rows  = Array(9).fill(0)
  const cols  = Array(9).fill(0)
  const boxes = Array(9).fill(0)

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c]
      if (v !== 0) {
        const bit = 1 << v
        const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3)
        if ((rows[r] & bit) || (cols[c] & bit) || (boxes[boxIdx] & bit)) {
          return null // Board is already invalid
        }
        rows[r]  |= bit
        cols[c]  |= bit
        boxes[boxIdx] |= bit
      }
    }
  }
  return { rows, cols, boxes }
}

function getFreeMask(constraints: { rows: number[]; cols: number[]; boxes: number[] }, r: number, c: number): number {
  const used = constraints.rows[r] | constraints.cols[c] | constraints.boxes[Math.floor(r / 3) * 3 + Math.floor(c / 3)]
  return (~used) & 0x3FE
}

function maskToCandidates(mask: number): number[] {
  const result: number[] = []
  for (let d = 1; d <= 9; d++) {
    if (mask & (1 << d)) result.push(d)
  }
  return result
}

// ─── Solver con bitmask + MRV ─────────────────────────────────────────────────

function solveFast(
  grid: Grid,
  constraints: { rows: number[]; cols: number[]; boxes: number[] },
  random = false,
): boolean {
  let bestR = -1, bestC = -1, bestMask = 0, bestCount = 10

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== 0) continue
      const mask = getFreeMask(constraints, r, c)
      const popcount = countSetBits(mask)
      if (popcount === 0) return false
      if (popcount < bestCount) {
        bestCount = popcount
        bestR = r; bestC = c; bestMask = mask
        if (bestCount === 1) break
      }
    }
    if (bestCount === 1) break
  }

  if (bestR === -1) return true

  const candidates = maskToCandidates(bestMask)
  if (random) shuffle(candidates)

  const boxIdx = Math.floor(bestR / 3) * 3 + Math.floor(bestC / 3)

  for (const num of candidates) {
    const bit = 1 << num
    grid[bestR][bestC] = num
    constraints.rows[bestR]  |= bit
    constraints.cols[bestC]  |= bit
    constraints.boxes[boxIdx] |= bit

    if (solveFast(grid, constraints, random)) return true

    grid[bestR][bestC] = 0
    constraints.rows[bestR]  &= ~bit
    constraints.cols[bestC]  &= ~bit
    constraints.boxes[boxIdx] &= ~bit
  }
  return false
}

export function solveBoard(grid: Grid, random = false): boolean {
  const constraints = buildConstraints(grid)
  if (!constraints) return false
  return solveFast(grid, constraints, random)
}

// ─── Contador de soluciones con bitmask y límite de nodos ────────────────────

function countSolutions(
  grid: Grid,
  constraints: { rows: number[]; cols: number[]; boxes: number[] },
  state: { nodes: number; solutions: number },
  limit = 2,
): void {
  if (state.solutions >= limit || state.nodes >= UNIQUENESS_NODE_LIMIT) return

  let bestR = -1, bestC = -1, bestMask = 0, bestCount = 10

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== 0) continue
      const mask = getFreeMask(constraints, r, c)
      const popcount = countSetBits(mask)
      if (popcount === 0) return
      if (popcount < bestCount) {
        bestCount = popcount; bestR = r; bestC = c; bestMask = mask
        if (bestCount === 1) break
      }
    }
    if (bestCount === 1) break
  }

  if (bestR === -1) {
    state.solutions++
    return
  }

  const candidates = maskToCandidates(bestMask)
  const boxIdx = Math.floor(bestR / 3) * 3 + Math.floor(bestC / 3)

  for (const num of candidates) {
    state.nodes++
    if (state.nodes >= UNIQUENESS_NODE_LIMIT) return

    const bit = 1 << num
    grid[bestR][bestC] = num
    constraints.rows[bestR]  |= bit
    constraints.cols[bestC]  |= bit
    constraints.boxes[boxIdx] |= bit

    countSolutions(grid, constraints, state, limit)

    grid[bestR][bestC] = 0
    constraints.rows[bestR]  &= ~bit
    constraints.cols[bestC]  &= ~bit
    constraints.boxes[boxIdx] &= ~bit

    if (state.solutions >= limit) return
  }
}

function hasUniqueSolution(grid: Grid): boolean {
  const copy = cloneGrid(grid)
  const constraints = buildConstraints(copy)
  if (!constraints) return false
  const state = { nodes: 0, solutions: 0 }
  countSolutions(copy, constraints, state, 2)
  return state.solutions === 1 || (state.solutions === 0 && state.nodes >= UNIQUENESS_NODE_LIMIT)
}

// ─── Generación ───────────────────────────────────────────────────────────────

export function generateSolvedGrid(): Grid {
  const grid = createEmptyGrid()
  solveBoard(grid, true)
  return grid
}

function generatePuzzleGrid(difficulty: Difficulty): Grid {
  const solved = generateSolvedGrid()
  const puzzle = cloneGrid(solved)

  const pairs: Array<[[number, number], [number, number] | null]> = []
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const r2 = 8 - r, c2 = 8 - c
      if (r * 9 + c < r2 * 9 + c2) pairs.push([[r, c], [r2, c2]])
    }
  }
  pairs.push([[4, 4], null])
  shuffle(pairs)

  let removed = 0
  const target = CELLS_TO_REMOVE[difficulty]

  for (const [pos1, pos2] of pairs) {
    if (removed >= target) break

    const [r1, c1] = pos1
    const backup1 = puzzle[r1][c1]
    puzzle[r1][c1] = 0

    const canRemoveSecond = pos2 !== null && removed + 1 < target
    let backup2 = 0, r2 = 0, c2 = 0
    if (canRemoveSecond) {
      ;[r2, c2] = pos2!
      backup2 = puzzle[r2][c2]
      puzzle[r2][c2] = 0
    }

    if (hasUniqueSolution(puzzle)) {
      removed += canRemoveSecond ? 2 : 1
    } else {
      puzzle[r1][c1] = backup1
      if (canRemoveSecond) puzzle[r2][c2] = backup2
    }
  }

  return puzzle
}

// ─── API pública ──────────────────────────────────────────────────────────────

export function generateSudoku(difficulty: Difficulty): Board {
  const grid = generatePuzzleGrid(difficulty)
  return grid.map(row =>
    row.map((value): Cell => ({
      value: value === 0 ? null : value,
      isClue: value !== 0,
      isError: false,
    }))
  )
}

export function createBoardFromGrid(grid: Grid): Board {
  return grid.map(row =>
    row.map((value): Cell => ({
      value: value === 0 ? null : value,
      isClue: value !== 0,
      isError: false,
    }))
  )
}
