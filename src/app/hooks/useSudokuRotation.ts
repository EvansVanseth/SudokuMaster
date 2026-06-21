import { useState, useEffect } from 'react';

const TRIVIA_LIST = [
  "¿Sabías que...? El Sudoku, aunque popularizado en Japón en los 80, tiene raíces que se remontan a los 'Number Place' de revistas de puzzles estadounidenses de finales del siglo XIX. ¡Un clásico reinventado!",
  "Consejo Pro: No intentes adivinar nunca. Cada celda de un Sudoku bien diseñado tiene una única solución lógica. Si tienes que adivinar, es que te has saltado una deducción lógica previa.",
  "¿Sabías que...? En un Sudoku de 9x9, el número máximo de pistas necesarias para garantizar una única solución es de 77. Menos de 17 pistas hacen que el Sudoku sea matemáticamente imposible de resolver de forma única.",
  "Consejo: La técnica del 'Escaneo' es fundamental. Mira las filas, columnas y bloques de 3x3 para identificar dónde puede ir un número específico. ¡Es la forma más rápida de avanzar en las fases iniciales!",
  "La historia cuenta que Leonhard Euler, el famoso matemático suizo, sentó las bases lógicas de lo que hoy conocemos como Sudoku con sus 'cuadrados latinos'. ¡Estás jugando con matemáticas de alto nivel!",
  "¿Sabías que...? Existe una comunidad mundial de jugadores que se dedica a resolver Sudokus extremos. Algunos requieren técnicas avanzadas como 'X-Wing' o 'Swordfish' para encontrar el siguiente número.",
  "Consejo: Si sientes que te has bloqueado, deja el tablero unos minutos. A menudo, cuando volvemos a mirar la cuadrícula con ojos frescos, esa cifra que no veíamos aparece casi mágicamente.",
  "La belleza del Sudoku reside en su simplicidad: solo necesitas los números del 1 al 9, pero las combinaciones posibles son astronómicas. ¡Es un entrenamiento de gimnasio para tus neuronas!",
  "¿Sabías que...? La simetría en los Sudokus es puramente estética. Matemáticamente, el tablero no necesita ser simétrico para tener una única solución, pero a los diseñadores nos encanta que se vea equilibrado.",
  "Consejo final: Paciencia y perseverancia. El Sudoku no es una carrera de velocidad, sino una danza lógica. Disfruta el proceso de desentrañar cada casilla paso a paso."
];

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TriviaHookResult {
  currentTrivia: string;
  currentDifficulty: Difficulty;
  rotateDifficulty: () => void;
  triviaProgress: number;
}

export const useTriviaRotation = (intervalMs: number = 15000): TriviaHookResult => {
  const [currentTrivia, setCurrentTrivia] = useState(TRIVIA_LIST[0]);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('easy');
  const [triviaProgress, setTriviaProgress] = useState(0);

  const rotateDifficulty = () => {
    setCurrentDifficulty(prev => {
      if (prev === 'easy') return 'medium';
      if (prev === 'medium') return 'hard';
      return 'easy';
    });
  };

  useEffect(() => {
    let start: number | null = null;
    let frameId: number;

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const newProgress = Math.min((elapsed / intervalMs) * 100, 100);
      setTriviaProgress(newProgress);

      if (elapsed < intervalMs) {
        frameId = requestAnimationFrame(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    
    const interval = setInterval(() => {
      start = null; // Reset animation start time
      const randomIndex = Math.floor(Math.random() * TRIVIA_LIST.length);
      setCurrentTrivia(TRIVIA_LIST[randomIndex]);
      rotateDifficulty(); // ROTACIÓN AUTOMÁTICA
    }, intervalMs);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(interval);
    };
  }, [intervalMs]);

  return { currentTrivia, currentDifficulty, rotateDifficulty, triviaProgress };
};
