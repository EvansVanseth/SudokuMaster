import type { FC } from 'react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const RegisterForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!displayName) {
      setError('El nombre a mostrar es obligatorio.');
      setLoading(false);
      return;
    }

    try {
      await signUpWithEmail(email, password, displayName);
      // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito.
      // Por ahora, solo limpiamos el formulario.
    } catch (err: any) {
      setError(err.message || 'Error al registrar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="displayName">Nombre a mostrar</label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Tu nombre público"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Registrando...' : 'Crear Cuenta'}
      </button>
    </form>
  );
};
