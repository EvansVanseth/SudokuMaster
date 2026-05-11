import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AuthForm: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmail, signUpWithEmail, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
        alert('Revisa tu email para confirmar la cuenta (si está activado en Supabase)');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div className="form-group">
        <label htmlFor="email">Correo electrónico</label>
        <input 
          id="email"
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          placeholder="ejemplo@correo.com"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input 
          id="password"
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          placeholder="••••••••"
        />
      </div>

      {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

      <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%' }}>
        {isLoading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </button>

      <div className="auth-toggle">
        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Regístrate' : 'Inicia sesión'}
        </span>
      </div>
    </form>
  );
};
