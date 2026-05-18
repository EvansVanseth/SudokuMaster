import { supabase } from '../../../shared/api/supabaseClient';
import type { PersistedGameState } from '../store/gameStore';
import type { GameStats, GameSummary, Difficulty } from '../../../domain/types';

/**
 * Columnas explícitas para consultas de listado.
 * NUNCA incluye `board` — solo metadatos.
 */
const LIST_COLUMNS =
  'id, user_id, difficulty, status, time_spent, is_winner, created_at, updated_at';

export type RemoteGameRecord = {
  id: string;
  user_id: string;
  board: PersistedGameState['board'];
  difficulty: PersistedGameState['difficulty'];
  status: 'in_progress' | 'completed';
  time_spent: number;
  is_winner: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Versión ligera de RemoteGameRecord — sin el campo `board`.
 */
export type RemoteGameSummaryRecord = Omit<RemoteGameRecord, 'board'>;

const toGameSummary = (record: RemoteGameSummaryRecord): GameSummary => ({
  id: record.id,
  difficulty: record.difficulty as Difficulty,
  timeSpent: record.time_spent,
  isWinner: record.is_winner,
  completedAt: record.updated_at,
});

export const saveGameStateToSupabase = async (
  userId: string,
  gameState: PersistedGameState,
  savedGameId?: string
): Promise<{ id?: string; error?: Error }> => {
  const payload = {
    user_id: userId,
    board: gameState.board,
    difficulty: gameState.difficulty,
    status: gameState.status === 'solved' ? 'completed' : 'in_progress',
    time_spent: gameState.timer,
    is_winner: gameState.status === 'solved',
  };

  if (savedGameId) {
    const { data, error } = await supabase
      .from('games')
      .update(payload)
      .eq('id', savedGameId)
      .single<RemoteGameRecord>();

    return { id: data?.id, error: error ?? undefined };
  }

  const { data, error } = await supabase.from('games').insert(payload).single<RemoteGameRecord>();
  return { id: data?.id, error: error ?? undefined };
};

export const loadPendingGamesForUser = async (
  userId: string
): Promise<Array<RemoteGameSummaryRecord> | { error: Error }> => {
  const { data, error } = await supabase
    .from('games')
    .select(LIST_COLUMNS)
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .order('updated_at', { ascending: false });

  return error ? { error } : ((data as RemoteGameSummaryRecord[]) ?? []);
};

export interface LoadCompletedOptions {
  difficulty?: Difficulty;
  sortOrder?: 'asc' | 'desc';
}

export const loadCompletedGamesForUser = async (
  userId: string,
  options?: LoadCompletedOptions
): Promise<GameSummary[] | { error: Error }> => {
  let query = supabase
    .from('games')
    .select(LIST_COLUMNS)
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (options?.difficulty) {
    query = query.eq('difficulty', options.difficulty);
  }

  const orderDir = options?.sortOrder ?? 'desc';
  const { data, error } = await query.order('updated_at', { ascending: orderDir === 'asc' });

  if (error) return { error };

  const rows = (data as RemoteGameSummaryRecord[]) ?? [];
  return rows.map(toGameSummary);
};

export const getGameStats = async (
  userId: string
): Promise<GameStats | { error: Error }> => {
  const { data, error } = await supabase
    .from('games')
    .select(LIST_COLUMNS)
    .eq('user_id', userId);

  if (error) return { error };

  const rows = (data as RemoteGameSummaryRecord[]) ?? [];

  const totalGames = rows.length;
  const completedGames = rows.filter((r) => r.status === 'completed').length;

  const totalTime = rows.reduce((sum, r) => sum + r.time_spent, 0);
  const avgTimeOverall = totalGames > 0 ? totalTime / totalGames : 0;

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const completedByDifficulty = {} as Record<Difficulty, number>;
  const avgTimeByDifficulty = {} as Record<Difficulty, number>;

  for (const diff of difficulties) {
    const filtered = rows.filter((r) => r.difficulty === diff);
    completedByDifficulty[diff] = filtered.filter((r) => r.status === 'completed').length;
    avgTimeByDifficulty[diff] =
      filtered.length > 0
        ? filtered.reduce((sum, r) => sum + r.time_spent, 0) / filtered.length
        : 0;
  }

  return {
    totalGames,
    completedGames,
    completedByDifficulty,
    avgTimeOverall,
    avgTimeByDifficulty,
  };
};

export const loadSavedGameById = async (
  savedGameId: string
): Promise<RemoteGameRecord | { error: Error }> => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', savedGameId)
    .single<RemoteGameRecord>();

  return error ? { error } : (data as RemoteGameRecord);
};

export const remoteGameRecordToPersistedState = (record: RemoteGameRecord) => {
  return {
    board: record.board,
    initialBoard: JSON.parse(JSON.stringify(record.board)),
    selectedCell: null,
    status: record.status === 'completed' ? 'solved' : 'playing',
    timer: record.time_spent,
    difficulty: record.difficulty,
    savedGameId: record.id,
  } as const;
};

export const completeSavedGameIfNeeded = async (
  savedGameId: string,
  isWinner: boolean
): Promise<{ error?: Error }> => {
  const { error } = await supabase
    .from('games')
    .update({ status: isWinner ? 'completed' : 'in_progress', is_winner: isWinner })
    .eq('id', savedGameId);

  return { error: error ?? undefined };
};

export const deleteSavedGame = async (savedGameId: string): Promise<{ error?: Error }> => {
  const { data, error } = await supabase
    .from('games')
    .delete()
    .eq('id', savedGameId)
    .select();

  if (error) return { error };

  if (!data || data.length === 0) {
    return {
      error: new Error(
        'No se pudo eliminar la partida — es posible que no exista o que no tengas permisos.'
      ),
    };
  }

  return {};
};

