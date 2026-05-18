import { useEffect, useState, useCallback } from 'react';
import type { FC } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { loadCompletedGamesForUser } from '../../../features/game/services/gamePersistence';
import type { Difficulty, GameSummary } from '../../../domain/types';
import { FilterBar } from '../components/FilterBar';
import { HistoryList } from '../components/HistoryList';
import styles from './HistoryPage.module.css';

export const HistoryPage: FC = () => {
  const { user } = useAuth();

  const [games, setGames] = useState<GameSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchGames = useCallback(async () => {
    if (!user?.id) return;

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
  }, [user?.id, difficulty, sortOrder]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

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
      </div>
    </div>
  );
};
