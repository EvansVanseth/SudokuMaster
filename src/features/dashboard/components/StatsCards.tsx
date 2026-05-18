import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameStats } from '../../../domain/types';
import { StatCard } from '../../../shared/ui/StatCard';
import styles from './StatsCards.module.css';

interface Props {
  stats: GameStats;
}

export const StatsCards: FC<Props> = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        <StatCard label="Total Partidas" value={stats.totalGames} />

        <StatCard
          label="Completadas (Fácil)"
          value={stats.completedByDifficulty.easy}
        />
        <StatCard
          label="Completadas (Media)"
          value={stats.completedByDifficulty.medium}
        />
        <StatCard
          label="Completadas (Difícil)"
          value={stats.completedByDifficulty.hard}
        />
        <StatCard label="Completadas (Total)" value={stats.completedGames} />

        <StatCard
          label="Tiempo Prom. (Fácil)"
          value={`${Math.round(stats.avgTimeByDifficulty.easy / 60)}m`}
        />
        <StatCard
          label="Tiempo Prom. (Media)"
          value={`${Math.round(stats.avgTimeByDifficulty.medium / 60)}m`}
        />
        <StatCard
          label="Tiempo Prom. (Difícil)"
          value={`${Math.round(stats.avgTimeByDifficulty.hard / 60)}m`}
        />
        <StatCard
          label="Tiempo Prom. (Global)"
          value={`${Math.round(stats.avgTimeOverall / 60)}m`}
        />
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
