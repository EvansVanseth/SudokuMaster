import type { FC } from 'react';
import { GithubIcon } from '../../../shared/ui/icons';
import styles from './CreditsSection.module.css';

export const CreditsSection: FC = () => {
  return (
    <div className={styles.credits}>
      <span>Designed & Programmed by</span>
      <a href="https://github.com/EvansVanseth" target="_blank" rel="noopener noreferrer" className={styles.link}>
        <GithubIcon width={16} height={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
        EvansVanseth
      </a>
      <a href="https://portfolio-juanalonso.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.portfolioLink}>
        (Visita mi Portfolio)
      </a>
    </div>
  );
};
