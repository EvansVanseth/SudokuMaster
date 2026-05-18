import type { FC, ReactNode } from 'react';
import styles from './StatCard.module.css';

interface Props {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

export const StatCard: FC<Props> = ({ label, value, icon }) => {
  return (
    <div className={styles.card}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};
