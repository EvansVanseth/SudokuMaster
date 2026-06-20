import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { fetchLeaderboard } from '../fetchLeaderboard';

// Mock Supabase
interface TestSupabaseMocks {
    selectMock: Mock;
    fromMock: Mock;
}

let _resolveData: { data: unknown; error: unknown } = { data: null, error: null };

function setQueryResult(data: unknown, error: unknown = null) {
  _resolveData = { data, error };
}

vi.mock('../../../../shared/api/supabaseClient', () => {
  const selectMock = vi.fn(() => chain);
  const chain = {
    select: selectMock,
    order: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    then: (onFulfilled: (value: unknown) => unknown) =>
      Promise.resolve(_resolveData).then(onFulfilled),
  };
  const fromMock = vi.fn(() => chain);
  
  (globalThis as unknown as Record<string, unknown>).testSupabaseMocks = {
    selectMock,
    fromMock,
  };
  
  return {
    supabase: { from: fromMock },
  };
});

describe('fetchLeaderboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        _resolveData = { data: null, error: null };
    });

    it('fetches leaderboard data from top_players_view', async () => {
        const mocks = (globalThis as unknown as Record<string, unknown>).testSupabaseMocks as TestSupabaseMocks;
         const mockData = [{ display_name: 'Player1', total_score: 100 }];
        setQueryResult(mockData);

        const result = await fetchLeaderboard();

        expect(mocks.fromMock).toHaveBeenCalledWith('top_players_view');
        expect(mocks.selectMock).toHaveBeenCalled();
        expect(result.data).toEqual(mockData);
        expect(result.error).toBeNull();
    });

    it('returns error if supabase query fails', async () => {
        const mockError = new Error('Database error');
        setQueryResult(null, mockError);

        const result = await fetchLeaderboard();

        expect(result.data).toBeNull();
        expect(result.error).toBe(mockError);
    });
});
