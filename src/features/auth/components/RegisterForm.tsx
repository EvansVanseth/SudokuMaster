import type { FC } from 'react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

// Helper for password validation (OWASP-compliant rules)
const validatePassword = (password: string): string | null => {
  if (password.length < 8) return 'Mínimo 8 caracteres.';
  if (!/[A-Z]/.test(password)) return 'Debe incluir al menos una mayúscula.';
  if (!/[a-z]/.test(password)) return 'Debe incluir al menos una minúscula.';
  if (!/[0-9]/.test(password)) return 'Debe incluir al menos un número.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Debe incluir al menos un carácter especial.';
  return null;
};

export const RegisterForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUpWithEmail } = useAuth();

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!displayName.trim()) {
      setError('El nombre a mostrar es obligatorio.');
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail(email, password, displayName);
      setShowConfirmation(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
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
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          placeholder="••••••••"
          required
        />
        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', whiteSpace: 'nowrap' }}>
          <label htmlFor="showPassword" style={{ fontSize: '0.85rem', marginRight: '1rem', marginLeft: '1rem' }}>Mostrar</label>
          <input
            id="showPassword"
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            style={{ margin: 0, marginLeft: '1rem' }}
          />
        </div>
        {passwordError && <p className="error-message" style={{ color: '#ff9966', marginTop: '0.5rem' }}>{passwordError}</p>}
      </div>
      <button type="submit" className="btn-primary" disabled={loading || !!passwordError} style={{ width: '100%' }}>
        {loading ? 'Registrando...' : 'Crear Cuenta'}
      </button>
    </form>
  );
};
