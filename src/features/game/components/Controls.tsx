import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const Controls: React.FC = () => {
  const { status, timer, togglePause } = useGameStore((state) => ({
    status: state.status,
    timer: state.timer,
    togglePause: state.togglePause,
  }));

  useEffect(() => {
    let interval: number;
    if (status === 'playing') {
      interval = setInterval(() => {
        useGameStore.setState((state) => ({ timer: state.timer + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md w-full">
      <div>
        <span className="text-xl font-mono">{formatTime(timer)}</span>
      </div>
      <button
        onClick={togglePause}
        className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        {status === 'playing' ? 'Pause' : 'Resume'}
      </button>
      <button
        // onClick={newGame} // TODO: Implement new game functionality
        className="px-4 py-2 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600"
      >
        New Game
      </button>
    </div>
  );
};
