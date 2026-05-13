import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import styles from './Controls.module.css';

export const Controls: React.FC = () => {
  const status = useGameStore((state) => state.status);
  const timer = useGameStore((state) => state.timer);
  const togglePause = useGameStore((state) => state.togglePause);
  const toggleConfirmExit = useGameStore((state) => state.toggleConfirmExit);

  useEffect(() => {
    let interval: number | undefined;
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
    <div className={styles.controls}>
      <div>
        <span className={styles.timer}>{formatTime(timer)}</span>
      </div>
      <button onClick={togglePause} className="btn-secondary">
        {status === 'playing' ? 'Pausa' : 'Reanudar'}
      </button>
      <button
        // onClick={newGame} // TODO: Implement new game functionality
        className="btn-primary"
      >
        Nueva Partida
      </button>
      <button onClick={toggleConfirmExit} className="btn-secondary">
        Salir
      </button>
    </div>
  );
};