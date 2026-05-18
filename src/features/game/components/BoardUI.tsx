import React from 'react';
import { useGameStore } from '../store/gameStore';
import styles from './BoardUI.module.css';
import type { Cell } from '../../../domain/types';
import { PauseOverlay } from './PauseOverlay';

export const BoardUI: React.FC = () => {
  const board = useGameStore((state) => state.board);
  const selectedCell = useGameStore((state) => state.selectedCell);
  const selectCell = useGameStore((state) => state.selectCell);
  const status = useGameStore((state) => state.status);
  const difficulty = useGameStore((state) => state.difficulty);

  const handleCellClick = (row: number, col: number) => {
    selectCell(row, col);
  };

  if (!board.length) {
    return <div>Generando tablero...</div>;
  }

  // Helper function to build class names dynamically
  const getCellClassName = (cell: Cell, rowIndex: number, colIndex: number) => {
    const classNames = [styles.cell];
    
    const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
    const isRelated =
      selectedCell &&
      !isSelected &&
      (selectedCell.row === rowIndex ||
        selectedCell.col === colIndex ||
        (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
          Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3)));

    if (cell.isClue) classNames.push(styles.isClue);
    else classNames.push(styles.notClue);

    if (isSelected) classNames.push(styles.isSelected);
    else if (isRelated) classNames.push(styles.isRelated);

    if (cell.isError) classNames.push(styles.isError);
    if (status === 'solved') classNames.push(styles.solvedCell);

    // Box borders
    if ((colIndex + 1) % 3 === 0 && colIndex < 8) classNames.push(styles.borderRight);
    if ((rowIndex + 1) % 3 === 0 && rowIndex < 8) classNames.push(styles.borderBottom);

    return classNames.join(' ');
  };

  return (
    <div className={styles.boardContainer}>
      {status === 'paused' && <PauseOverlay />}
      {status === 'solved' && (
        <div className={styles.solvedOverlay}>
          <div className={styles.solvedStamp}>Resuelto</div>
        </div>
      )}
      <div
        className={styles.boardGrid}
        style={{
          '--board-border-color': difficulty
            ? `var(--color-${difficulty})`
            : 'var(--grid-line-strong)',
        } as React.CSSProperties}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={getCellClassName(cell, rowIndex, colIndex)}
            >
              {cell.value || ''}
            </div>
          ))
        )}
      </div>
    </div>
  );
};