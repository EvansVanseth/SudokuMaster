import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const AuthForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmail, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (/invalid login credentials/i.test(msg)) {
        setError('Correo o contraseña incorrectos.');
      } else if (/email not confirmed/i.test(msg)) {
        setError('¿Has confirmado el email para la creación de la cuenta que te enviamos? Revisa tu bandeja de entrada o carpeta de spam.');
      } else {
        setError(msg || 'Error al iniciar sesión.');
      }
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
          type={showPassword ? 'text' : 'password'} 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          placeholder="••••••••"
        />
        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', whiteSpace: 'nowrap' }}>
          <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#87CEEB' }}>
            ¿Olvidaste tu contraseña?
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="showPassword" style={{ fontSize: '0.85rem' }}>Mostrar</label>
            <input
              id="showPassword"
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{ margin: 0 }}
            />
          </div>
        </div>
      </div>

      {error && <p style={{ color: '#ff9966', fontSize: '0.85rem', marginBottom: '1rem', marginTop: '0.5rem' }}>{error}</p>}

      <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%' }}>
        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        ¿No tienes cuenta?{' '}
        <Link to="/register" style={{ color: '#87CEEB' }}>
          Regístrate
        </Link>
      </p>
    </form>
  );
};
