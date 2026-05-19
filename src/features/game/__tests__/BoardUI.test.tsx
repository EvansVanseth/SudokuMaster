import { render, screen, fireEvent } from '@testing-library/react';
import { BoardUI } from '../components/BoardUI';
import { PauseOverlay } from '../components/PauseOverlay';
import styles from '../components/BoardUI.module.css';
import { useGameStore } from '../store/gameStore';
import type { Cell } from '../../../domain/types';

const createEmptyBoard = (): Cell[][] =>
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

describe('same-value highlight', () => {
  it('renders same-value glow on matching non-selected cells', () => {
    const board = createEmptyBoard();
    board[0][0] = { value: 1, isClue: false, isError: false };
    board[0][1] = { value: 1, isClue: false, isError: false };
    board[0][2] = { value: 3, isClue: false, isError: false };

    setGameState(board);
    useGameStore.setState({ selectedCell: { row: 0, col: 0 } });
    render(<BoardUI />);

    const valueOneCells = screen.getAllByText('1');
    expect(valueOneCells).toHaveLength(2);

    // First cell in document order is [0][0] (selected), second is [0][1] (matching)
    expect(valueOneCells[0]).toHaveClass(styles.isSelected);
    expect(valueOneCells[0]).not.toHaveClass(styles.isSameValue);
    expect(valueOneCells[1]).toHaveClass(styles.isSameValue);

    // Cell with a different value should NOT have isSameValue
    const valueThreeCell = screen.getByText('3');
    expect(valueThreeCell).not.toHaveClass(styles.isSameValue);
  });

  it('does not render glow when selected cell is empty', () => {
    const board = createEmptyBoard();
    board[0][0] = { value: 5, isClue: false, isError: false };
    board[0][1] = { value: 5, isClue: false, isError: false };
    board[1][0] = { value: 5, isClue: false, isError: false };

    setGameState(board);
    // Select an empty cell (value: null)
    useGameStore.setState({ selectedCell: { row: 0, col: 2 } });
    render(<BoardUI />);

    const valueFiveCells = screen.getAllByText('5');
    expect(valueFiveCells).toHaveLength(3);
    valueFiveCells.forEach((cell) => {
      expect(cell).not.toHaveClass(styles.isSameValue);
    });
  });

  it('excludes the selected cell itself from glow', () => {
    const board = createEmptyBoard();
    board[0][0] = { value: 1, isClue: false, isError: false };
    board[0][1] = { value: 1, isClue: false, isError: false };
    board[1][0] = { value: 2, isClue: false, isError: false };

    setGameState(board);
    useGameStore.setState({ selectedCell: { row: 0, col: 0 } });
    render(<BoardUI />);

    const valueOneCells = screen.getAllByText('1');
    expect(valueOneCells).toHaveLength(2);

    // Selected cell [0][0] must NOT have isSameValue
    expect(valueOneCells[0]).not.toHaveClass(styles.isSameValue);
    // Non-selected matching cell [0][1] MUST have isSameValue
    expect(valueOneCells[1]).toHaveClass(styles.isSameValue);
  });

  it('triggers same-value highlight when clicking a clue cell', () => {
    const board = createEmptyBoard();
    board[0][0] = { value: 1, isClue: true, isError: false };
    board[0][1] = { value: 1, isClue: false, isError: false };
    board[0][2] = { value: 2, isClue: false, isError: false };

    setGameState(board);
    render(<BoardUI />);

    // Click the clue cell [0][0] (first one in document order)
    const allOnes = screen.getAllByText('1');
    expect(allOnes).toHaveLength(2);
    const clueCell = allOnes[0]; // [0][0] is the clue, comes first
    fireEvent.click(clueCell);

    // Clue cell is now selected
    expect(clueCell).toHaveClass(styles.isSelected);
    // Matching cell [0][1] should glow
    expect(allOnes[1]).toHaveClass(styles.isSameValue);
    // Different-value cell should NOT glow
    const valueTwo = screen.getByText('2');
    expect(valueTwo).not.toHaveClass(styles.isSameValue);
  });
});

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
