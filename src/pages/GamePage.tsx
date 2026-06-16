import React from 'react';
import { BoardUI } from '../features/game/components/BoardUI';
import { Controls } from '../features/game/components/Controls';
import { Numpad } from '../features/game/components/Numpad';
import { GameCompanion } from '../features/game/components/GameCompanion';
import { AuthStatusBanner } from '../features/auth/components/AuthStatusBanner';
import { FeedbackModal } from '../features/game/components/FeedbackModal';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore, restoreSessionGameState } from '../features/game/store/gameStore';
import { saveGameStateToSupabase, completeSavedGameIfNeeded } from '../features/game/services/gamePersistence';
import type { Difficulty } from '../domain/types';
import styles from './GamePage.module.css';
import { Modal } from '../shared/ui/Modal';
import { useAuth } from '../features/auth/hooks/useAuth';

export const GamePage: React.FC = () => {
  const { difficulty } = useParams<{ difficulty: Difficulty }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = React.useState(false);
  const isConfirmingExit = useGameStore((state) => state.isConfirmingExit);
  const toggleConfirmExit = useGameStore((state) => state.toggleConfirmExit);
  const status = useGameStore((state) => state.status);
  const board = useGameStore((state) => state.board);
  const timer = useGameStore((state) => state.timer);
  const savedGameId = useGameStore((state) => state.savedGameId);
  const enterNumber = useGameStore((state) => state.enterNumber);
  const deleteNumber = useGameStore((state) => state.deleteNumber);
  const moveSelection = useGameStore((state) => state.moveSelection);

  const saveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (!difficulty) return;

    const { board, difficulty: storedDifficulty, savedGameId } = useGameStore.getState();

    // CASO 1: Board vacío → generar nueva partida
    if (board.length === 0) {
      useGameStore.getState().startGame(difficulty);
      return;
    }

    // CASO 2: Board existe con la misma dificultad
    if (storedDifficulty === difficulty) {
      // Si tiene savedGameId → es una REANUDACIÓN explícita desde Supabase
      // La cargó Dashboard "Reanudar" via restoreSessionGameState con un ID real
      if (savedGameId) {
        return;
      }
      // Si NO tiene savedGameId → es una partida NUEVA, seteada explícitamente
      // por: (a) Landing Page preview via restoreSessionGameState, o
      //      (b) Dashboard "Nueva Partida" via startGame()
      // En ambos casos el estado ya está seteado → mantenerlo
      return;
    }

    // CASO 3: Board existe pero la dificultad NO coincide con la ruta
    // Ej: sessionStorage tenía 'medium' pero navegaste a /game/easy
    useGameStore.getState().startGame(difficulty);
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

  const flushRemoteSave = React.useCallback(async () => {
    if (!user?.id || !difficulty) return;

    const currentState = useGameStore.getState();
    if (currentState.status === 'initial') return;

    const { id, error } = await saveGameStateToSupabase(user.id, currentState, currentState.savedGameId);
    if (error) {
      console.warn('Error guardando partida en Supabase:', error.message);
      return;
    }

    if (id && id !== currentState.savedGameId) {
      restoreSessionGameState({ ...currentState, savedGameId: id });
    }
  }, [difficulty, user]);

  React.useEffect(() => {
    // When solved, flush remote save immediately and mark completed remotely if savedGameId exists
    if (status !== 'solved') return;

    (async () => {
      try {
        await flushRemoteSave();
        const current = useGameStore.getState();
        if (current.savedGameId) {
          await completeSavedGameIfNeeded(current.savedGameId, true);
        }
      } catch (e) {
        console.warn('Error marking game as completed remotely:', e);
      }
    })();
  }, [status, flushRemoteSave]);

  

  React.useEffect(() => {
    if (!user?.id || !difficulty) return;
    if (status === 'initial') return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      flushRemoteSave().catch((error) => {
        console.warn('Error en autoguardado remoto:', error);
      });
      saveTimeoutRef.current = null;
    }, 1200);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [board, timer, status, difficulty, savedGameId, user?.id, flushRemoteSave]);

  const handleConfirmExit = async () => {
    // Use centralized store API to handle save & exit when user is logged-in
    if (user) {
      await useGameStore.getState().toggleConfirmExit(user.id, () => navigate('/dashboard'));
    } else {
      console.log('Usuario anónimo: Saliendo a la landing page.');
      navigate('/');
      toggleConfirmExit(); // Cierra el modal
    }
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
            <GameCompanion />
            <Controls />
            <AuthStatusBanner />
            {user && (
              <button 
                onClick={() => setIsFeedbackModalOpen(true)} 
                className="btn-secondary" 
                style={{ marginTop: '1rem', width: '100%' }}
              >
                ¿Sugerencias?
              </button>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isConfirmingExit} onClose={() => toggleConfirmExit()}>
        <h2>¿Seguro que quieres salir?</h2>
        <p>
          {user
            ? 'Tu progreso actual se guardará.'
            : 'Si inicias sesión gratis, guardaremos tu partida automáticamente. Si sales ahora, el progreso se PERDERÁ.'}
        </p>
        <div className={styles.modalActions}>
          <button onClick={() => toggleConfirmExit()} className="btn-secondary">
            No
          </button>
          <button onClick={handleConfirmExit} className="btn-primary">
            Si
          </button>
        </div>
      </Modal>
      {isFeedbackModalOpen && <FeedbackModal onClose={() => setIsFeedbackModalOpen(false)} />}
    </>
  );
};
