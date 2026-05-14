import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import styles from './Controls.module.css';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Controls: React.FC = () => {
  const status = useGameStore((state) => state.status);
  const timer = useGameStore((state) => state.timer);
  const togglePause = useGameStore((state) => state.togglePause);
  const toggleConfirmExit = useGameStore((state) => state.toggleConfirmExit);

  const tickTimer = useGameStore((state) => state.tickTimer);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: number | undefined;
    if (status === 'playing') {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, tickTimer]);

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
      <button onClick={togglePause} className="btn-secondary" disabled={status === 'solved'}>
        {status === 'playing' ? 'Pausa' : 'Reanudar'}
      </button>
      {status === 'solved' && <div style={{ marginLeft: '0.5rem', fontWeight: 700, color: '#075985' }}>Resuelto</div>}
      <button onClick={() => toggleConfirmExit(user?.id, () => navigate('/dashboard'))} className="btn-secondary">
        Salir
      </button>
    </div>
  );
};