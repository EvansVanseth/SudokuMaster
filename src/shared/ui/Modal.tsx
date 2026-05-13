import type { FC, ReactNode } from 'react';
import styles from './Modal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: FC<Props> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={`${styles.modalContent} glass-card`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
