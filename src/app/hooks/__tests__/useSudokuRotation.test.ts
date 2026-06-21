import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTriviaRotation } from '../useSudokuRotation';

describe('useTriviaRotation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should rotate trivia after the specified interval', () => {
    const intervalMs = 15000;
    const { result } = renderHook(() => useTriviaRotation(intervalMs));

    const initialTrivia = result.current.currentTrivia;

    act(() => {
      vi.advanceTimersByTime(intervalMs);
    });

    expect(result.current.currentTrivia).not.toBe(initialTrivia);
  });
});
