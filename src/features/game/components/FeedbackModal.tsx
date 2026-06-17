import { useState } from 'react';
import type { FC } from 'react';
import { supabase } from '../../../shared/api/supabaseClient';
import { useAuth } from '../../auth/hooks/useAuth';
import styles from './FeedbackModal.module.css';

declare const __APP_VERSION__: string;
// Using global constant defined in vite.config.ts
const APP_VERSION = __APP_VERSION__;

interface FeedbackModalProps {
  onClose: () => void;
}

export const FeedbackModal: FC<FeedbackModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit intentado. Usuario:", user, "Mensaje:", message);
    if (!user || !message.trim()) return;

    setLoading(true);
    console.log("Iniciando envío...");

    try {
      // 1. Insert into feedback table
      const { error: dbError } = await supabase
        .from('feedback')
        .insert([{ user_id: user.id, message, app_version: APP_VERSION }]);

      if (dbError) throw dbError;

      // 2. Invoke Edge Function
      await supabase.functions.invoke('send-feedback', {
        body: { message, app_version: APP_VERSION, user_email: user.email }
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Error al enviar:', err);
      alert('Hubo un error al enviar tu sugerencia.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h3>¡Muchas gracias!</h3>
          <p>Tu sugerencia ha sido enviada correctamente.</p>
          <div className={styles.actions}>
            <button onClick={onClose} className="btn-primary">Cerrar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>¿Alguna sugerencia de mejora?</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe aquí tu idea..."
            required
            rows={4}
          />
          <div className={styles.actions}>
            <button type="button" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading || !message.trim()}>
              {loading ? 'Enviando...' : 'Enviar Sugerencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
