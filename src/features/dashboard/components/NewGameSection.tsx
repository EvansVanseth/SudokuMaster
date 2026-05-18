import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../../features/game/store/gameStore';
import type { Difficulty } from '../../../domain/types';
import styles from './NewGameSection.module.css';

const difficulties: { key: Difficulty; label: string; className: string }[] = [
  { key: 'easy', label: 'Fácil', className: 'btn-primary' },
  { key: 'medium', label: 'Media', className: 'btn-secondary' },
  { key: 'hard', label: 'Difícil', className: 'btn-secondary' },
];

export const NewGameSection: FC = () => {
  const navigate = useNavigate();

  const handleStart = (difficulty: Difficulty) => {
    useGameStore.getState().startGame(difficulty);
    navigate(`/game/${difficulty}`);
  };

  return (
    <section>
      <h2 className={styles.title}>Nueva Partida</h2>
      <div className={styles.buttons}>
        {difficulties.map(({ key, label, className }) => (
          <button
            key={key}
            onClick={() => handleStart(key)}
            className={`${styles.button} ${className}`}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
};
