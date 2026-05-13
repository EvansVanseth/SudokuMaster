import type { FC, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { LoginButton } from '../../features/auth/components/LoginButton';
import { AuthForm } from '../../features/auth/components/AuthForm';
import { LandingPage } from '../pages/LandingPage';
import { RegisterPage } from '../pages/RegisterPage';
import { GamePage } from '../../pages/GamePage';
import { AuthCallback } from '../pages/AuthCallback';

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
    </div>
  );
};

const Dashboard: FC = () => {
  const { user, signOut } = useAuth();
  
  const getDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.display_name || user.user_metadata?.full_name || user.email;
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>¡Bienvenido, {getDisplayName()}!</h1>
      <p>Bienvenido de nuevo a SudokuMaster. Estamos preparando tu tablero...</p>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button className="btn-primary">Nueva Partida</button>
        <button onClick={signOut} className="btn-secondary">Cerrar Sesión</button>
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
