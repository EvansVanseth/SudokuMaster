import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../shared/api/supabaseClient';

export const AuthCallback: FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = new URLSearchParams(window.location.search).get('code');

      if (!code) {
        setError('No se recibió el código de autenticación.');
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setError(error.message);
        return;
      }

      navigate('/dashboard', { replace: true });
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="glass-card" style={{ maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
        <h1>Error de autenticación</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
      <p>Verificando tu sesión...</p>
    </div>
  );
};
