import type { FC } from 'react';
import { Link } from 'react-router-dom';
import './SudokuPreviewCard.css';
import type { Difficulty } from '../../domain/types';

type Grid = (number | null)[][];

interface Props {
  title: string;
  difficulty: Difficulty;
  grid: Grid;
}

export const SudokuPreviewCard: FC<Props> = ({ title, difficulty, grid }) => {
  const difficultyMap = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
  };

  return (
    <Link to={`/game/${difficulty}`} className="sudoku-preview-card-link">
      <div className="sudoku-preview-card">
        <div className="sudoku-grid-preview">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="sudoku-cell-preview">
                {cell !== 0 && cell}
              </div>
            ))
          )}
        </div>
        <div className="card-content">
          <h3>{title}</h3>
          <span className={`difficulty-badge difficulty-${difficulty}`}>
            {difficultyMap[difficulty]}
          </span>
        </div>
      </div>
    </Link>
  );
};
