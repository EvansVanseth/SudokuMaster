import type { FC } from 'react';
import type { GameSummary } from '../../../domain/types';
import { DifficultyBadge } from '../../../shared/ui/DifficultyBadge';
import styles from './HistoryList.module.css';

interface Props {
  games: GameSummary[];
  isLoading: boolean;
  error: string | null;
}

function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const seg = seconds % 60;
  return `${min} min ${seg} seg`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString();
}

export const HistoryList: FC<Props> = ({ games, isLoading, error }) => {
  return (
    <section>
      <h2 className={styles.title}>Historial de partidas</h2>

      {error && <p className={styles.error}>Error: {error}</p>}

      {isLoading ? (
        <p className={styles.statusMessage}>Cargando historial...</p>
      ) : games.length === 0 ? (
        <p className={styles.statusMessage}>No hay partidas completadas.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Dificultad</th>
                <th>Tiempo</th>
                <th>Resultado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id}>
                  <td data-label="Dificultad">
                    <DifficultyBadge difficulty={game.difficulty} />
                  </td>
                  <td data-label="Tiempo">{formatTime(game.timeSpent)}</td>
                  <td data-label="Resultado">
                    <span className={game.isWinner ? styles.won : styles.lost}>
                      {game.isWinner ? 'Ganada' : 'Perdida'}
                    </span>
                  </td>
                  <td data-label="Fecha">{formatDate(game.completedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
