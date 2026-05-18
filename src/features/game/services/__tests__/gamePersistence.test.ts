import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { GameSummary } from '../../../../domain/types';
import {
  saveGameStateToSupabase,
  loadPendingGamesForUser,
  deleteSavedGame,
  remoteGameRecordToPersistedState,
  loadCompletedGamesForUser,
  getGameStats,
} from '../gamePersistence';

// ─── Mock Supabase ─────────────────────────────────────────────────────────────
// The mock uses a thenable chain so any terminal method resolves correctly.

let _resolveData: { data: unknown; error: unknown } = { data: null, error: null };

function setQueryResult(data: unknown, error: unknown = null) {
  _resolveData = { data, error };
}

vi.mock('../../../../shared/api/supabaseClient', () => {
  const singleMock = vi.fn(() => chain);
  const eqMock = vi.fn(() => chain);
  const neqMock = vi.fn(() => chain);
  const orderMock = vi.fn(() => chain);
  const selectMock = vi.fn(() => chain);
  const insertMock = vi.fn(() => ({ single: singleMock }));
  const updateMock = vi.fn(() => chain);
  const deleteMock = vi.fn(() => ({
    eq: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  }));

  const chain = {
    select: selectMock,
    eq: eqMock,
    neq: neqMock,
    order: orderMock,
    single: singleMock,
    then: (onFulfilled: (value: unknown) => unknown) =>
      Promise.resolve(_resolveData).then(onFulfilled),
  };

  const fromMock = vi.fn(() => ({
    select: selectMock,
    insert: insertMock,
    update: updateMock,
    delete: deleteMock,
    eq: eqMock,
    order: orderMock,
    single: singleMock,
  }));

  (globalThis as unknown as Record<string, unknown>).testSupabaseMocks = {
    singleMock,
    eqMock,
    neqMock,
    orderMock,
    selectMock,
    insertMock,
    updateMock,
    deleteMock,
    fromMock,
  };

  return {
    supabase: { from: fromMock },
  };
});

const getMocks = () =>
  (globalThis as unknown as Record<string, unknown>).testSupabaseMocks as {
    singleMock: ReturnType<typeof vi.fn>;
    eqMock: ReturnType<typeof vi.fn>;
    neqMock: ReturnType<typeof vi.fn>;
    orderMock: ReturnType<typeof vi.fn>;
    selectMock: ReturnType<typeof vi.fn>;
    insertMock: ReturnType<typeof vi.fn>;
    updateMock: ReturnType<typeof vi.fn>;
    deleteMock: ReturnType<typeof vi.fn>;
    fromMock: ReturnType<typeof vi.fn>;
  };

const exampleBoard = Array.from({ length: 9 }, () =>
  Array.from({ length: 9 }, () => ({ value: null, isClue: false, isError: false }))
);

const exampleGameState = {
  board: exampleBoard,
  initialBoard: exampleBoard,
  selectedCell: null,
  status: 'playing' as const,
  timer: 42,
  difficulty: 'easy' as const,
};

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('gamePersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _resolveData = { data: null, error: null };
  });

  describe('saveGameStateToSupabase', () => {
    it('inserta una nueva partida cuando no existe savedGameId', async () => {
      const mocks = getMocks();
      setQueryResult({ id: 'game-id-1' });
      mocks.singleMock.mockReturnValue(
        Promise.resolve({ data: { id: 'game-id-1' }, error: null })
      );

      const result = await saveGameStateToSupabase('user-123', exampleGameState);

      expect(mocks.fromMock).toHaveBeenCalledWith('games');
      expect(mocks.insertMock).toHaveBeenCalled();
      expect(result.id).toBe('game-id-1');
      expect(result.error).toBeUndefined();
    });

    it('actualiza una partida existente cuando savedGameId está presente', async () => {
      const mocks = getMocks();
      mocks.singleMock.mockReturnValue(
        Promise.resolve({ data: { id: 'game-id-2' }, error: null })
      );

      const result = await saveGameStateToSupabase('user-123', exampleGameState, 'game-id-2');

      expect(mocks.fromMock).toHaveBeenCalledWith('games');
      expect(mocks.updateMock).toHaveBeenCalled();
      expect(mocks.eqMock).toHaveBeenCalledWith('id', 'game-id-2');
      expect(result.id).toBe('game-id-2');
      expect(result.error).toBeUndefined();
    });
  });

  describe('loadPendingGamesForUser', () => {
    it('carga partidas pendientes por usuario con columnas explícitas (sin board)', async () => {
      const mocks = getMocks();
      const pending = [
        {
          id: 'game-id-3',
          user_id: 'user-123',
          difficulty: 'easy',
          status: 'in_progress',
          time_spent: 15,
          is_winner: false,
          created_at: '2026-05-14T10:00:00Z',
          updated_at: '2026-05-14T10:15:00Z',
        },
      ];
      setQueryResult(pending);

      const result = await loadPendingGamesForUser('user-123');

      expect(mocks.fromMock).toHaveBeenCalledWith('games');
      // Must use explicit columns — no '*', no 'board'
      expect(mocks.selectMock).toHaveBeenCalledWith(
        'id, user_id, difficulty, status, time_spent, is_winner, created_at, updated_at'
      );
      expect(mocks.eqMock).toHaveBeenCalledWith('user_id', 'user-123');
      expect(mocks.orderMock).toHaveBeenCalledWith('updated_at', { ascending: false });
      expect(result).toEqual(pending);
    });

    it('retorna array vacío cuando no hay partidas pendientes', async () => {
      setQueryResult([]);

      const result = await loadPendingGamesForUser('user-123');

      expect(result).toEqual([]);
    });

    it('retorna error cuando Supabase falla', async () => {
      setQueryResult(null, new Error('Network error'));

      const result = await loadPendingGamesForUser('user-123');

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error.message).toContain('Network error');
      }
    });
  });

  describe('loadCompletedGamesForUser', () => {
    const completedGames: Array<Record<string, unknown>> = [
      {
        id: 'game-1',
        user_id: 'user-123',
        difficulty: 'easy',
        status: 'completed',
        time_spent: 120,
        is_winner: true,
        created_at: '2026-05-14T10:00:00Z',
        updated_at: '2026-05-15T12:00:00Z',
      },
      {
        id: 'game-2',
        user_id: 'user-123',
        difficulty: 'hard',
        status: 'completed',
        time_spent: 300,
        is_winner: false,
        created_at: '2026-05-13T08:00:00Z',
        updated_at: '2026-05-14T09:00:00Z',
      },
    ];

    const expectedSummaries: GameSummary[] = [
      {
        id: 'game-1',
        difficulty: 'easy',
        timeSpent: 120,
        isWinner: true,
        completedAt: '2026-05-15T12:00:00Z',
      },
      {
        id: 'game-2',
        difficulty: 'hard',
        timeSpent: 300,
        isWinner: false,
        completedAt: '2026-05-14T09:00:00Z',
      },
    ];

    it('carga partidas completadas con columnas explícitas (sin board) y las mapea a GameSummary', async () => {
      const mocks = getMocks();
      setQueryResult(completedGames);

      const raw = await loadCompletedGamesForUser('user-123');
      const result = raw as GameSummary[];

      expect(mocks.fromMock).toHaveBeenCalledWith('games');
      // Must NOT select '*' or 'board'
      expect(mocks.selectMock).toHaveBeenCalledWith(
        'id, user_id, difficulty, status, time_spent, is_winner, created_at, updated_at'
      );
      // Filters by user and completed status
      expect(mocks.eqMock).toHaveBeenCalledWith('user_id', 'user-123');
      expect(mocks.eqMock).toHaveBeenCalledWith('status', 'completed');
      // Default sort: newest first
      expect(mocks.orderMock).toHaveBeenCalledWith('updated_at', { ascending: false });
      // Maps snake_case DB → camelCase GameSummary
      expect(result).toEqual(expectedSummaries);
      // Verify board is NOT in the result
      expect(Object.keys(result[0])).not.toContain('board');
    });

    it('filtra por dificultad cuando se proporciona', async () => {
      const mocks = getMocks();
      setQueryResult([completedGames[0]]);

      const raw = await loadCompletedGamesForUser('user-123', { difficulty: 'easy' });
      const result = raw as GameSummary[];

      expect(mocks.eqMock).toHaveBeenCalledWith('difficulty', 'easy');
      expect(result).toHaveLength(1);
      expect(result[0].difficulty).toBe('easy');
    });

    it('ordena ascendente cuando se solicita', async () => {
      const mocks = getMocks();
      setQueryResult([...completedGames].reverse());

      const raw = await loadCompletedGamesForUser('user-123', { sortOrder: 'asc' });
      const result = raw as GameSummary[];

      expect(mocks.orderMock).toHaveBeenCalledWith('updated_at', { ascending: true });
      expect(result).toHaveLength(2);
    });

    it('retorna array vacío cuando no hay completadas', async () => {
      setQueryResult([]);

      const result = await loadCompletedGamesForUser('user-123');

      expect(result).toEqual([]);
    });

    it('retorna error cuando Supabase falla', async () => {
      setQueryResult(null, new Error('DB error'));

      const result = await loadCompletedGamesForUser('user-123');

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error.message).toContain('DB error');
      }
    });
  });

  describe('getGameStats', () => {
    const allGames = [
      // 2 completed, 1 winner + 1 loser
      { id: 'g1', difficulty: 'easy', status: 'completed', time_spent: 60, is_winner: true },
      { id: 'g2', difficulty: 'medium', status: 'completed', time_spent: 120, is_winner: false },
      { id: 'g3', difficulty: 'hard', status: 'in_progress', time_spent: 30, is_winner: false },
      { id: 'g4', difficulty: 'easy', status: 'completed', time_spent: 180, is_winner: true },
    ];

    it('calcula estadísticas correctamente desde todos los juegos', async () => {
      const mocks = getMocks();
      setQueryResult(allGames);

      const raw = await getGameStats('user-123');
      const stats = raw as import('../../../../domain/types').GameStats;

      expect(mocks.selectMock).toHaveBeenCalledWith(
        'id, user_id, difficulty, status, time_spent, is_winner, created_at, updated_at'
      );
      expect(mocks.eqMock).toHaveBeenCalledWith('user_id', 'user-123');
      expect(mocks.orderMock).not.toHaveBeenCalled(); // No sort needed for aggregation

      expect(stats.totalGames).toBe(4);
      expect(stats.completedGames).toBe(3);
    });

    it('calcula win rate correctamente', async () => {
      setQueryResult(allGames);

      const raw = await getGameStats('user-123');
      const stats = raw as import('../../../../domain/types').GameStats;

      // 3 completed games, 2 winners → 67% (rounded)
      expect(stats.winRate).toBeCloseTo(66.67, 0);
    });

    it('calcula tiempo promedio total correctamente', async () => {
      setQueryResult(allGames);

      const raw = await getGameStats('user-123');
      const stats = raw as import('../../../../domain/types').GameStats;

      // (60 + 120 + 30 + 180) / 4 = 97.5
      expect(stats.avgTimeOverall).toBeCloseTo(97.5, 0);
    });

    it('desglosa tiempo promedio por dificultad', async () => {
      setQueryResult(allGames);

      const raw = await getGameStats('user-123');
      const stats = raw as import('../../../../domain/types').GameStats;

      // easy: (60 + 180) / 2 = 120
      // medium: 120 / 1 = 120
      // hard: 30 / 1 = 30
      expect(stats.avgTimeByDifficulty.easy).toBeCloseTo(120, 0);
      expect(stats.avgTimeByDifficulty.medium).toBeCloseTo(120, 0);
      expect(stats.avgTimeByDifficulty.hard).toBeCloseTo(30, 0);
    });

    it('retorna ceros cuando no hay juegos', async () => {
      setQueryResult([]);

      const raw = await getGameStats('user-123');
      const stats = raw as import('../../../../domain/types').GameStats;

      expect(stats.totalGames).toBe(0);
      expect(stats.completedGames).toBe(0);
      expect(stats.winRate).toBe(0);
      expect(stats.avgTimeOverall).toBe(0);
      expect(stats.avgTimeByDifficulty.easy).toBe(0);
      expect(stats.avgTimeByDifficulty.medium).toBe(0);
      expect(stats.avgTimeByDifficulty.hard).toBe(0);
    });

    it('retorna error cuando Supabase falla', async () => {
      setQueryResult(null, new Error('Stats error'));

      const result = await getGameStats('user-123');

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error.message).toContain('Stats error');
      }
    });
  });

  describe('remoteGameRecordToPersistedState', () => {
    it('convierte un registro remoto en estado de partida válido', () => {
      const record = {
        id: 'game-id-4',
        user_id: 'user-123',
        board: exampleBoard,
        difficulty: 'hard' as const,
        status: 'in_progress' as const,
        time_spent: 90,
        is_winner: false,
        created_at: '2026-05-14T10:00:00Z',
        updated_at: '2026-05-14T10:15:00Z',
      };

      const state = remoteGameRecordToPersistedState(record);

      expect(state.board).toBe(record.board);
      expect(state.status).toBe('playing');
      expect(state.timer).toBe(90);
      expect(state.savedGameId).toBe('game-id-4');
    });
  });

  describe('deleteSavedGame', () => {
    it('elimina una partida correctamente', async () => {
      const mocks = getMocks();
      const deletedRecord = { id: 'game-id-5' };
      mocks.fromMock.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [deletedRecord], error: null }),
          }),
        }),
      });

      const result = await deleteSavedGame('game-id-5');

      expect(result.error).toBeUndefined();
    });

    it('retorna error si el delete de Supabase no afecta filas (RLS bloquea silenciosamente)', async () => {
      const mocks = getMocks();
      mocks.fromMock.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      const result = await deleteSavedGame('game-id-5');

      expect(result.error).toBeDefined();
      expect(result.error!.message).toContain('No se pudo eliminar');
    });
  });
});
