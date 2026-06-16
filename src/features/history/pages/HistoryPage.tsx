import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { loadCompletedGamesForUser } from '../../../features/game/services/gamePersistence';
import type { Difficulty, GameSummary } from '../../../domain/types';
import { FilterBar } from '../components/FilterBar';
import { HistoryList } from '../components/HistoryList';
import { DashboardIcon } from '../../../shared/ui/icons';
import styles from './HistoryPage.module.css';

export const HistoryPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [games, setGames] = useState<GameSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (!user?.id) return;

    const fetchGames = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const options: { difficulty?: Difficulty; sortOrder?: 'asc' | 'desc' } = {
          sortOrder,
        };

        if (difficulty !== 'all') {
          options.difficulty = difficulty;
        }

        const result = await loadCompletedGamesForUser(user.id, options);

        if ('error' in result) {
          setError(result.error.message);
        } else {
          setGames(result);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : String(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [user?.id, difficulty, sortOrder]);

  const handleDifficultyChange = (newDifficulty: Difficulty | 'all') => {
    setDifficulty(newDifficulty);
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.card} glass-card`}>
        <h2 className={styles.title}>Historial</h2>
        <p className={styles.subtitle}>
          Revisa tus partidas completadas, filtra por dificultad y ordena por fecha.
        </p>

        <FilterBar
          difficulty={difficulty}
          sortOrder={sortOrder}
          onDifficultyChange={handleDifficultyChange}
          onSortToggle={handleSortToggle}
        />

        <HistoryList games={games} isLoading={isLoading} error={error} />

        <button
          onClick={() => navigate('/dashboard')}
          className="btn-secondary"
          style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
        >
          <DashboardIcon width={16} height={16} />
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};
