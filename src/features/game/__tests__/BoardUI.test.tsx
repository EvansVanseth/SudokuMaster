import React from 'react';
import { render, screen } from '@testing-library/react';
import { BoardUI } from '../components/BoardUI';
import { PauseOverlay } from '../components/PauseOverlay';
import styles from '../components/BoardUI.module.css';
import { useGameStore } from '../store/gameStore';

const createEmptyBoard = () =>
  Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: null, isClue: false, isError: false }))
  );

const setGameState = (board: ReturnType<typeof createEmptyBoard>, status: 'playing' | 'paused' = 'playing') => {
  useGameStore.setState({
    board,
    initialBoard: board,
    selectedCell: null,
    status,
    timer: 0,
    difficulty: 'easy',
    isConfirmingExit: false,
  });
};

describe('BoardUI component', () => {
  it('renders clue and user numbers with distinct visual classes', () => {
    const board = createEmptyBoard();
    board[0][0] = { value: 1, isClue: true, isError: false };
    board[0][1] = { value: 2, isClue: false, isError: false };
    board[0][2] = { value: 3, isClue: false, isError: true };

    setGameState(board);
    render(<BoardUI />);

    const clueCell = screen.getByText('1');
    const userCell = screen.getByText('2');
    const errorCell = screen.getByText('3');

    expect(clueCell).toHaveClass(styles.isClue);
    expect(userCell).toHaveClass(styles.notClue);
    expect(errorCell).toHaveClass(styles.isError);
  });

  it('shows the pause overlay when the game is paused', () => {
    const board = createEmptyBoard();
    board[0][0] = { value: 1, isClue: true, isError: false };

    setGameState(board, 'paused');
    render(<BoardUI />);

    expect(screen.getByText('Pausado')).toBeInTheDocument();
  });
});

describe('PauseOverlay component', () => {
  it('renders the paused label', () => {
    render(<PauseOverlay />);

    expect(screen.getByText('Pausado')).toBeInTheDocument();
  });
});
