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
  const status = useGameStore((state) => state.status);
  const enterNumber = useGameStore((state) => state.enterNumber);
  const deleteNumber = useGameStore((state) => state.deleteNumber);
  const moveSelection = useGameStore((state) => state.moveSelection);

  React.useEffect(() => {
    if (difficulty) {
      useGameStore.getState().startGame(difficulty);
    }
  }, [difficulty]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (status !== 'playing') return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

      const { key } = event;
      if (/^[1-9]$/.test(key)) {
        enterNumber(Number(key));
        event.preventDefault();
      } else if (key === 'Backspace' || key === 'Delete') {
        deleteNumber();
        event.preventDefault();
      } else if (key === 'ArrowUp') {
        moveSelection('up');
        event.preventDefault();
      } else if (key === 'ArrowDown') {
        moveSelection('down');
        event.preventDefault();
      } else if (key === 'ArrowLeft') {
        moveSelection('left');
        event.preventDefault();
      } else if (key === 'ArrowRight') {
        moveSelection('right');
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, enterNumber, deleteNumber, moveSelection]);

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
            <Numpad />
            <Controls />
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
