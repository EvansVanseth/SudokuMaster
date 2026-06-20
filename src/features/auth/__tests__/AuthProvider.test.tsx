import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from '../components/AuthProvider';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../../../shared/api/supabaseClient';

vi.mock('../../../shared/api/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(),
  },
}));

describe('AuthProvider Profile Synchronization', () => {
  it('fetches profile when user is present', async () => {
    // Setup mocks
    const mockUser = { id: '123' };
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: { user: mockUser } } } as any);
    
    // Mock profiles select
    const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { full_name: 'John Doe' }, error: null })
    };
    vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

    let authState: any;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            authState = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await waitFor(() => {
        // This is expected to fail initially as 'profile' is not in AuthContext
        expect(authState.profile).toEqual({ full_name: 'John Doe' });
    });
  });
});
