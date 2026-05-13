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