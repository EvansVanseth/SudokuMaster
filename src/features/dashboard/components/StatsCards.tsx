import type { FC } from 'react';
import type { GameStats } from '../../../domain/types';
import { StatCard } from '../../../shared/ui/StatCard';
import styles from './StatsCards.module.css';

interface Props {
  stats: GameStats;
}

export const StatsCards: FC<Props> = ({ stats }) => {
  return (
    <section className={styles.grid}>
      <StatCard label="Total Partidas" value={stats.totalGames} />
      <StatCard label="Completadas" value={stats.completedGames} />
      <StatCard label="% Victorias" value={`${Math.round(stats.winRate)}%`} />
      <StatCard
        label="Tiempo Promedio"
        value={`${Math.round(stats.avgTimeOverall / 60)}m`}
      />
    </section>
  );
};
