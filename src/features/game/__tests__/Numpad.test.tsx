import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Numpad } from '../components/Numpad';
import { useGameStore } from '../store/gameStore';
import type { Cell } from '../../../domain/types';

const createBoard = (cells: { row: number; col: number; value: number | null; isClue?: boolean }[]): Cell[][] => {
  const board: Cell[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: null, isClue: false, isError: false }))
  );
  for (const cell of cells) {
    board[cell.row][cell.col] = { value: cell.value, isClue: cell.isClue ?? false, isError: false };
  }
  return board;
};

describe('Numpad component', () => {
  beforeEach(() => {
    // Reset to a clean empty board before each test
    const emptyBoard = createBoard([]);
    useGameStore.setState({
      board: emptyBoard,
      initialBoard: emptyBoard,
      selectedCell: null,
      status: 'playing',
      timer: 0,
      difficulty: 'easy',
      isConfirmingExit: false,
    });
  });

  it('disables button for an exhausted number', () => {
    // Fill entire row 0 with 1s — number 1 is exhausted
    const cells = Array.from({ length: 9 }, (_, i) => ({ row: 0, col: i, value: 1 as number | null }));
    const board = createBoard(cells);
    useGameStore.setState({ board });

    render(<Numpad />);

    const button1 = screen.getByRole('button', { name: '1' });
    expect(button1).toBeDisabled();
  });

  it('keeps button enabled for a non-exhausted number', () => {
    // Place only 8 of number 1
    const cells = Array.from({ length: 8 }, (_, i) => ({ row: 0, col: i, value: 1 as number | null }));
    const board = createBoard(cells);
    useGameStore.setState({ board });

    render(<Numpad />);

    const button1 = screen.getByRole('button', { name: '1' });
    expect(button1).not.toBeDisabled();
  });

  it('re-enables a previously exhausted button after count drops below 9', () => {
    // Start with 9 of number 1 (exhausted)
    const cells = Array.from({ length: 9 }, (_, i) => ({ row: 0, col: i, value: 1 as number | null }));
    const board = createBoard(cells);
    useGameStore.setState({ board });

    const { rerender } = render(<Numpad />);

    // Confirm exhausted
    const button1 = screen.getByRole('button', { name: '1' });
    expect(button1).toBeDisabled();

    // Now remove one — count drops to 8 (use a new board reference, as the store does)
    const updatedBoard = JSON.parse(JSON.stringify(board)) as Cell[][];
    updatedBoard[0][0] = { value: null, isClue: false, isError: false };
    act(() => { useGameStore.setState({ board: updatedBoard }); });

    rerender(<Numpad />);

    const button1After = screen.getByRole('button', { name: '1' });
    expect(button1After).not.toBeDisabled();
  });

  it('does not disable Borrar button due to exhaustion', () => {
    // All numbers exhausted
    const cells: { row: number; col: number; value: number | null }[] = [];
    // 9 of each number 1-9 = 81 cells
    for (let n = 1; n <= 9; n++) {
      for (let i = 0; i < 9; i++) {
        cells.push({ row: n - 1, col: i, value: n as number | null });
      }
    }
    const board = createBoard(cells);
    useGameStore.setState({ board, status: 'playing' });

    render(<Numpad />);

    const borrarButton = screen.getByRole('button', { name: 'Borrar' });
    expect(borrarButton).not.toBeDisabled();
  });

  it('resets exhaustion on new game', () => {
    // Start with exhausted board
    const cells = Array.from({ length: 9 }, (_, i) => ({ row: 0, col: i, value: 1 as number | null }));
    let board = createBoard(cells);
    useGameStore.setState({ board });

    const { rerender } = render(<Numpad />);

    // Confirm exhausted
    const button1 = screen.getByRole('button', { name: '1' });
    expect(button1).toBeDisabled();

    // Simulate new game: fresh empty board
    board = createBoard([]);
    act(() => { useGameStore.setState({ board }); });

    rerender(<Numpad />);

    const button1After = screen.getByRole('button', { name: '1' });
    expect(button1After).not.toBeDisabled();
  });

  it('disables all buttons when a clue cell is selected', () => {
    const board = createBoard([
      { row: 0, col: 0, value: 1, isClue: true },
      { row: 0, col: 1, value: 2, isClue: false },
    ]);
    useGameStore.setState({ board, selectedCell: { row: 0, col: 0 } });

    render(<Numpad />);

    // All number buttons should be disabled
    for (let n = 1; n <= 9; n++) {
      const button = screen.getByRole('button', { name: String(n) });
      expect(button).toBeDisabled();
    }

    const borrarButton = screen.getByRole('button', { name: 'Borrar' });
    expect(borrarButton).toBeDisabled();
  });

  it('enables buttons when selected cell is not a clue', () => {
    const board = createBoard([
      { row: 0, col: 0, value: 1, isClue: true },
      { row: 0, col: 1, value: 2, isClue: false },
    ]);
    useGameStore.setState({ board, selectedCell: { row: 0, col: 1 } });

    render(<Numpad />);

    // Number 2's cell is selected but not a clue — buttons should be enabled
    for (let n = 1; n <= 9; n++) {
      const button = screen.getByRole('button', { name: String(n) });
      expect(button).not.toBeDisabled();
    }

    const borrarButton = screen.getByRole('button', { name: 'Borrar' });
    expect(borrarButton).not.toBeDisabled();
  });

  it('disables all buttons when game is solved', () => {
    const cells = Array.from({ length: 9 }, (_, i) => ({ row: 0, col: i, value: 1 as number | null }));
    const board = createBoard(cells);
    useGameStore.setState({ board, status: 'solved' });

    render(<Numpad />);

    // All number buttons should be disabled
    for (let n = 1; n <= 9; n++) {
      const button = screen.getByRole('button', { name: String(n) });
      expect(button).toBeDisabled();
    }

    // Borrar also disabled in solved state
    const borrarButton = screen.getByRole('button', { name: 'Borrar' });
    expect(borrarButton).toBeDisabled();
  });
});
