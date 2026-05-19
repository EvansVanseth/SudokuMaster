import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Board, Difficulty } from '../../../domain/types';
import * as sudokuEngine from '../../../domain/sudokuEngine';
import * as validator from '../../../domain/validator';
import { saveGameStateToSupabase } from '../services/gamePersistence';

const SESSION_KEY = 'sudoku_master_game_state';

export type PersistedGameState = {
  board: Board;
  initialBoard: Board;
  selectedCell: { row: number; col: number } | null;
  status: 'playing' | 'paused' | 'solved' | 'initial';
  timer: number;
  difficulty: Difficulty | null;
  savedGameId?: string;
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
  savedGameId?: string;
  isConfirmingExit: boolean;
  startGame: (difficulty: Difficulty) => void;
  selectCell: (row: number, col: number) => void;
  moveSelection: (direction: 'up' | 'down' | 'left' | 'right') => void;
  enterNumber: (value: number) => void;
  deleteNumber: () => void;
  tickTimer: () => void;
  togglePause: () => void;
  toggleConfirmExit: (userId?: string, onAfter?: () => void) => Promise<void> | void;
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
      savedGameId: initialSessionState?.savedGameId,
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
          savedGameId: undefined,
        };

        set(nextState);
        saveSessionState(nextState);
      },
      selectCell: (row, col) => {
        set((state) => {
          const nextState: PersistedGameState = {
            board: state.board,
            initialBoard: state.initialBoard,
            selectedCell: { row, col },
            status: state.status,
            timer: state.timer,
            difficulty: state.difficulty,
            savedGameId: state.savedGameId,
          };
          saveSessionState(nextState);
          return { selectedCell: { row, col } };
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
          const nextRow = current.row + step.row;
          const nextCol = current.col + step.col;

          // Clamp within board boundaries
          if (nextRow < 0 || nextRow > 8 || nextCol < 0 || nextCol > 8) {
            return { selectedCell: state.selectedCell };
          }

          const nextState: PersistedGameState = {
            board: state.board,
            initialBoard: state.initialBoard,
            selectedCell: { row: nextRow, col: nextCol },
            status: state.status,
            timer: state.timer,
            difficulty: state.difficulty,
            savedGameId: state.savedGameId,
          };
          saveSessionState(nextState);
          return { selectedCell: { row: nextRow, col: nextCol } };
        });
      },
      enterNumber: (value) => {
        set((state) => {
          if (!state.selectedCell) return state;
          if (state.board[state.selectedCell.row][state.selectedCell.col].isClue) return state;

          const { row, col } = state.selectedCell;
          const newBoard = JSON.parse(JSON.stringify(state.board));
          newBoard[row][col].value = value;
          const updatedBoard = validator.validateBoard(newBoard);
          const isSolved = validator.isBoardSolved(updatedBoard);
          const nextState: PersistedGameState = {
            board: updatedBoard,
            initialBoard: state.initialBoard,
            selectedCell: state.selectedCell,
            status: isSolved ? 'solved' : state.status,
            timer: state.timer,
            difficulty: state.difficulty,
            savedGameId: state.savedGameId,
          };

          saveSessionState(nextState);
          return isSolved ? { board: updatedBoard, status: 'solved' } : { board: updatedBoard };
        });
      },
      deleteNumber: () => {
        set((state) => {
          if (!state.selectedCell) return state;
          if (state.board[state.selectedCell.row][state.selectedCell.col].isClue) return state;

          const { row, col } = state.selectedCell;
          const newBoard = JSON.parse(JSON.stringify(state.board));
          newBoard[row][col].value = null;
          const updatedBoard = validator.validateBoard(newBoard);
          const isSolved = validator.isBoardSolved(updatedBoard);
          const nextState: PersistedGameState = {
            board: updatedBoard,
            initialBoard: state.initialBoard,
            selectedCell: state.selectedCell,
            status: isSolved ? 'solved' : state.status,
            timer: state.timer,
            difficulty: state.difficulty,
            savedGameId: state.savedGameId,
          };
          saveSessionState(nextState);
          return isSolved ? { board: updatedBoard, status: 'solved' } : { board: updatedBoard };
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
            savedGameId: state.savedGameId,
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
            savedGameId: state.savedGameId,
          };
          saveSessionState(nextState);
          return { status: nextStatus };
        });
      },
      toggleConfirmExit: async (userId?: string, onAfter?: () => void) => {
        if (userId) {
          // Logged-in user: flush save remotely and call onAfter (navigation) when done
          const currentState = useGameStore.getState();
          if (currentState.status !== 'initial') {
            try {
              const { id, error } = await saveGameStateToSupabase(userId, currentState, currentState.savedGameId);
              if (error) console.warn('Error guardando partida al salir (store):', error.message);
              if (id && id !== currentState.savedGameId) {
                restoreSessionGameState({ ...currentState, savedGameId: id });
              }
            } catch (e) {
              console.warn('Error guardando partida al salir (store):', e);
            }
          }

          // Close any modal state and trigger callback
          set({ isConfirmingExit: false });
          if (onAfter) onAfter();
          return;
        }

        // Anonymous user: toggle confirmation modal
        set((state) => ({ isConfirmingExit: !state.isConfirmingExit }));
      },
    }),
    { name: 'SudokuGameStore' }
  )
);