import { describe, it, expect } from 'vitest';
import { getExhaustedNumbers } from '../selectors';
import type { Cell } from '../../../domain/types';

const createBoard = (cells: { row: number; col: number; value: number | null }[]): Cell[][] => {
  const board: Cell[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: null, isClue: false, isError: false }))
  );
  for (const cell of cells) {
    board[cell.row][cell.col] = { value: cell.value, isClue: false, isError: false };
  }
  return board;
};

describe('getExhaustedNumbers', () => {
  it('returns empty set for an empty board', () => {
    const result = getExhaustedNumbers([]);
    expect(result.size).toBe(0);
  });

  it('returns empty set when no numbers are exhausted', () => {
    // Place 8 of number 1, 3 of number 2 — nothing hits 9
    const cells = [
      ...Array.from({ length: 8 }, (_, i) => ({ row: 0, col: i, value: 1 as number | null })),
      ...Array.from({ length: 3 }, (_, i) => ({ row: 1, col: i, value: 2 as number | null })),
    ];
    const board = createBoard(cells);
    const result = getExhaustedNumbers(board);
    expect(result.size).toBe(0);
  });

  it('exhausts a number when all 9 instances are on the board', () => {
    // Fill entire first row with 1s
    const cells = Array.from({ length: 9 }, (_, i) => ({ row: 0, col: i, value: 1 as number | null }));
    const board = createBoard(cells);
    const result = getExhaustedNumbers(board);
    expect(result.has(1)).toBe(true);
    expect(result.size).toBe(1);
  });

  it('does not exhaust a number when only 8 instances are on the board', () => {
    // Fill first 8 cells of row 0 with 1s
    const cells = Array.from({ length: 8 }, (_, i) => ({ row: 0, col: i, value: 1 as number | null }));
    const board = createBoard(cells);
    const result = getExhaustedNumbers(board);
    expect(result.has(1)).toBe(false);
    expect(result.size).toBe(0);
  });

  it('exhausts multiple numbers simultaneously', () => {
    // Row 0: 9 cells of 1, Row 1: 9 cells of 2, Row 2: 7 cells of 3
    const cells = [
      ...Array.from({ length: 9 }, (_, i) => ({ row: 0, col: i, value: 1 as number | null })),
      ...Array.from({ length: 9 }, (_, i) => ({ row: 1, col: i, value: 2 as number | null })),
      ...Array.from({ length: 7 }, (_, i) => ({ row: 2, col: i, value: 3 as number | null })),
    ];
    const board = createBoard(cells);
    const result = getExhaustedNumbers(board);
    expect(result.has(1)).toBe(true);
    expect(result.has(2)).toBe(true);
    expect(result.has(3)).toBe(false);
    expect(result.size).toBe(2);
  });

  it('counts both clue and non-clue cells toward exhaustion', () => {
    // Fill row 0 with 9 cells of value 1, mixing clue and non-clue
    const board: Cell[][] = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => ({ value: null, isClue: false, isError: false }))
    );
    // 5 clue cells + 4 non-clue cells = 9 total
    for (let i = 0; i < 5; i++) {
      board[0][i] = { value: 1, isClue: true, isError: false };
    }
    for (let i = 5; i < 9; i++) {
      board[0][i] = { value: 1, isClue: false, isError: false };
    }
    const result = getExhaustedNumbers(board);
    expect(result.has(1)).toBe(true);
    expect(result.size).toBe(1);
  });
});
