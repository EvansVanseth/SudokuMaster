import { supabase } from '../../../shared/api/supabaseClient';

export const deleteAccount = async () => {
  const { error } = await (supabase.auth as any).deleteUser();
  if (error) throw error;
};
