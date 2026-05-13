import React from 'react';
import { useGameStore } from '../store/gameStore';
import styles from './Numpad.module.css';

export const Numpad: React.FC = () => {
  const enterNumber = useGameStore((state) => state.enterNumber);
  const deleteNumber = useGameStore((state) => state.deleteNumber);

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className={styles.numpad}>
      <div className={styles.grid}>
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => enterNumber(num)}
            className={styles.button}
          >
            {num}
          </button>
        ))}
        <button
          onClick={deleteNumber}
          className={`${styles.button} ${styles.deleteButton}`}
        >
          Borrar
        </button>
      </div>
    </div>
  );
};
