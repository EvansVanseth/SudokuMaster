import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAccount } from '../hooks/useAccount';
import { supabase } from '../../../shared/api/supabaseClient';

    vi.mock('../../../shared/api/supabaseClient', () => ({
    supabase: {
        from: vi.fn(() => ({
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ error: null }),
        })),
        auth: {
            signInWithPassword: vi.fn(),
            updateUser: vi.fn(),
            signOut: vi.fn().mockResolvedValue({ error: null }),
        },
        functions: {
            invoke: vi.fn().mockResolvedValue({ error: null }),
        }
    },
}));


vi.mock('../../auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '123', email: 'test@example.com' },
    refreshProfile: vi.fn(),
  }),
}));

describe('useAccount', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('updates profile successfully', async () => {
        const { result } = renderHook(() => useAccount());

        await act(async () => {
            await result.current.updateProfile('New Name');
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('changes password successfully', async () => {
        vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ data: {}, error: null } as any);
        vi.mocked(supabase.auth.updateUser).mockResolvedValue({ data: {}, error: null } as any);

        const { result } = renderHook(() => useAccount());

        await act(async () => {
            await result.current.changePassword('oldPass', 'newPass');
        });

        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'test@example.com', password: 'oldPass' });
        expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'newPass' });
        expect(result.current.error).toBe(null);
    });

    it('fails to change password with wrong current password', async () => {
        vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ error: new Error('Wrong password') } as any);

        const { result } = renderHook(() => useAccount());

        await act(async () => {
            await result.current.changePassword('wrongPass', 'newPass');
        });

        expect(result.current.error).toBe('Contraseña actual incorrecta');
        expect(supabase.auth.updateUser).not.toHaveBeenCalled();
    });

    it('deletes account successfully', async () => {
        vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ error: null } as any);
        const { result } = renderHook(() => useAccount());

        let success = false;
        await act(async () => {
            success = await result.current.deleteAccount('password');
        });

        expect(success).toBe(true);
        expect(supabase.functions.invoke).toHaveBeenCalledWith('delete-account', { body: {} });
        expect(supabase.auth.signOut).toHaveBeenCalled();
        expect(result.current.error).toBe(null);
    });
});
