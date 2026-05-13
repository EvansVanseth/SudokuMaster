import type { FC } from 'react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const RegisterForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
      setShowConfirmation(true);
    } catch (err: any) {
      const msg = err?.message || '';
      if (/already registered/i.test(msg)) {
        setError(
          'Este correo ya está registrado. Revisa tu bandeja de entrada o spam para confirmarlo, o inicia sesión.'
        );
      } else if (/rate limit/i.test(msg)) {
        setError(
          'Has solicitado demasiados correos en poco tiempo. Espera unos minutos y vuelve a intentarlo. Revisa tu bandeja de entrada o spam para el correo de confirmación.'
        );
      } else {
        setError(msg || 'Error al registrar la cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="confirmation-message" style={{ textAlign: 'center' }}>
        <h2>¡Registro exitoso!</h2>
        <p>
          Te hemos enviado un correo de confirmación a <strong>{email}</strong>.
        </p>
        <p>Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.</p>
        <p className="confirmation-note">¿No lo encuentras? Revisa también tu carpeta de spam.</p>
      </div>
    );
  }

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
