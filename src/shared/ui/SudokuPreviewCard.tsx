import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './SudokuPreviewCard.module.css';
import type { Difficulty } from '../../domain/types';

type Grid = (number | null)[][];

const badgeClass: Record<Difficulty, string> = {
  easy: styles.badgeEasy,
  medium: styles.badgeMedium,
  hard: styles.badgeHard,
};

interface Props {
  title: string;
  difficulty: Difficulty;
  grid: Grid;
  onPreviewSelect?: () => void;
}

export const SudokuPreviewCard: FC<Props> = ({ title, difficulty, grid, onPreviewSelect }) => {
  const difficultyLabel: Record<Difficulty, string> = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
  };

  return (
    <Link to={`/game/${difficulty}`} className={styles.link} onClick={onPreviewSelect}>
      <div className={styles.card}>
        <div className={styles.grid}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className={styles.cell}>
                {cell !== 0 && cell}
              </div>
            ))
          )}
        </div>
        <div className={styles.cardContent}>
          <h3>{title}</h3>
          <span className={`${styles.badge} ${badgeClass[difficulty]}`}>
            {difficultyLabel[difficulty]}
          </span>
        </div>
      </div>
    </Link>
  );
};
