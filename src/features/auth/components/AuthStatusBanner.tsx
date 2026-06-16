import type { FC } from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from './AuthStatusBanner.module.css';

export const AuthStatusBanner: FC = () => {
  const { user } = useAuth();

  return (
    <div className={styles.banner}>
      {user ? (
        <p className={styles.loggedIn}>✅ Partida guardada automáticamente en tu perfil.</p>
      ) : (
        <p className={styles.loggedOut}>⚠️ Inicia sesión para guardar tu progreso y competir.</p>
      )}
    </div>
  );
};
