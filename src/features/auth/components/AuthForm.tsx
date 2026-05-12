import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const AuthForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmail, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión.');
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
