import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import {
  loadPendingGamesForUser,
  loadSavedGameById,
  deleteSavedGame,
  remoteGameRecordToPersistedState,
  getGameStats,
} from '../../../features/game/services/gamePersistence';
import { restoreSessionGameState } from '../../../features/game/store/gameStore';
import type { Difficulty, GameStats, GameSummary } from '../../../domain/types';
import { NewGameSection } from '../components/NewGameSection';
import { StatsCards } from '../components/StatsCards';
import { PendingGamesList } from '../components/PendingGamesList';
import { HomeIcon, LogoutIcon } from '../../../shared/ui/icons';
import styles from './DashboardPage.module.css';

export const DashboardPage: FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<GameStats | null>(null);
  const [pendingGames, setPendingGames] = useState<GameSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);

  const getDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.display_name || user.user_metadata?.full_name || user.email;
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [statsResult, pendingResult] = await Promise.all([
          getGameStats(user.id),
          loadPendingGamesForUser(user.id),
        ]);

        if ('error' in statsResult) {
          setError(statsResult.error.message);
        } else {
          setStats(statsResult);
        }

        if ('error' in pendingResult) {
          setError(pendingResult.error.message);
          setPendingGames([]);
        } else {
          setPendingGames(
            pendingResult.map((r) => ({
              id: r.id,
              difficulty: r.difficulty as Difficulty,
              timeSpent: r.time_spent,
              isWinner: r.is_winner,
              completedAt: r.updated_at,
            }))
          );
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : String(loadError));
        setPendingGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleResume = async (savedGameId: string) => {
    if (!user?.id) return;

    const result = await loadSavedGameById(savedGameId);
    if ('error' in result) {
      setError(result.error.message);
      return;
    }

    const restoredState = remoteGameRecordToPersistedState(result);
    restoreSessionGameState(restoredState);
    navigate(`/game/${restoredState.difficulty}`);
  };

  const handleDelete = (savedGameId: string) => {
    setGameToDelete(savedGameId);
  };

  const confirmDelete = async () => {
    if (!gameToDelete) return;

    const { error } = await deleteSavedGame(gameToDelete);
    if (error) {
      setError(error.message);
      setGameToDelete(null);
      return;
    }

    setPendingGames((prev) => prev.filter((g) => g.id !== gameToDelete));
    setGameToDelete(null);

    // Refresh stats after deleting a game
    const statsResult = await getGameStats(user!.id);
    if (!('error' in statsResult)) {
      setStats(statsResult);
    }
  };

  const cancelDelete = () => {
    setGameToDelete(null);
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.card} glass-card`}>
        <h1 className={styles.greeting}>¡Bienvenido, {getDisplayName()}!</h1>
        <p className={styles.subtitle}>
          Tu progreso se guarda automáticamente mientras juegas. Reanuda una partida
          pendiente o comienza una nueva.
        </p>

        {stats && <StatsCards stats={stats} />}

        <NewGameSection />

        <div className={styles.pendingSection}>
          <PendingGamesList
            games={pendingGames}
            isLoading={isLoading}
            error={error}
            gameToDelete={gameToDelete}
            onResume={handleResume}
            onDelete={handleDelete}
            onConfirmDelete={confirmDelete}
            onCancelDelete={cancelDelete}
          />
        </div>

        <div className={styles.footer}>
          <button onClick={() => navigate('/')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HomeIcon width={16} height={16} />
            Volver al Inicio
          </button>
          <button onClick={signOut} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogoutIcon width={16} height={16} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
