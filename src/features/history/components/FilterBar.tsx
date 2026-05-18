import type { FC } from 'react';
import type { Difficulty } from '../../../domain/types';
import styles from './FilterBar.module.css';

interface Props {
  difficulty: Difficulty | 'all';
  sortOrder: 'asc' | 'desc';
  onDifficultyChange: (difficulty: Difficulty | 'all') => void;
  onSortToggle: () => void;
}

export const FilterBar: FC<Props> = ({
  difficulty,
  sortOrder,
  onDifficultyChange,
  onSortToggle,
}) => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label htmlFor="difficulty-filter" className={styles.label}>
          Dificultad
        </label>
        <select
          id="difficulty-filter"
          className={styles.select}
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value as Difficulty | 'all')}
        >
          <option value="all">Todas</option>
          <option value="easy">Fácil</option>
          <option value="medium">Media</option>
          <option value="hard">Difícil</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Orden</label>
        <button
          type="button"
          className={styles.sortButton}
          onClick={onSortToggle}
          aria-label="Cambiar ordenación"
        >
          {sortOrder === 'desc' ? 'Más recientes' : 'Más antiguas'}
        </button>
      </div>
    </div>
  );
};
