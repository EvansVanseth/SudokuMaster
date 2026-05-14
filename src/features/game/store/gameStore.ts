import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Board, Difficulty } from '../../../domain/types';
import * as sudokuEngine from '../../../domain/sudokuEngine';
import * as validator from '../../../domain/validator';

const SESSION_KEY = 'sudoku_master_game_state';

export type PersistedGameState = {
  board: Board;
  initialBoard: Board;
  selectedCell: { row: number; col: number } | null;
  status: 'playing' | 'paused' | 'solved' | 'initial';
  timer: number;
  difficulty: Difficulty | null;
};

const loadSessionState = (): PersistedGameState | null => {
  if (typeof window === 'undefined') return null;

  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PersistedGameState;
    if (
      !parsed ||
      !Array.isArray(parsed.board) ||
      !Array.isArray(parsed.initialBoard) ||
      typeof parsed.timer !== 'number' ||
      typeof parsed.status !== 'string'
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const saveSessionState = (state: PersistedGameState) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
};

export const restoreSessionGameState = (state: PersistedGameState) => {
  saveSessionState(state);
  useGameStore.setState(state);
};

interface GameState {
  board: Board;
  initialBoard: Board;
  selectedCell: { row: number; col: number } | null;
  status: 'playing' | 'paused' | 'solved' | 'initial';
  timer: number;
  difficulty: Difficulty | null;
  isConfirmingExit: boolean;
  startGame: (difficulty: Difficulty) => void;
  selectCell: (row: number, col: number) => void;
  moveSelection: (direction: 'up' | 'down' | 'left' | 'right') => void;
  enterNumber: (value: number) => void;
  deleteNumber: () => void;
  tickTimer: () => void;
  togglePause: () => void;
  toggleConfirmExit: () => void;
}

const initialSessionState = loadSessionState();

export const useGameStore = create<GameState>()(
  devtools(
    (set) => ({
      board: initialSessionState?.board ?? [],
      initialBoard: initialSessionState?.initialBoard ?? [],
      selectedCell: initialSessionState?.selectedCell ?? null,
      status: initialSessionState?.status ?? 'initial',
      timer: initialSessionState?.timer ?? 0,
      difficulty: initialSessionState?.difficulty ?? null,
      isConfirmingExit: false,
      startGame: (difficulty) => {
        const newBoard = sudokuEngine.generateSudoku(difficulty);
        const nextState: PersistedGameState = {
          board: newBoard,
          initialBoard: JSON.parse(JSON.stringify(newBoard)), // Deep copy
          selectedCell: null,
          status: 'playing',
          timer: 0,
          difficulty,
        };

        set(nextState);
        saveSessionState(nextState);
      },
      selectCell: (row, col) => {
        set((state) => {
          const nextSelection = state.board[row][col].isClue ? null : { row, col };
          const nextState: PersistedGameState = {
            board: state.board,
            initialBoard: state.initialBoard,
            selectedCell: nextSelection,
            status: state.status,
            timer: state.timer,
            difficulty: state.difficulty,
          };
          saveSessionState(nextState);
          return { selectedCell: nextSelection };
        });
      },
      moveSelection: (direction) => {
        set((state) => {
          const step = {
            up: { row: -1, col: 0 },
            down: { row: 1, col: 0 },
            left: { row: 0, col: -1 },
            right: { row: 0, col: 1 },
          }[direction];

          const current = state.selectedCell ?? { row: 0, col: 0 };
          let nextRow = current.row + step.row;
          let nextCol = current.col + step.col;

          const isValid = (row: number, col: number) => row >= 0 && row < 9 && col >= 0 && col < 9;

          while (isValid(nextRow, nextCol)) {
            if (!state.board[nextRow][nextCol].isClue) {
              const nextState: PersistedGameState = {
                board: state.board,
                initialBoard: state.initialBoard,
                selectedCell: { row: nextRow, col: nextCol },
                status: state.status,
                timer: state.timer,
                difficulty: state.difficulty,
              };
              saveSessionState(nextState);
              return { selectedCell: { row: nextRow, col: nextCol } };
            }
            nextRow += step.row;
            nextCol += step.col;
          }

          return { selectedCell: state.selectedCell };
        });
      },
      enterNumber: (value) => {
        set((state) => {
          if (!state.selectedCell) return state;

          const { row, col } = state.selectedCell;
          const newBoard = JSON.parse(JSON.stringify(state.board));
          newBoard[row][col].value = value;
          const updatedBoard = validator.validateBoard(newBoard);
          const nextState: PersistedGameState = {
            board: updatedBoard,
            initialBoard: state.initialBoard,
            selectedCell: state.selectedCell,
            status: state.status,
            timer: state.timer,
            difficulty: state.difficulty,
          };
          saveSessionState(nextState);
          return { board: updatedBoard };
        });
      },
      deleteNumber: () => {
        set((state) => {
          if (!state.selectedCell) return state;

          const { row, col } = state.selectedCell;
          const newBoard = JSON.parse(JSON.stringify(state.board));
          newBoard[row][col].value = null;
          const updatedBoard = validator.validateBoard(newBoard);
          const nextState: PersistedGameState = {
            board: updatedBoard,
            initialBoard: state.initialBoard,
            selectedCell: state.selectedCell,
            status: state.status,
            timer: state.timer,
            difficulty: state.difficulty,
          };
          saveSessionState(nextState);
          return { board: updatedBoard };
        });
      },
      tickTimer: () => {
        set((state) => {
          const nextState: PersistedGameState = {
            board: state.board,
            initialBoard: state.initialBoard,
            selectedCell: state.selectedCell,
            status: state.status,
            timer: state.timer + 1,
            difficulty: state.difficulty,
          };
          saveSessionState(nextState);
          return { timer: state.timer + 1 };
        });
      },
      togglePause: () => {
        set((state) => {
          const nextStatus = state.status === 'playing' ? 'paused' : 'playing';
          const nextState: PersistedGameState = {
            board: state.board,
            initialBoard: state.initialBoard,
            selectedCell: state.selectedCell,
            status: nextStatus,
            timer: state.timer,
            difficulty: state.difficulty,
          };
          saveSessionState(nextState);
          return { status: nextStatus };
        });
      },
      toggleConfirmExit: () => {
        set((state) => ({ isConfirmingExit: !state.isConfirmingExit }));
      },
    }),
    { name: 'SudokuGameStore' }
  )
);