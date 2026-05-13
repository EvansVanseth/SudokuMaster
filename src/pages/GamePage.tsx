import React from 'react';
import { BoardUI } from '../features/game/components/BoardUI';
import { Controls } from '../features/game/components/Controls';
import { Numpad } from '../features/game/components/Numpad';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../features/game/store/gameStore';
import type { Difficulty } from '../domain/types';
import styles from './GamePage.module.css';
import { Modal } from '../shared/ui/Modal';
import { useAuth } from '../features/auth/hooks/useAuth';

export const GamePage: React.FC = () => {
  const { difficulty } = useParams<{ difficulty: Difficulty }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isConfirmingExit = useGameStore((state) => state.isConfirmingExit);
  const toggleConfirmExit = useGameStore((state) => state.toggleConfirmExit);

  React.useEffect(() => {
    if (difficulty) {
      useGameStore.getState().startGame(difficulty);
    }
  }, [difficulty]);

  const handleConfirmExit = () => {
    if (user) {
      // TODO: Hito 5 - Guardar el estado del juego en la base de datos
      console.log('Usuario autenticado: Saliendo al dashboard. (Guardado pendiente)');
      navigate('/dashboard');
    } else {
      console.log('Usuario anónimo: Saliendo a la landing page.');
      navigate('/');
    }
    toggleConfirmExit(); // Cierra el modal
  };

  return (
    <>
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
      <Modal isOpen={isConfirmingExit} onClose={toggleConfirmExit}>
        <h2>¿Seguro que quieres salir?</h2>
        <p>
          {user
            ? 'Tu progreso actual se guardará.'
            : 'El progreso de la partida no se guardará.'}
        </p>
        <div className={styles.modalActions}>
          <button onClick={toggleConfirmExit} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={handleConfirmExit} className="btn-primary">
            Confirmar
          </button>
        </div>
      </Modal>
    </>
  );
};
