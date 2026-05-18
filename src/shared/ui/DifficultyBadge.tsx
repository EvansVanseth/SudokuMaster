import type { FC } from 'react';
import type { Difficulty } from '../../domain/types';
import styles from './DifficultyBadge.module.css';

interface Props {
  difficulty: Difficulty;
}

const labelMap: Record<Difficulty, string> = {
  easy: 'Fácil',
  medium: 'Media',
  hard: 'Difícil',
};

const badgeClass: Record<Difficulty, string> = {
  easy: styles.easy,
  medium: styles.medium,
  hard: styles.hard,
};

export const DifficultyBadge: FC<Props> = ({ difficulty }) => {
  return (
    <span className={`${styles.badge} ${badgeClass[difficulty]}`}>
      {labelMap[difficulty]}
    </span>
  );
};
