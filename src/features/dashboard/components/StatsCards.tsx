import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Difficulty, GameStats } from '../../../domain/types';
import styles from './StatsCards.module.css';

const difficultyConfig: {
  key: 'global' | Difficulty;
  label: string;
  colorVar: string;
  textVar: string;
}[] = [
  { key: 'global', label: 'Global', colorVar: '--color-global', textVar: '--color-global-text' },
  { key: 'easy', label: 'Fácil', colorVar: '--color-easy', textVar: '--color-easy-text' },
  { key: 'medium', label: 'Media', colorVar: '--color-medium', textVar: '--color-medium-text' },
  { key: 'hard', label: 'Difícil', colorVar: '--color-hard', textVar: '--color-hard-text' },
];

interface Props {
  stats: GameStats;
}

export const StatsCards: FC<Props> = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        {difficultyConfig.map(({ key, label, colorVar }) => {
          const borderStyle = { borderColor: `var(${colorVar})` };

          if (key === 'global') {
            return (
              <div key={key} className={styles.groupCard} style={borderStyle}>
                <span className={styles.groupLabel} style={{ color: `var(${colorVar})` }}>
                  {label}
                </span>
                <div className={styles.statRow}>
                  <span className={styles.statValue}>{stats.totalGames}</span>
                  <span className={styles.statLabel}>Total Partidas</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statValue}>
                    {Math.round(stats.avgTimeOverall / 60)}m
                  </span>
                  <span className={styles.statLabel}>Tiempo Promedio</span>
                </div>
              </div>
            );
          }

          const diff = key as Difficulty;
          return (
            <div key={key} className={styles.groupCard} style={borderStyle}>
              <span className={styles.groupLabel} style={{ color: `var(${colorVar})` }}>
                {label}
              </span>
              <div className={styles.statRow}>
                <span className={styles.statValue}>{stats.completedByDifficulty[diff]}</span>
                <span className={styles.statLabel}>Completadas</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statValue}>
                  {Math.round(stats.avgTimeByDifficulty[diff] / 60)}m
                </span>
                <span className={styles.statLabel}>Tiempo Promedio</span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate('/dashboard/history')}
        className="btn-secondary"
        style={{ marginTop: '1rem' }}
      >
        Ver Historial Completo
      </button>
    </section>
  );
};
