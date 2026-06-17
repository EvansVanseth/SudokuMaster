import type { FC } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute';
import { LoginButton } from '../../features/auth/components/LoginButton';
import { AuthForm } from '../../features/auth/components/AuthForm';
import { LandingPage } from '../pages/LandingPage';
import { RegisterPage } from '../pages/RegisterPage';
import { GamePage } from '../../pages/GamePage';
import { AuthCallback } from '../pages/AuthCallback';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';
import { HistoryPage } from '../../features/history/pages/HistoryPage';
import { LeaderboardPage } from '../../features/leaderboard/pages/LeaderboardPage';
import AccountPage from '../pages/AccountPage';

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

export const AppRouter: FC = () => {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/game/:difficulty" element={<GamePage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/history" 
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
};
