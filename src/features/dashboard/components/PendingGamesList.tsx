import type { FC } from 'react';
import type { GameSummary } from '../../../domain/types';
import { DifficultyBadge } from '../../../shared/ui/DifficultyBadge';
import { Modal } from '../../../shared/ui/Modal';
import styles from './PendingGamesList.module.css';

interface Props {
  games: GameSummary[];
  isLoading: boolean;
  error: string | null;
  gameToDelete: string | null;
  onResume: (gameId: string) => void;
  onDelete: (gameId: string) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

const difficultyLabel: Record<string, string> = {
  easy: 'Fácil',
  medium: 'Media',
  hard: 'Difícil',
};

function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const seg = seconds % 60;
  return `${min} min ${seg} seg`;
}

export const PendingGamesList: FC<Props> = ({
  games,
  isLoading,
  error,
  gameToDelete,
  onResume,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
}) => {
  return (
    <section>
      <h2 className={styles.title}>Partidas pendientes</h2>

      {error && <p className={styles.error}>Error: {error}</p>}

      {isLoading ? (
        <p className={styles.statusMessage}>Cargando partidas pendientes...</p>
      ) : games.length === 0 ? (
        <p className={styles.statusMessage}>
          No tienes partidas pendientes. Comienza una nueva partida para guardarla automáticamente.
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Dificultad</th>
                <th>Tiempo</th>
                <th>Actualizado</th>
                <th className={styles.actionsHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id}>
                  <td data-label="Dificultad">
                    <DifficultyBadge difficulty={game.difficulty} />
                  </td>
                  <td data-label="Tiempo">{formatTime(game.timeSpent)}</td>
                  <td data-label="Actualizado">
                    {new Date(game.completedAt).toLocaleString()}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => onResume(game.id)}
                        className="btn-primary"
                      >
                        Reanudar
                      </button>
                      <button
                        onClick={() => onDelete(game.id)}
                        className="btn-danger"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={gameToDelete !== null} onClose={onCancelDelete}>
        <h2>¿Eliminar partida?</h2>
        <p>
          Esta acción <strong>NO se puede deshacer</strong>. La partida se borrará
          permanentemente y no podrás recuperarla.
        </p>
        <div className={styles.modalActions}>
          <button onClick={onCancelDelete} className="btn-secondary">
            No
          </button>
          <button onClick={onConfirmDelete} className="btn-danger">
            Sí, eliminar
          </button>
        </div>
      </Modal>
    </section>
  );
};
