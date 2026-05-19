import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../store/gameStore';
import type { Cell } from '../../../domain/types';

const createBoard = (cells: { row: number; col: number; value: number | null; isClue?: boolean }[]): Cell[][] => {
  const board: Cell[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: null, isClue: false, isError: false }))
  );
  for (const cell of cells) {
    board[cell.row][cell.col] = {
      value: cell.value,
      isClue: cell.isClue ?? false,
      isError: false,
    };
  }
  return board;
};

describe('selectCell', () => {
  beforeEach(() => {
    const board = createBoard([
      { row: 0, col: 0, value: 1, isClue: true },
      { row: 0, col: 1, value: null },
    ]);
    useGameStore.setState({
      board,
      initialBoard: board,
      selectedCell: null,
      status: 'playing',
      timer: 0,
      difficulty: 'easy',
      isConfirmingExit: false,
    });
  });

  it('selects a clue cell (does not set to null)', () => {
    useGameStore.getState().selectCell(0, 0);
    expect(useGameStore.getState().selectedCell).toEqual({ row: 0, col: 0 });
  });

  it('selects a non-clue cell as before', () => {
    useGameStore.getState().selectCell(0, 1);
    expect(useGameStore.getState().selectedCell).toEqual({ row: 0, col: 1 });
  });
});

describe('enterNumber guard', () => {
  beforeEach(() => {
    const board = createBoard([
      { row: 0, col: 0, value: 1, isClue: true },
      { row: 0, col: 1, value: null },
    ]);
    useGameStore.setState({
      board,
      initialBoard: board,
      selectedCell: null,
      status: 'playing',
      timer: 0,
      difficulty: 'easy',
      isConfirmingExit: false,
    });
  });

  it('does not modify a clue cell when enterNumber is called', () => {
    // Select the clue cell
    useGameStore.getState().selectCell(0, 0);
    expect(useGameStore.getState().selectedCell).toEqual({ row: 0, col: 0 });

    // Try to change its value
    useGameStore.getState().enterNumber(5);
    const cellAfter = useGameStore.getState().board[0][0];
    expect(cellAfter.value).toBe(1); // Unchanged
  });

  it('modifies a non-clue cell when enterNumber is called', () => {
    useGameStore.getState().selectCell(0, 1);
    useGameStore.getState().enterNumber(5);
    const cellAfter = useGameStore.getState().board[0][1];
    expect(cellAfter.value).toBe(5); // Changed
  });
});

describe('deleteNumber guard', () => {
  beforeEach(() => {
    const board = createBoard([
      { row: 0, col: 0, value: 1, isClue: true },
      { row: 0, col: 1, value: 5 },
    ]);
    useGameStore.setState({
      board,
      initialBoard: board,
      selectedCell: null,
      status: 'playing',
      timer: 0,
      difficulty: 'easy',
      isConfirmingExit: false,
    });
  });

  it('does not delete a clue cell value', () => {
    useGameStore.getState().selectCell(0, 0);
    useGameStore.getState().deleteNumber();
    const cellAfter = useGameStore.getState().board[0][0];
    expect(cellAfter.value).toBe(1); // Unchanged
  });

  it('deletes a non-clue cell value', () => {
    useGameStore.getState().selectCell(0, 1);
    useGameStore.getState().deleteNumber();
    const cellAfter = useGameStore.getState().board[0][1];
    expect(cellAfter.value).toBeNull(); // Deleted
  });
});

describe('moveSelection', () => {
  beforeEach(() => {
    const board: Cell[][] = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => ({ value: null, isClue: false, isError: false }))
    );
    // Mark some cells as clues
    for (let c = 0; c < 9; c++) {
      board[3][c] = { value: 1, isClue: true, isError: false };
    }
    useGameStore.setState({
      board,
      initialBoard: board,
      selectedCell: { row: 0, col: 0 },
      status: 'playing',
      timer: 0,
      difficulty: 'easy',
      isConfirmingExit: false,
    });
  });

  it('moves to the next cell regardless of clue status', () => {
    // Row 3 is all clues — moving into it should still work
    useGameStore.getState().moveSelection('down');
    expect(useGameStore.getState().selectedCell).toEqual({ row: 1, col: 0 });
    useGameStore.getState().moveSelection('down');
    expect(useGameStore.getState().selectedCell).toEqual({ row: 2, col: 0 });
    useGameStore.getState().moveSelection('down');
    // Row 3 is all clues — should still select it
    expect(useGameStore.getState().selectedCell).toEqual({ row: 3, col: 0 });
  });

  it('does not move beyond board edges', () => {
    useGameStore.getState().moveSelection('up');
    expect(useGameStore.getState().selectedCell).toEqual({ row: 0, col: 0 });

    useGameStore.getState().moveSelection('left');
    expect(useGameStore.getState().selectedCell).toEqual({ row: 0, col: 0 });
  });
});
