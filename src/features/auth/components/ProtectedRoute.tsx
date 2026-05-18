import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  children: ReactNode;
}

export const ProtectedRoute: FC<Props> = ({ children }) => {
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
