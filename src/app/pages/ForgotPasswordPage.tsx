import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { supabase } from '../../shared/api/supabaseClient';
import { Link } from 'react-router-dom';
import styles from './AccountPage.module.css';

export const ForgotPasswordPage: FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      if (error.message.includes('rate limit')) {
        setError('Has realizado demasiados intentos. Por favor, inténtalo más tarde.');
      } else if (error.message.includes('invalid')) {
        setError('El correo electrónico no es válido.');
      } else {
        setError('Error al procesar la solicitud. Por favor, inténtalo de nuevo.');
      }
    } else {
      setMessage('Si tu cuenta existe y admite restablecimiento de contraseña, recibirás un correo con instrucciones.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.card} glass-card`}>
        <h1>Restablecer contraseña</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input 
              className={styles.input}
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="ejemplo@correo.com"
            />
          </div>
          
          {error && <p style={{ color: '#ff9966', fontSize: '0.85rem' }}>{error}</p>}
          {message && <p style={{ color: '#90EE90', fontSize: '0.85rem' }}>{message}</p>}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#87CEEB' }}>Volver a iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};
