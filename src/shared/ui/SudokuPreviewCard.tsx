import type { FC } from 'react';
import './SudokuPreviewCard.css';

type Grid = (number | null)[][];

interface Props {
  title: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  grid: Grid;
}

export const SudokuPreviewCard: FC<Props> = ({ title, difficulty, grid }) => {
  return (
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
        <span className={`difficulty-badge difficulty-${difficulty.toLowerCase()}`}>{difficulty}</span>
      </div>
    </div>
  );
};
