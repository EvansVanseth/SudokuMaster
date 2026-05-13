import React from 'react';
import { useGameStore } from '../store/gameStore';

export const BoardUI: React.FC = () => {
  const { board, selectedCell, selectCell } = useGameStore((state) => ({
    board: state.board,
    selectedCell: state.selectedCell,
    selectCell: state.selectCell,
  }));

  const handleCellClick = (row: number, col: number) => {
    selectCell(row, col);
  };

  if (!board.length) {
    return <div>Loading board...</div>;
  }

  return (
    <div className="grid grid-cols-9 gap-0.5 bg-gray-700 w-full max-w-lg aspect-square">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          const isRelated =
            selectedCell &&
            (selectedCell.row === rowIndex ||
              selectedCell.col === colIndex ||
              (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3)));

          const borderRight = (colIndex + 1) % 3 === 0 && colIndex < 8;
          const borderBottom = (rowIndex + 1) % 3 === 0 && rowIndex < 8;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={`
                flex items-center justify-center text-2xl font-bold aspect-square cursor-pointer
                ${cell.isClue ? 'text-gray-900' : 'text-blue-600'}
                ${isSelected ? 'bg-blue-200' : isRelated ? 'bg-gray-200' : 'bg-white'}
                ${cell.isError ? 'text-red-500' : ''}
                ${borderRight ? 'border-r-2 border-gray-700' : ''}
                ${borderBottom ? 'border-b-2 border-gray-700' : ''}
                hover:bg-blue-100 transition-colors duration-200
              `}
            >
              {cell.value || ''}
            </div>
          );
        })
      )}
    </div>
  );
};
