import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSudokuRotation } from '../useSudokuRotation';

describe('useSudokuRotation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should rotate trivia after the specified interval', () => {
    const intervalMs = 15000;
    const { result } = renderHook(() => useSudokuRotation(intervalMs));

    const initialTrivia = result.current.currentTrivia;

    act(() => {
      vi.advanceTimersByTime(intervalMs);
    });

    expect(result.current.currentTrivia).not.toBe(initialTrivia);
  });
});
