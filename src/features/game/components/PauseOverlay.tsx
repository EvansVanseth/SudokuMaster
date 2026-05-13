import React from 'react';
import styles from './PauseOverlay.module.css';

export const PauseOverlay: React.FC = () => {
  return (
    <div className={styles.overlay}>
      <span>Pausado</span>
    </div>
  );
};
