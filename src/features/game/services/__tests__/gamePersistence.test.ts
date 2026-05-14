import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveGameStateToSupabase, loadPendingGamesForUser, deleteSavedGame, remoteGameRecordToPersistedState } from '../gamePersistence';

vi.mock('../../../../shared/api/supabaseClient', () => {
  const singleMock = vi.fn();
  const eqMock = vi.fn();
  const orderMock = vi.fn();
  const chain = { eq: eqMock, order: orderMock, single: singleMock };
  eqMock.mockImplementation(() => chain);
  orderMock.mockImplementation(() => chain);
  const selectMock = vi.fn(() => chain);
  const insertMock = vi.fn(() => ({ single: singleMock }));
  const updateMock = vi.fn(() => chain);
  const fromMock = vi.fn(() => ({
    select: selectMock,
    insert: insertMock,
    update: updateMock,
    eq: eqMock,
    order: orderMock,
    single: singleMock,
  }));

  ;(globalThis as unknown as Record<string, unknown>).testSupabaseMocks = {
    singleMock,
    eqMock,
    orderMock,
    selectMock,
    insertMock,
    updateMock,
    fromMock,
  };

  return {
    supabase: {
      from: fromMock,
    },
  };
});

const getMocks = () => (globalThis as unknown as Record<string, unknown>).testSupabaseMocks as {
  singleMock: ReturnType<typeof vi.fn>;
  eqMock: ReturnType<typeof vi.fn>;
  orderMock: ReturnType<typeof vi.fn>;
  selectMock: ReturnType<typeof vi.fn>;
  insertMock: ReturnType<typeof vi.fn>;
  updateMock: ReturnType<typeof vi.fn>;
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

describe('gamePersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mocks = getMocks();
    mocks.singleMock.mockClear();
    mocks.eqMock.mockClear();
    mocks.orderMock.mockClear();
    mocks.selectMock.mockClear();
    mocks.insertMock.mockClear();
    mocks.updateMock.mockClear();
    mocks.fromMock.mockClear();
  });

  it('inserta una nueva partida cuando no existe savedGameId', async () => {
    const mocks = getMocks();
    const returned = { id: 'game-id-1' };
    mocks.singleMock.mockResolvedValue({ data: returned, error: null });

    const result = await saveGameStateToSupabase('user-123', exampleGameState);

    expect(mocks.fromMock).toHaveBeenCalledWith('games');
    expect(mocks.insertMock).toHaveBeenCalled();
    expect(result.id).toBe('game-id-1');
    expect(result.error).toBeUndefined();
  });

  it('actualiza una partida existente cuando savedGameId está presente', async () => {
    const mocks = getMocks();
    const returned = { id: 'game-id-2' };
    mocks.singleMock.mockResolvedValue({ data: returned, error: null });

    const result = await saveGameStateToSupabase('user-123', exampleGameState, 'game-id-2');

    expect(mocks.fromMock).toHaveBeenCalledWith('games');
    expect(mocks.updateMock).toHaveBeenCalled();
    expect(mocks.eqMock).toHaveBeenCalledWith('id', 'game-id-2');
    expect(result.id).toBe('game-id-2');
    expect(result.error).toBeUndefined();
  });

  it('carga partidas pendientes por usuario', async () => {
    const mocks = getMocks();
    const pending = [{ id: 'game-id-3', user_id: 'user-123', board: exampleBoard, difficulty: 'easy', status: 'in_progress' as const, time_spent: 15, is_winner: false, created_at: '2026-05-14T10:00:00Z', updated_at: '2026-05-14T10:15:00Z' }];
    mocks.orderMock.mockResolvedValue({ data: pending, error: null });

    const result = await loadPendingGamesForUser('user-123');

    expect(mocks.fromMock).toHaveBeenCalledWith('games');
    expect(result).toEqual(pending);
  });

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

  it('elimina una partida correctamente', async () => {
    const mocks = getMocks();
    mocks.fromMock.mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    });

    const result = await deleteSavedGame('game-id-5');

    expect(result.error).toBeUndefined();
  });
});
