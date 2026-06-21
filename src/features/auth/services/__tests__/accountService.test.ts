import { deleteAccount } from '../accountService';
import { supabase } from '../../../../shared/api/supabaseClient';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../../../shared/api/supabaseClient', () => ({
  supabase: {
    auth: {
      deleteUser: vi.fn(),
    } as any,
  },
}));

describe('accountService', () => {
  it('should call supabase.auth.deleteUser', async () => {
    (supabase.auth as any).deleteUser.mockResolvedValue({ error: null });
    await deleteAccount();
    expect((supabase.auth as any).deleteUser).toHaveBeenCalled();
  });
});
