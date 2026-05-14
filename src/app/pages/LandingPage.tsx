import { useState, useCallback } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserBanner } from '../../features/auth/components/UserBanner';
import { SudokuPreviewCard } from '../../shared/ui/SudokuPreviewCard';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { generateSudoku } from '../../domain/sudokuEngine';
import styles from './LandingPage.module.css';

function createGrids() {
  return {
    easy: generateSudoku('easy').map(row => row.map(cell => cell.value)),
    medium: generateSudoku('medium').map(row => row.map(cell => cell.value)),
    hard: generateSudoku('hard').map(row => row.map(cell => cell.value)),
  };
}

export const LandingPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [grids, setGrids] = useState(createGrids);
  const handleRegenerate = useCallback(() => setGrids(createGrids()), []);
  
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

        <section className={styles.previews}>
          <div className={styles.previewHeader}>
            <h2 className={styles.sectionTitle}>Partidas que te esperan</h2>
            <button onClick={handleRegenerate} className="btn-secondary">
              Generar nuevos tableros
            </button>
          </div>
          <div className={styles.previewGrid}>
            <SudokuPreviewCard title="Desafío Relajante" difficulty="easy" grid={grids.easy} />
            <SudokuPreviewCard title="Reto Intermedio" difficulty="medium" grid={grids.medium} />
            <SudokuPreviewCard title="El Experto" difficulty="hard" grid={grids.hard} />
          </div>
        </section>

        <section className={styles.trivia}>
          <h2 className={styles.sectionTitle}>¿Sabías que...?</h2>
          <p>
            El Sudoku moderno fue popularizado en Japón en 1986 por Nikoli, aunque sus orígenes se remontan a los "Number Place" de revistas de puzzles americanas. Un Sudoku bien planteado solo tiene una única solución posible.
          </p>
        </section>

        {!user && (
          <section className={styles.cta}>
            <h2 className={styles.sectionTitle}>¿Listo para empezar?</h2>
            <p style={{ marginBottom: '2rem' }}>Crea una cuenta para guardar tu progreso, competir en clasificaciones y acceder a desafíos exclusivos.</p>
            <button onClick={() => navigate('/register')} className="btn-primary">
              Crear Cuenta Gratis
            </button>
          </section>
        )}
      </main>
    </div>
  );
};
