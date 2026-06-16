import { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 6;

  const totalPages = Math.ceil(games.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const paginatedGames = games.slice(startIndex, startIndex + gamesPerPage);
  
  // Rellenar con elementos vacíos para mantener altura constante
  const emptyRows = Math.max(0, gamesPerPage - paginatedGames.length);

  return (
    <section>
      <h2 className={styles.title}>Historial de partidas</h2>

      {error && <p className={styles.error}>Error: {error}</p>}

      {isLoading ? (
        <p className={styles.statusMessage}>Cargando historial...</p>
      ) : games.length === 0 ? (
        <p className={styles.statusMessage}>No hay partidas completadas.</p>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Dificultad</th>
                  <th>Tiempo</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGames.map((game) => (
                  <tr key={game.id} className={styles.row}>
                    <td data-label="Dificultad">
                      <DifficultyBadge difficulty={game.difficulty} />
                    </td>
                    <td data-label="Tiempo">{formatTime(game.timeSpent)}</td>
                    <td data-label="Fecha">{formatDate(game.completedAt)}</td>
                  </tr>
                ))}
                {Array.from({ length: emptyRows }).map((_, i) => (
                  <tr key={`empty-${i}`} className={`${styles.row} ${styles.emptyRow}`}>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-secondary"
              >
                Anterior
              </button>
              <span>Página {currentPage} de {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-secondary"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
