import React from 'react';
import { useGameStore } from '../store/gameStore';

export const Numpad: React.FC = () => {
  const { enterNumber, deleteNumber } = useGameStore((state) => ({
    enterNumber: state.enterNumber,
    deleteNumber: state.deleteNumber,
  }));

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full">
      <div className="grid grid-cols-3 gap-2">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => enterNumber(num)}
            className="py-3 font-bold text-xl bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {num}
          </button>
        ))}
        <button
          onClick={deleteNumber}
          className="col-span-3 py-3 font-bold text-lg bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
