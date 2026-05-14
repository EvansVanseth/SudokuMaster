import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Board, Difficulty } from '../../../domain/types';
import * as sudokuEngine from '../../../domain/sudokuEngine';
import * as validator from '../../../domain/validator';

interface GameState {
  board: Board;
  initialBoard: Board;
  selectedCell: { row: number; col: number } | null;
  status: 'playing' | 'paused' | 'solved' | 'initial';
  timer: number;
  isConfirmingExit: boolean;
  startGame: (difficulty: Difficulty) => void;
  selectCell: (row: number, col: number) => void;
  moveSelection: (direction: 'up' | 'down' | 'left' | 'right') => void;
  enterNumber: (value: number) => void;
  deleteNumber: () => void;
  togglePause: () => void;
  toggleConfirmExit: () => void;
}

export const useGameStore = create<GameState>()(
  devtools(
    (set, get) => ({
      board: [],
      initialBoard: [],
      selectedCell: null,
      status: 'initial',
      timer: 0,
      isConfirmingExit: false,
      startGame: (difficulty) => {
        const newBoard = sudokuEngine.generateSudoku(difficulty);
        set({
          board: newBoard,
          initialBoard: JSON.parse(JSON.stringify(newBoard)), // Deep copy
          status: 'playing',
          selectedCell: null,
          timer: 0,
        });
      },
      selectCell: (row, col) => {
        const { board } = get();
        if (board[row][col].isClue) {
          set({ selectedCell: null });
        } else {
          set({ selectedCell: { row, col } });
        }
      },
      moveSelection: (direction) => {
        const { board, selectedCell } = get();

        const step = {
          up: { row: -1, col: 0 },
          down: { row: 1, col: 0 },
          left: { row: 0, col: -1 },
          right: { row: 0, col: 1 },
        }[direction];

        const current = selectedCell ?? { row: 0, col: 0 };
        let nextRow = current.row + step.row;
        let nextCol = current.col + step.col;

        const isValid = (row: number, col: number) => row >= 0 && row < 9 && col >= 0 && col < 9;

        while (isValid(nextRow, nextCol)) {
          if (!board[nextRow][nextCol].isClue) {
            set({ selectedCell: { row: nextRow, col: nextCol } });
            return;
          }
          nextRow += step.row;
          nextCol += step.col;
        }
      },
      enterNumber: (value) => {
        const { selectedCell, board } = get();
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        const newBoard = JSON.parse(JSON.stringify(board)); // Deep copy
        newBoard[row][col].value = value;
        
        // Validate and update errors
        const updatedBoard = validator.validateBoard(newBoard);
        
        set({ board: updatedBoard });
      },
      deleteNumber: () => {
        const { selectedCell, board } = get();
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        const newBoard = JSON.parse(JSON.stringify(board));
        newBoard[row][col].value = null;

        // Re-validate after deletion
        const updatedBoard = validator.validateBoard(newBoard);

        set({ board: updatedBoard });
      },
      togglePause: () => {
        set((state) => ({
          status: state.status === 'playing' ? 'paused' : 'playing',
        }));
      },
      toggleConfirmExit: () => {
        set((state) => ({ isConfirmingExit: !state.isConfirmingExit }));
      },
    }),
    { name: 'SudokuGameStore' }
  )
);