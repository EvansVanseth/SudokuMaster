import { supabase } from '../../../shared/api/supabaseClient';
import type { PersistedGameState } from '../store/gameStore';

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
): Promise<Array<RemoteGameRecord> | { error: Error }> => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .order('updated_at', { ascending: false });

  return error ? { error } : ((data as RemoteGameRecord[]) ?? []);
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
  const { error } = await supabase.from('games').delete().eq('id', savedGameId);
  return { error: error ?? undefined };
};

