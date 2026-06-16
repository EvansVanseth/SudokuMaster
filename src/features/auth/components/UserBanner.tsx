import type { FC } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardIcon } from '../../../shared/ui/icons';

export const UserBanner: FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const getDisplayName = () => {
    if (!user) return '';
    // Prioridad: display_name de nuestro registro, luego full_name de OAuth (Google), fallback a email.
    return user.user_metadata?.display_name || user.user_metadata?.full_name || user.email;
  };

  if (isLoading) {
    return <div className="user-banner-loading">Cargando...</div>;
  }

  return (
    <div className="user-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {user ? (
        <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>¡Hola, <strong>{getDisplayName()}</strong>!</span>
          <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DashboardIcon width={16} height={16} />
            DashBoard
          </button>
        </div>
      ) : (
        <div className="guest-info" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', justifyContent: 'flex-end' }}>
          <button onClick={() => navigate('/login')} className="btn-secondary">
            Iniciar Sesión
          </button>
          <span style={{ color: '#ccc' }}>
            ¿Eres nuevo? <Link to="/register" style={{ color: '#87CEEB', textDecoration: 'none' }}>¡Regístrate!</Link>
          </span>
        </div>
      )}
    </div>
  );
};
