import { useState, useCallback } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserBanner } from '../../features/auth/components/UserBanner';
import { SudokuPreviewCard } from '../../shared/ui/SudokuPreviewCard';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { generateSudoku } from '../../domain/sudokuEngine';

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
    <div className="landing-page" style={{ color: '#fff' }}>
      <header style={{ padding: '1rem 2rem', background: 'rgba(0,0,0,0.2)' }}>
        <UserBanner />
      </header>

      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <section className="hero" style={{ marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Bienvenido a SudokuMaster</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            El lugar definitivo para desafiar tu mente, mejorar tu lógica y convertirte en un maestro del Sudoku.
          </p>
        </section>

        <section className="previews" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '2rem' }}>Partidas que te esperan</h2>
            <button onClick={handleRegenerate} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Generar nuevos tableros
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <SudokuPreviewCard title="Desafío Relajante" difficulty="easy" grid={grids.easy} />
            <SudokuPreviewCard title="Reto Intermedio" difficulty="medium" grid={grids.medium} />
            <SudokuPreviewCard title="El Experto" difficulty="hard" grid={grids.hard} />
          </div>
        </section>

        <section className="trivia" style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '12px', maxWidth: '800px', margin: '0 auto 4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¿Sabías que...?</h2>
          <p>
            El Sudoku moderno fue popularizado en Japón en 1986 por Nikoli, aunque sus orígenes se remontan a los "Number Place" de revistas de puzzles americanas. Un Sudoku bien planteado solo tiene una única solución posible.
          </p>
        </section>

        {!user && (
          <section className="cta" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¿Listo para empezar?</h2>
            <p style={{ marginBottom: '2rem' }}>Crea una cuenta para guardar tu progreso, competir en clasificaciones y acceder a desafíos exclusivos.</p>
            <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.2rem', margin: 'auto' }}>
              Crear Cuenta Gratis
            </button>
          </section>
        )}
      </main>
    </div>
  );
};
