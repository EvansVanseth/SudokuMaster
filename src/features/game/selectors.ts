import type { Board } from '../../domain/types';

export function getExhaustedNumbers(board: Board): Set<number> {
  if (!board.length) return new Set();

  const counts = new Array(10).fill(0); // indices 0–9, index 0 unused (values are 1–9)

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const val = board[r][c].value;
      if (val !== null) counts[val]++;
    }
  }

  const exhausted = new Set<number>();
  for (let n = 1; n <= 9; n++) {
    if (counts[n] === 9) exhausted.add(n);
  }

  return exhausted;
}
