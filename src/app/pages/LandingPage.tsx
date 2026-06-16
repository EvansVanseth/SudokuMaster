import { useState, useCallback, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserBanner } from '../../features/auth/components/UserBanner';
import { SudokuPreviewCard } from '../../shared/ui/SudokuPreviewCard';
import { CreditsSection } from '../../features/dashboard/components/CreditsSection';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { generateSudoku } from '../../domain/sudokuEngine';
import { restoreSessionGameState, type PersistedGameState } from '../../features/game/store/gameStore';
import { RefreshIcon } from '../../shared/ui/icons';
import styles from './LandingPage.module.css';

const TRIVIA_LIST = [
  "¿Sabías que...? El Sudoku, aunque popularizado en Japón en los 80, tiene raíces que se remontan a los 'Number Place' de revistas de puzzles estadounidenses de finales del siglo XIX. ¡Un clásico reinventado!",
  "Consejo Pro: No intentes adivinar nunca. Cada celda de un Sudoku bien diseñado tiene una única solución lógica. Si tienes que adivinar, es que te has saltado una deducción lógica previa.",
  "¿Sabías que...? En un Sudoku de 9x9, el número máximo de pistas necesarias para garantizar una única solución es de 77. Menos de 17 pistas hacen que el Sudoku sea matemáticamente imposible de resolver de forma única.",
  "Consejo: La técnica del 'Escaneo' es fundamental. Mira las filas, columnas y bloques de 3x3 para identificar dónde puede ir un número específico. ¡Es la forma más rápida de avanzar en las fases iniciales!",
  "La historia cuenta que Leonhard Euler, el famoso matemático suizo, sentó las bases lógicas de lo que hoy conocemos como Sudoku con sus 'cuadrados latinos'. ¡Estás jugando con matemáticas de alto nivel!",
  "¿Sabías que...? Existe una comunidad mundial de jugadores que se dedica a resolver Sudokus extremos. Algunos requieren técnicas avanzadas como 'X-Wing' o 'Swordfish' para encontrar el siguiente número.",
  "Consejo: Si sientes que te has bloqueado, deja el tablero unos minutos. A menudo, cuando volvemos a mirar la cuadrícula con ojos frescos, esa cifra que no veíamos aparece casi mágicamente.",
  "La belleza del Sudoku reside en su simplicidad: solo necesitas los números del 1 al 9, pero las combinaciones posibles son astronómicas. ¡Es un entrenamiento de gimnasio para tus neuronas!",
  "¿Sabías que...? La simetría en los Sudokus es puramente estética. Matemáticamente, el tablero no necesita ser simétrico para tener una única solución, pero a los diseñadores nos encanta que se vea equilibrado.",
  "Consejo final: Paciencia y perseverancia. El Sudoku no es una carrera de velocidad, sino una danza lógica. Disfruta el proceso de desentrañar cada casilla paso a paso."
];

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
  const [trivia, setTrivia] = useState(TRIVIA_LIST[0]);
  
  const handleRegenerate = useCallback(() => setGrids(createGrids()), []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * TRIVIA_LIST.length);
      setTrivia(TRIVIA_LIST[randomIndex]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);
  
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
            <p>Elige un nivel y comienza a entrenar tu mente.</p>
            <button onClick={handleRegenerate} className={`btn-secondary ${styles.regenerateButton}`}>
              <RefreshIcon width={18} height={18} />
              Generar nuevos tableros
            </button>
          </div>
          <div className={styles.previewGrid}>
            <SudokuPreviewCard
              title="Desafío Relajante"
              difficulty="easy"
              grid={grids.easy}
              onPreviewSelect={() => restoreSessionGameState(buildPreviewState(grids.easy, 'easy'))}
            />
            <SudokuPreviewCard
              title="Reto Intermedio"
              difficulty="medium"
              grid={grids.medium}
              onPreviewSelect={() => restoreSessionGameState(buildPreviewState(grids.medium, 'medium'))}
            />
            <SudokuPreviewCard
              title="El Experto"
              difficulty="hard"
              grid={grids.hard}
              onPreviewSelect={() => restoreSessionGameState(buildPreviewState(grids.hard, 'hard'))}
            />
          </div>
        </section>

        <section className={styles.trivia}>
          <h2 className={styles.sectionTitle}>¿Sabías que...?</h2>
          <p key={trivia} className={styles.triviaText}>
            {trivia}
          </p>
        </section>

        {!user && (
          <section className={styles.cta}>
            <h2 className={styles.sectionTitle}>¿Listo para empezar?</h2>
            <p style={{ marginBottom: '1rem' }}>Crea una cuenta para guardar tu progreso, competir en clasificaciones y acceder a desafíos exclusivos.</p>
            <button onClick={() => navigate('/register')} className={styles.ctaButton}>
              Crear Cuenta Gratis
            </button>
            <CreditsSection />
          </section>
        )}
      </main>
    </div>
  );
};
