import { useState, useCallback } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserBanner } from '../../features/auth/components/UserBanner';
import { SudokuPreviewCard } from '../../shared/ui/SudokuPreviewCard';
import { CreditsSection } from '../../features/dashboard/components/CreditsSection';
import { LeaderboardSection } from '../../features/leaderboard/components/LeaderboardSection';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { generateSudoku } from '../../domain/sudokuEngine';
import { restoreSessionGameState, type PersistedGameState } from '../../features/game/store/gameStore';
import { RefreshIcon } from '../../shared/ui/icons';
import { useTriviaRotation } from '../hooks/useSudokuRotation';
import { useBoardProgress } from '../hooks/useBoardProgress';
import styles from './LandingPage.module.css';

function createGrids() {
  return {
    easy: generateSudoku('easy').map(row => row.map(cell => cell.value)),
    medium: generateSudoku('medium').map(row => row.map(cell => cell.value)),
    hard: generateSudoku('hard').map(row => row.map(cell => cell.value)),
  };
}

const buildPreviewState = (grid: (number | null)[][], difficulty: 'easy' | 'medium' | 'hard'): PersistedGameState => {
  const board = grid.map(row =>
    row.map(value => ({
      value: value === null ? null : value,
      isClue: value !== null,
      isError: false,
    }))
  );

  return {
    board,
    initialBoard: JSON.parse(JSON.stringify(board)),
    selectedCell: null,
    status: 'playing',
    timer: 0,
    difficulty,
  };
};

export const LandingPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [grids, setGrids] = useState(createGrids);
  const { currentTrivia, currentDifficulty, rotateDifficulty, triviaProgress } = useTriviaRotation();
  const { boardProgress } = useBoardProgress();
  
  const handleRegenerate = useCallback(() => {
    setGrids(createGrids());
    rotateDifficulty();
  }, [rotateDifficulty]);

  const difficultyConfig = {
    easy: { title: "Desafío Relajante", grid: grids.easy },
    medium: { title: "Reto Intermedio", grid: grids.medium },
    hard: { title: "El Experto", grid: grids.hard },
  }[currentDifficulty];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <UserBanner />
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Bienvenido a SudokuMaster</h1>
          <p className={styles.heroText}>
            El lugar definitivo para desafiar tu mente, mejorar tu lógica y convertirte en un maestro del Sudoku.
          </p>
        </section>

        <div className={styles.gameSectionContainer}>
          <section className={styles.previews}>
            <div className={styles.previewHeader}>
              <h2 className={styles.sectionTitle}>Partidas que te esperan</h2>
              <p>Elige un nivel y comienza a entrenar tu mente.</p>
              <button onClick={handleRegenerate} className={`btn-secondary ${styles.regenerateButton}`}>
                <RefreshIcon width={18} height={18} />
                Generar nuevos tableros
              </button>
            </div>
            <div className={styles.previewGrid}>
              <SudokuPreviewCard
                title={difficultyConfig.title}
                difficulty={currentDifficulty}
                grid={difficultyConfig.grid}
                progress={boardProgress}
                onPreviewSelect={() => restoreSessionGameState(buildPreviewState(difficultyConfig.grid, currentDifficulty))}
              />
            </div>
          </section>

          <LeaderboardSection />
        </div>

        <section className={styles.trivia}>
          <h2 className={styles.sectionTitle}>Curiosidades</h2>
          <p className={styles.triviaText}>{currentTrivia}</p>
          <div style={{ 
            width: `${triviaProgress}%`, 
            height: '3px', 
            background: 'var(--primary)', 
            position: 'absolute', 
            bottom: 0, 
            left: 0
          }} />
        </section>

        {!user && (
          <section className={styles.cta}>
            <h2 className={styles.sectionTitle}>¿Listo para empezar?</h2>
            <p style={{ marginBottom: '1rem' }}>Crea una cuenta para guardar tu progreso, competir en clasificaciones y acceder a desafíos exclusivos.</p>
            <button onClick={() => navigate('/register')} className={styles.ctaButton}>
              Crear Cuenta Gratis
            </button>
          </section>
        )}

        <CreditsSection />
      </main>
    </div>
  );
};
