import type { FC } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { RegisterForm } from '../../features/auth/components/RegisterForm';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { LoginButton } from '../../features/auth/components/LoginButton';

export const RegisterPage: FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="glass-card" style={{ maxWidth: '450px', margin: '0 auto' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1>SudokuMaster</h1>
      </Link>
      <p style={{ marginBottom: '2rem' }}>Crea tu cuenta para guardar tu progreso y competir.</p>
      <RegisterForm />
      <div className="divider">o</div>
      <LoginButton />
      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" style={{ color: '#87CEEB' }}>
          Inicia Sesión
        </Link>
      </p>
    </div>
  );
};
