import React, { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { getExhaustedNumbers } from '../selectors';
import styles from './Numpad.module.css';

export const Numpad: React.FC = () => {
  const board = useGameStore((state) => state.board);
  const selectedCell = useGameStore((state) => state.selectedCell);
  const enterNumber = useGameStore((state) => state.enterNumber);
  const deleteNumber = useGameStore((state) => state.deleteNumber);
  const status = useGameStore((state) => state.status);

  const exhaustedNumbers = useMemo(() => getExhaustedNumbers(board), [board]);

  const isClueSelected =
    selectedCell !== null && board[selectedCell.row][selectedCell.col].isClue;

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className={styles.numpad}>
      <div className={styles.grid}>
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => enterNumber(num)}
            className={styles.button}
            disabled={status === 'solved' || isClueSelected || exhaustedNumbers.has(num)}
          >
            {num}
          </button>
        ))}
        <button
          onClick={deleteNumber}
          className={`${styles.button} ${styles.deleteButton}`}
          disabled={status === 'solved' || isClueSelected}
        >
          Borrar
        </button>
      </div>
    </div>
  );
};
