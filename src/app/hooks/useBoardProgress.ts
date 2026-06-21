import { useState, useEffect } from 'react';

export const useBoardProgress = (intervalMs: number = 15000) => {
  const [boardProgress, setBoardProgress] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let frameId: number;

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const newProgress = Math.min((elapsed / intervalMs) * 100, 100);
      setBoardProgress(newProgress);

      if (elapsed < intervalMs) {
        frameId = requestAnimationFrame(animate);
      } else {
        // Aseguramos que se inicie el siguiente ciclo si el interval aún no ha disparado
        frameId = requestAnimationFrame(animate); 
      }
    };

    frameId = requestAnimationFrame(animate);
    
    const interval = setInterval(() => {
      start = null; // Reset animation start time
    }, intervalMs);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(interval);
    };
  }, [intervalMs]);

  return { boardProgress };
};
