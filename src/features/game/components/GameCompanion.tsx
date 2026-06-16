import { useState, useEffect } from 'react';
import type { FC } from 'react';
import styles from './GameCompanion.module.css';

const TRIVIA_LIST = [
  "¿Sabías que...? Un Sudoku bien planteado tiene una única solución.",
  "Consejo: Si te bloqueas, busca el número que falta en una fila o columna.",
  "El Sudoku moderno fue popularizado en Japón en los años 80.",
  "¿Sabías que...? Existen variaciones de Sudoku con formas irregulares.",
  "Consejo: Empieza rellenando los números que más aparecen en el tablero.",
  "No adivines. La lógica pura siempre te llevará a la respuesta correcta.",
  "¿Sabías que...? El nombre significa 'números aislados' en japonés.",
  "Consejo: Escanea filas y columnas para encontrar el lugar de un número.",
  "La paciencia es tan importante como la lógica en el Sudoku.",
  "¡Cada partida de Sudoku es un entrenamiento único para tu cerebro!"
];

export const GameCompanion: FC = () => {
  const [trivia, setTrivia] = useState(TRIVIA_LIST[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * TRIVIA_LIST.length);
      setTrivia(TRIVIA_LIST[randomIndex]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.companion}>
      <p key={trivia} className={styles.triviaText}>{trivia}</p>
    </div>
  );
};
