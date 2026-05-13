import React from 'react';
import { BoardUI } from '../features/game/components/BoardUI';
import { Controls } from '../features/game/components/Controls';
import { Numpad } from '../features/game/components/Numpad';
import { useParams } from 'react-router-dom';
import { useGameStore } from '../features/game/store/gameStore';
import type { Difficulty } from '../domain/types';

export const GamePage: React.FC = () => {
  const { difficulty } = useParams<{ difficulty: Difficulty }>();

  React.useEffect(() => {
    if (difficulty) {
      useGameStore.getState().startGame(difficulty);
    }
  }, [difficulty]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">SudokuMaster</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[auto_280px] gap-8 w-full max-w-6xl mx-auto">
        <div className="flex justify-center">
          <BoardUI />
        </div>
        <div className="flex flex-col gap-6">
          <Controls />
          <Numpad />
        </div>
      </div>
    </div>
  );
};
