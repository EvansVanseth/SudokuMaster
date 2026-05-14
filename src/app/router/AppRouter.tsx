import { useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { LoginButton } from '../../features/auth/components/LoginButton';
import { AuthForm } from '../../features/auth/components/AuthForm';
import { LandingPage } from '../pages/LandingPage';
import { RegisterPage } from '../pages/RegisterPage';
import { GamePage } from '../../pages/GamePage';
import { AuthCallback } from '../pages/AuthCallback';
import {
  loadPendingGamesForUser,
  loadSavedGameById,
  deleteSavedGame,
  remoteGameRecordToPersistedState,
  type RemoteGameRecord,
} from '../../features/game/services/gamePersistence';
import { restoreSessionGameState } from '../../features/game/store/gameStore';

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="glass-card" style={{ textAlign: 'center' }}>
        <p>Cargando sesión...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const LoginPage: FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="glass-card" style={{ maxWidth: '450px', margin: '0 auto' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1>SudokuMaster</h1>
      </Link>
      <p style={{ marginBottom: '2rem' }}>Entrena tu mente con el desafío definitivo. Inicia sesión para guardar tu progreso.</p>
      <AuthForm />
      <div className="divider">o</div>
      <LoginButton />
      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        ¿Quieres volver a la página principal?{' '}
        <Link to="/" style={{ color: '#87CEEB', textDecoration: 'none' }}>
          Volver a Landing
        </Link>
      </p>
    </div>
  );
};

const Dashboard: FC = () => {
  const { user, signOut } = useAuth();
  const [pendingGames, setPendingGames] = useState<RemoteGameRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.display_name || user.user_metadata?.full_name || user.email;
  };

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchGames = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await loadPendingGamesForUser(user.id);
        if ('error' in result) {
          setError(result.error.message);
          setPendingGames([]);
          return;
        }

        setPendingGames(result.map((record) => ({ ...record })));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : String(loadError));
        setPendingGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [user?.id]);

  const navigate = useNavigate();

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

  const handleDelete = async (savedGameId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta partida?')) return;

    const { error } = await deleteSavedGame(savedGameId);
    if (error) {
      setError(error.message);
      return;
    }

    setPendingGames((prev) => prev.filter((g) => g.id !== savedGameId));
  };

  const difficultyMap: Record<string, string> = {
    easy: 'Fácil',
    medium: 'Media',
    hard: 'Difícil',
  };

  return (
    <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
      <h1>¡Bienvenido, {getDisplayName()}!</h1>
      <p style={{ marginBottom: '2.5rem' }}>
        Tu progreso se guarda automáticamente mientras juegas. Reanuda una partida pendiente o comienza una nueva.
      </p>

      <section>
        <h2 style={{ marginBottom: '1rem' }}>Nueva Partida</h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/game/easy')} className="btn-primary" style={{ minWidth: '120px' }}>
            Fácil
          </button>
          <button onClick={() => navigate('/game/medium')} className="btn-secondary" style={{ minWidth: '120px' }}>
            Media
          </button>
          <button onClick={() => navigate('/game/hard')} className="btn-secondary" style={{ minWidth: '120px' }}>
            Difícil
          </button>
        </div>
      </section>

      <section style={{ marginTop: '4rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Partidas pendientes</h2>
        {error && <p style={{ color: '#ff6b6b' }}>Error: {error}</p>}
        {isLoading ? (
          <p>Cargando partidas pendientes...</p>
        ) : pendingGames.length === 0 ? (
          <p>No tienes partidas pendientes. Comienza una nueva partida para guardarla automáticamente.</p>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.75rem 0' }}>Dificultad</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 0' }}>Tiempo</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 0' }}>Actualizado</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem 0' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendingGames.map((game) => (
                  <tr key={game.id} style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                    <td data-label="Dificultad" style={{ padding: '1rem 0', textAlign: 'left' }}>
                      {difficultyMap[game.difficulty] || game.difficulty}
                    </td>
                    <td data-label="Tiempo" style={{ padding: '1rem 0', textAlign: 'left' }}>
                      {Math.floor(game.time_spent / 60)} min {game.time_spent % 60} seg
                    </td>
                    <td data-label="Actualizado" style={{ padding: '1rem 0', textAlign: 'left' }}>
                      {new Date(game.updated_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => handleResume(game.id)} className="btn-primary" style={{ padding: '0.6rem 1rem' }}>
                          Reanudar
                        </button>
                        <button onClick={() => handleDelete(game.id)} className="btn-danger" style={{ padding: '0.6rem 1rem' }}>
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
      </section>

      <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/')} className="btn-secondary">
          Volver al Inicio
        </button>
        <button onClick={signOut} className="btn-secondary">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/game/:difficulty" element={<GamePage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
