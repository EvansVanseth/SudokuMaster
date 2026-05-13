import React from 'react';
import { BoardUI } from '../features/game/components/BoardUI';
import { Controls } from '../features/game/components/Controls';
import { Numpad } from '../features/game/components/Numpad';
import { useParams } from 'react-router-dom';
import { useGameStore } from '../features/game/store/gameStore';
import type { Difficulty } from '../domain/types';
import styles from './GamePage.module.css';

export const GamePage: React.FC = () => {
  const { difficulty } = useParams<{ difficulty: Difficulty }>();

  React.useEffect(() => {
    if (difficulty) {
      useGameStore.getState().startGame(difficulty);
    }
  }, [difficulty]);

  return (
    <div className={styles.gamePage}>
      <h1>SudokuMaster</h1>
      <div className={styles.gameLayout}>
        <div className={styles.boardContainer}>
          <BoardUI />
        </div>
        <div className={styles.controlsContainer}>
          <Controls />
          <Numpad />
        </div>
      </div>
    </div>
  );
};
