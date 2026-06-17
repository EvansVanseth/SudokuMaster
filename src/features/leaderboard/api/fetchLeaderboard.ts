import { supabase } from '../../../shared/api/supabaseClient';

export async function fetchLeaderboard() {
  const { data, error } = await supabase
    .from('top_players_view')
    .select('*')
    .order('total_score', { ascending: false })
    .limit(10);

  return { data, error };
}
